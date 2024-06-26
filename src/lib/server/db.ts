import { connect, type ConnectOptions } from 'mongoose';
import { EnvironmentModel, UserModel } from './models';
import { env } from '$env/dynamic/private';

if (!env.MONGO_URL) {
    throw new Error('Please specify the MONGO_URI environment variable')
}

export async function generateDefaultUser() {
    if (await UserModel.estimatedDocumentCount() === 0) {
        let defaultUser = new UserModel({
            username: "admin",
            isAdmin: true,
            permissionMap: {},
            passwordHash: await Bun.password.hash("admin"),
        });
        await defaultUser.save();
        console.log("No users were found so a default admin user has been created.");
    }
}

export async function generateDefaultEnvironment() {
    if (await EnvironmentModel.estimatedDocumentCount() === 0) {
        let defaultEnvironment = new EnvironmentModel({
            environmentDomain: "example.com",
            environmentName: "default",
            isVerified: false,
            schedules: [],
        });
        await defaultEnvironment.save();
        console.log("No environments were found so a default environment has been created.");
    }
}

export async function connectToDb() {
    await connect(env.MONGO_URL, {
        serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    } as ConnectOptions);
}