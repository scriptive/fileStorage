return new Promise(function(resolve, reject) {
  try {
    app.createBlob(Query);
    app.user.objectRoot.getFile(Query.urlLocal, {create: true}, function(fileEntry) {
      app.fileWriter(fileEntry,Query.blob).then(function(e){
        resolve(e);
      }, function(e){
        reject(e);
      });
    }, function(e){
      var isBecauseDir = app.dirChecker(Query.urlLocal);
      if(isBecauseDir.length){
        app.dirCreator(app.user.objectRoot,isBecauseDir,function(status,msg){
          if (status){
            app.user.objectRoot.getFile(Query.urlLocal, {create: true}, function(fileEntry) {  
              app.fileWriter(fileEntry,Query.blob).then(function(e){
                resolve(e);
              },function(e){
                reject(e);
              });
            }, function(e){
              reject(e);
            });
          } else {
            reject(msg);
          }
        });
      } else {
        reject(e);
      }
    });
  } catch (e) {
    reject(e);
  }
});