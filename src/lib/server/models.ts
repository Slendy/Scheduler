import { Schema, model, Types } from 'mongoose';
import { type IUser } from '$lib/shared/types';


const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    permissionMap: { type: Map, of: String, required: true },
    isAdmin: { type: Boolean, required: true },
    passwordHash: { type: String, required: true }
});
// const userSchema = new Schema({
//     userId: String,
//     username: String,
//     permissionsMap: {
//         type: Map, of: String
//     },
//     isAdmin: Boolean,
//     passwordHash: String,
// });

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

const environmentSchema = new Schema({
    environmentName: String,
    environmentDomain: String,
    isVerified: Boolean,
    schedules: [scheduleSchema],
});

export const UserModel = model("User", userSchema);

export const EnvironmentModel = model("Environment", environmentSchema);