import { appDataRepository } from '../db/appData.ts';
import { defaultMeta } from '../types/goldi';

export async function openFileOnLaunch(launchParams, setProjectId) {
  if (launchParams.files.length) {
    let fileHandle = await launchParams.files[0];
    addToDB(fileHandle, setProjectId);
  };
}

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

export async function newProject(setProjectId) {
    addToDB(undefined, setProjectId);
}

async function addToDB(fileHandle, setProjectId) {
  let allProjects = await appDataRepository.projects.toArray();
  for (let i = 0; i < allProjects.length; i++) {
    let same;
    if (fileHandle && allProjects[i].fileHandle) {
      same = await fileHandle.isSameEntry(allProjects[i].fileHandle);
    } else {
      same = false;
    }
    
    if (same) {
      console.log("FileHandle was already in db with id " + allProjects[i].id);
      setProjectId(allProjects[i].id);
      return;
    }
  }
  const id = crypto.randomUUID();
  console.log("FileHandle needs to be added to db. Will use new id " + id);
  try {
    await appDataRepository.projects.add({
      id: id,
      fileHandle: fileHandle,
      meta: defaultMeta
    });
    setProjectId(id);
  } catch (error) {
    alert(`Failed to add ${fileHandle.name}: ${error}`);
  }
}