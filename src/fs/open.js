export async function getFileHandleFromFilePicker() {
  if (!window.showOpenFilePicker) {
    alert("Your current device does not support the File System API. Try again on desktop Chrome!");
  }
  else {
    //here you specify the type of files you want to allow
    let options = {
      types: [{
        description: "Custom",
        accept: {
          "text/plain": [".gol"]
        }
      }],
      excludeAcceptAllOption: true,
      multiple: false,
    };

    // Open file picker and choose a file
    try {
      let fileHandle = await window.showOpenFilePicker(options);
      if (fileHandle.length !== 1) {
        return undefined;
      }
      return fileHandle[0];
    } catch (err) {
      return undefined;
    }
  }
}