import { Schema, model } from 'mongoose';
import { type IUser, type IEnvironment } from '$lib/shared/types';


const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    permissionMap: { type: Map, of: String, required: true },
    isAdmin: { type: Boolean, required: true },
    passwordHash: { type: String, required: true }
});

const eventSchema = new Schema({
    name: String,
    startTime: Number, // the number of milliseconds into the day
    endTime: Number,
}, { _id: false, })

const scheduleSchema = new Schema({
    scheduleId: String,
    name: String,
    isPublished: Boolean,
    events: [eventSchema]
}, { _id: false, });

const environmentSchema = new Schema<IEnvironment>({
    environmentName: { type: String, required: true },
    environmentDomain: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    schedules: [scheduleSchema],
});

export const UserModel = model("User", userSchema);

export const EnvironmentModel = model("Environment", environmentSchema);