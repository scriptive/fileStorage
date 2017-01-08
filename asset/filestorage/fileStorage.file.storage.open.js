return new Promise(function(resolve, reject) {
  // app.user.storage.root.getFile(Query.urlLocal);
  app.user.objectRoot.getFile(Query.urlLocal, {create: false}, function(fileEntry) {
    fileEntry.file(function(file) {
      app.readBlob(file,Query.readAs).then(function(e){
        Query.fileContent = e;
        resolve(Query);
      },function(e){
        reject(e);
      });
    }, function(file){
      // NOTE: Reading file failed!
      reject(file);
    });
  }, function(e){
    reject(e);
  });
});