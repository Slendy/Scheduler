import { Schema, model } from 'mongoose';
import { type IUser } from '$lib/shared/types';


const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    permissionMap: { type: Map, of: String, required: true },
    isAdmin: { type: Boolean, required: true },
    passwordHash: { type: String, required: true }
});

const eventSchema = new Schema({
    eventId: String,
    name: String,
    startTime: String,
    endTime: String,
    variations: [String],
}, { _id: false, })

const scheduleVariationSchema = new Schema({
    name: String,
    options: [String,]
}, { _id: false, })

const scheduleSchema = new Schema({
    scheduleId: String,
    scheduleType: {
        type: String,
        enum: ['repeating', 'one-time'],
        default: 'one-time',
    },
    scheduleDate: {
        type: String,
        default: null,
    },
    scheduleWeekdays: {
        type: [String],
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        default: null,
    },
    name: String,
    isPublished: Boolean,
    variations: [scheduleVariationSchema],
    events: [eventSchema],
    history: [Schema.Types.Mixed]
}, { _id: false, timestamps: true });

const environmentSchema = new Schema({
    environmentName: { type: String, required: true },
    environmentDomain: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    schedules: [scheduleSchema],
});

export const UserModel = model("User", userSchema);

export const EnvironmentModel = model("Environment", environmentSchema);