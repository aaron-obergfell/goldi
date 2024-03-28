export async function openFileOnLaunch(launchParams, setProjectId) {
  if (launchParams.files.length) {
    let fileHandle = await launchParams.files[0];
    addToDB(fileHandle, setProjectId);
  };
}

export async function chooseAFile(setProjectId) {
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
    let fileHandle = await window.showOpenFilePicker(options);
    if (!fileHandle[0]) { return; }
    addToDB(fileHandle[0], setProjectId);
  }
}

async function addToDB(fileHandle, setProjectId) {

  const file = await fileHandle.getFile();
  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  // Open (or create) the database
  var open = indexedDB.open("AppData", 1);

  // Create the schema
  open.onupgradeneeded = function () {
    var db = open.result;
    db.createObjectStore("FileHandlers", { keyPath: "id" });
  };

  const id = crypto.randomUUID();
  open.onsuccess = async function () {
    // Start a new transaction
    var db = open.result;
    var tx = db.transaction("FileHandlers", "readwrite");
    var store = tx.objectStore("FileHandlers");

    // Add some data
    store.put({ id: id, fileHandle: fileHandle });
    const file = await fileHandle.getFile();

    setProjectId(id);
    // Close the db when the transaction is done
    tx.oncomplete = function () {
      db.close();
    };
  }
}