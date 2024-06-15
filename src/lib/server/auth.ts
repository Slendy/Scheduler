import type { Cookies } from "@sveltejs/kit";
import { TokenModel } from "./models";
import { dev } from "$app/environment";
import { randomBytes } from 'crypto';

export async function getUserFromCookie(cookies: Cookies) {
    const authCookie = cookies.get("auth-token");
    const refreshCookie = cookies.get("refresh-token");
    if (authCookie == undefined && refreshCookie == undefined) {
        return undefined;
    }

    let token = await TokenModel.findOne({ authToken: authCookie }).populate('user');

    // if token is expired
    if (token == undefined || Date.now() > token.authTokenExpiration.getTime()) {
        token = await TokenModel.findOne({ refreshToken: refreshCookie }).populate('user');
        if (token == undefined) return undefined;

        // generate new token and delete old one
        await TokenModel.deleteOne({ _id: token._id });

        let newToken = await generateToken(token.user);
        if (newToken == undefined) {
            console.error("Failed to generate new token for user", token)
            return undefined;
        }

        setCookieToken(cookies, newToken);
        token = newToken;
    }
    let tokenUser = token.user as any;

    return tokenUser.toObject();
}

export function setCookieToken(cookies: Cookies, token: any) {
    cookies.set('auth-token', token.authToken, {
        path: '/',
        maxAge: 60 * 60,
        httpOnly: true,
        sameSite: 'lax',
        // cookies should be secure if not in dev mode
        secure: !dev,
    });
    cookies.set('refresh-token', token.refreshToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev,
    });
}

function generateRandomToken() {
    return randomBytes(20).toString('hex');
}

export async function generateToken(user: any) {
    if (user == undefined) return undefined;

    console.log("Generated new token for user:", user.username)

    let token = await TokenModel.create({
        user: user._id,
        authToken: generateRandomToken(),
        refreshToken: generateRandomToken(),
        authTokenExpiration: Date.now() + (1000 * 60 * 60),
        expiresAt: Date.now() + (1000 * 60 * 60 * 24 * 30)
    });

    await token.populate('user');

    return token;
}