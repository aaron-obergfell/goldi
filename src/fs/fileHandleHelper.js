export async function getPermission(fileHandle) {
    if (fileHandle) {
        return await fileHandle.queryPermission();
    } else {
        return "granted";
    }
}

export async function getWritable(fileHandle) {
    return await fileHandle.createWritable();
}

export async function getFileHandleFromSavePicker() {
    return await window.showSaveFilePicker(saveOptions);
}

export const saveOptions = {
    types: [{
        description: "Custom",
        accept: {
            "text/plain": [".gol"]
        },
        suggestedName: "no_name.gol"
    }]
};