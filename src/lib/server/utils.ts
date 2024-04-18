export function apiResponse(status: number, obj: any){
    return Response.json(obj, {
        status,
    });
}