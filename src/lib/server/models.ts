import { Schema, model, models } from 'mongoose';
import { type IUser } from '$lib/shared/types';

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    passwordHash: { type: String, required: true }
}, {
    methods: {
        toApiResponse: function () {
            let { passwordHash, ...userObject } = this.toObject();
            return userObject;
        }
    }
});

const authTokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authToken: { type: String, required: true },
    // auth token expires every hour
    authTokenExpiration: { type: Date, required: true },
    refreshToken: { type: String, required: true },
    // refresh token expires when the document expires which is 1 month
    // when a refresh token is used the token object is regenerated
    expiresAt: { type: Date, required: true },
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
    enabled: {
        type: Boolean,
        default: false,
    },
    variations: [scheduleVariationSchema],
    events: [eventSchema],
    history: [Schema.Types.Mixed]
}, { _id: false, timestamps: true });

export const environmentSchema = new Schema({
    environmentName: { type: String, required: true },
    environmentDomain: { type: String, required: true },
    environmentIcon: { type: Buffer },
    environmentOwner: { type: Schema.Types.ObjectId, ref: 'User' },
    // environmentCollaborators: {type: }
    timeZone: {
        type: String,
        required: true,
        default: 'America/Chicago',
    },
    isVerified: { type: Boolean, required: true },
    schedules: [scheduleSchema],
}, {
    methods: {
        toApiResponse: function () {
            let responseEnvironment: any = this.toObject({ getters: true });

            responseEnvironment.schedules = responseEnvironment.schedules.map(({ history, ...rest }: any) => rest);
            return responseEnvironment;
        }
    },
});

export const UserModel = models['User'] || model('User', userSchema);
export const TokenModel = models['Token'] || model('Token', authTokenSchema);
export const EnvironmentModel = models['Environment'] || model('Environment', environmentSchema);