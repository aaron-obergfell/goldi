export async function getPermission(fileHandle) {
    return await fileHandle.queryPermission();
}

export async function getWritable(fileHandle) {
    return await fileHandle.createWritable();
}