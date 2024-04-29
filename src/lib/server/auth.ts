import type { Cookies } from "@sveltejs/kit";
import { TokenModel } from "./models";
import { randomBytes } from 'crypto';

export async function getUserFromCookie(cookies: Cookies) {
    const authCookie = cookies.get("auth-token");
    const refreshCookie = cookies.get("refresh-token");
    if (authCookie == undefined && refreshCookie == undefined) {
        return undefined;
    }

    let token = await TokenModel.findOne({ authToken: authCookie }).populate('user');
    if (token == undefined || token.authTokenExpiration.getTime() < Date.now()) {
        token = await TokenModel.findOne({ refreshToken: refreshCookie }).populate('user');
        if (token == undefined) return undefined;

        // generate new token and refresh token
        await TokenModel.deleteOne({ _id: token._id });

        let newToken = await generateToken(token.user);
        if (newToken == undefined) {
            console.error("Failed to generate new token for user", token)
            return undefined;
        }

        setCookieToken(cookies, newToken);
        token = newToken;
    }

    return token.user as any;
}

export function setCookieToken(cookies: Cookies, token: any) {
    cookies.set('auth-token', token.authToken, {
        path: '/',
        maxAge: 60 * 60,
        httpOnly: true,
        sameSite: 'strict',
    });
    cookies.set('refresh-token', token.refreshToken, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: 'strict',
    });
}

function generateRandomToken() {
    return randomBytes(20).toString('hex');
}

export async function generateToken(user: any) {
    if (user == undefined) return undefined;

    console.log("Generated new token for user: ", user.username)

    let token = await TokenModel.create({
        user: user._id,
        authToken: generateRandomToken(),
        refreshToken: generateRandomToken(),
    });

    await token.populate('user');

    return token;
}