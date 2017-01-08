return new Promise(function(resolve, reject) {
  try {
    var storeTable = app.config.objectStore.store.file, 
    objectTransaction = app.user.objectStore.transaction([storeTable],'readwrite'),
    objectStore = objectTransaction.objectStore(storeTable);
    app.createBlob(Query);
    objectTransaction.oncomplete = function(e){
      resolve(e);
    };
    objectTransaction.onerror = function(e){
      reject(e);
    }; 
    objectStore.put(Query.blob,Query.urlLocal);
  } catch (e) {
    reject(e);
  }
});