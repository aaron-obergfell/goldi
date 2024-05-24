export async function queryReadPermission(fileHandle) {
    if (fileHandle) {
        return await fileHandle.queryPermission({ mode: "read" });
    } else {
        return "granted";
    }
}

export async function requestReadWritePermission(fileHandle) {
    return await fileHandle.requestPermission({ mode: "readwrite" });
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