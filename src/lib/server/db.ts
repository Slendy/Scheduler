import { connect, type ConnectOptions } from 'mongoose';
import { EnvironmentModel, UserModel } from './models';
import { MONGO_URL } from '$env/static/private';

if (!MONGO_URL) {
    throw new Error('Please add your Mongo URI to .env.local')
}

export async function generateDefaultUser() {
    if (await UserModel.estimatedDocumentCount() === 0) {
        let defaultUser = new UserModel({
            username: "admin",
            isAdmin: true,
            permissionMap: {},
            passwordHash: "bruh",
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
            schedules: [],
        });
        await defaultEnvironment.save();
        console.log("No environments were found so a default environment has been created.");
    }
}

export async function connectToDb() {
    await connect(MONGO_URL, {
        serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    } as ConnectOptions);
}