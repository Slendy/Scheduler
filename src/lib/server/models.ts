import pkg from 'mongoose';

const { Schema, model, models, Types } = pkg;
import { type IUser } from '$lib/shared/types';

Schema.Types.ObjectId.get(v => v == null || v.toString() == "[object Object]" ? v : v.toString())

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
    refreshTokenExpiration: { type: Date, required: true },
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

const environmentCollaboratorSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, getter: v => v },
    permissions: { type: Number, required: true },
}, { _id: false, });

export const environmentSchema = new Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true },
    icon: { type: Buffer, getter: v => null },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    collaborators: { type: [environmentCollaboratorSchema], required: true, default: [] },
    timeZone: {
        type: String,
        required: true,
        default: 'America/Chicago',
    },
    isVerified: { type: Boolean, required: true },
    schedules: [scheduleSchema],
}, {
    methods: {
        toApiResponse: async function () {
            let responseEnvironment: any = await this.toObject({getters: true})

            responseEnvironment.collaborators.forEach((c: any) => {
                delete c.user.passwordHash;
            })

            responseEnvironment.collaborators = responseEnvironment.collaborators.map(({ passwordHash, ...rest }: any) => rest);

            responseEnvironment.icon = !responseEnvironment.icon ? null : responseEnvironment.icon.toString('base64');

            // console.log(responseEnvironment);

            responseEnvironment.schedules = responseEnvironment.schedules.map(({ history, ...rest }: any) => rest);
            return responseEnvironment;
        }
    },
});

export const UserModel = models['User'] || model('User', userSchema);
export const TokenModel = models['Token'] || model('Token', authTokenSchema);
export const EnvironmentModel = models['Environment'] || model('Environment', environmentSchema);