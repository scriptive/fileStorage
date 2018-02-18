return new Promise(function(resolve, reject) {
  try {
    var storeTable = config.objectStore.store.file, 
    objectTransaction = $.user.database.transaction([storeTable],'readwrite'),
    objectStore = objectTransaction.objectStore(storeTable);
    $.createBlob(Query);
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