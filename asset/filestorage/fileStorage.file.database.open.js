return new Promise(function(resolve, reject) {
  try {
    var storeTable = config.objectStore.store.file, 
    objectTransaction = $.user.database.transaction([storeTable],'readwrite'),
    objectStore = objectTransaction.objectStore(storeTable);
    // var storeDelete = objectStore.delete(Query.urlLocal);
    // var storeContains = objectStore.indexNames.contains(Query.urlLocal);
    // var storeCount = objectStore.count();
    // storeCount.onsuccess = function(e) {}
    var storeOpenCursor = objectStore.openCursor(Query.urlLocal);
    storeOpenCursor.onerror = function(e){
      reject(e);
    };
    storeOpenCursor.onsuccess = function(e) {
      var cursor = this.result;
      if (cursor) {
        // NOTE: key already exist -> cursor.update({});
        $.readBlob(cursor.value,Query.readAs).then(function(e){
          Query.fileContent = e;
          // Query.fileType = cursor.value.type;
          Query.fileSize = cursor.value.size;
          Query.fileExtension = Query.urlLocal.split('.').pop();
          if (cursor.value.type) {
            Query.fileType = cursor.value.type;
          } else if (Query.fileExtension) {
              if ($.setting.extension[Query.fileExtension])Query.fileType = $.setting.extension[Query.fileExtension].ContentType;
          }
          resolve(Query);
        },function(e){
          reject(e);
        });
      } else {
        // NOTE: key not exist -> objectStore.add(obj)
        reject({message:$.message.NoFileFound});
      }
    };
  } catch (e) {
    reject(e);
  }
});