export async function hashObject(obj: any){
    let json = JSON.stringify(obj);
    let inputBytes = new TextEncoder().encode(json);
    let hashBytes = await crypto.subtle.digest("SHA-256", inputBytes);
    return toHex(hashBytes);
}

export function toHex(buf: ArrayBuffer){
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
}