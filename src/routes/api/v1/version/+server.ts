import {
    PUBLIC_GIT_SHA,
    PUBLIC_BUILD_DATE,
    PUBLIC_VERSION
} from '$env/static/public';
const { MODE } = import.meta.env;

export const GET = () => {
    return Response.json({
        buildDate: PUBLIC_BUILD_DATE,
        version: PUBLIC_VERSION,
        commit: PUBLIC_GIT_SHA,
        deployment: MODE,
    }, {
        headers: {
            'ETag': PUBLIC_GIT_SHA
        }
    })
}