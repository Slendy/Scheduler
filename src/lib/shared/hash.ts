export async function hashObject(obj: any){
    let json = JSON.stringify(obj);
    let inputBytes = new TextEncoder().encode(json);
    let hashBytes = await crypto.subtle.digest("SHA-256", inputBytes);
    return Array.from(new Uint8Array(hashBytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
}