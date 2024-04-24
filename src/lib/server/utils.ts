export function apiResponse(status: number, obj: any){
    return Response.json(obj, {
        status,
    });
}

export function apiFormError(message: string, status = 400){
    return Response.json({success: false, message}, {
        status,
    })
}
export function apiFormErrorCustom(obj: any, status = 400){
    return Response.json({success: false, ...obj}, {
        status,
    })
}

export function apiFormSuccess(obj: any = undefined){
    return Response.json({success: true, ...obj}, {
        status: 200,
    })
}