return new Promise(function(resolve, reject) {
  try {
    var storeTable = app.config.objectStore.store.file, 
    objectTransaction = app.user.objectStore.transaction([storeTable],'readwrite'),
    objectStoreDelete = objectTransaction.objectStore(storeTable).delete(Query.urlLocal);
    objectStoreDelete.onerror = function(e) {
      reject(e);
    };
    objectStoreDelete.onsuccess = function(e) {
      resolve(e);
    };
  } catch (e) {
    reject(e);
  }
});