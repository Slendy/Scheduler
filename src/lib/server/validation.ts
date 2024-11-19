import { isValidObjectId, type HydratedDocument, type HydratedDocumentFromSchema } from "mongoose";
import { apiFormError } from "./utils";
import { EnvironmentModel, environmentSchema } from "./models";

export async function validateEnvironmentId(environmentId: string): Promise<[HydratedDocumentFromSchema<typeof environmentSchema>, undefined] | [undefined, Response]> {
    if (!isValidObjectId(environmentId)) {
        return [, apiFormError('Invalid environment ID')]
    }

    const environment: HydratedDocumentFromSchema<typeof environmentSchema> = await EnvironmentModel.findOne({ _id: environmentId }) as HydratedDocumentFromSchema<typeof environmentSchema>;
    if (environment === null) {
        return [, apiFormError('Environment not found', 404)]
    }
    return [environment, undefined];
}