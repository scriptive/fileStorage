return new Promise(function(resolve, reject) {
  try {
    $.createBlob(Query);
    $.user.storage.getFile(Query.urlLocal, {create: true}, function(fileEntry) {
      $.fileWriter(fileEntry,Query.blob).then(function(e){
        resolve(e);
      }, function(e){
        reject(e);
      });
    }, function(e){
      var isBecauseDir = $.dirChecker(Query.urlLocal);
      if(isBecauseDir.length){
        $.dirCreator($.user.storage,isBecauseDir,function(status,msg){
          if (status){
            $.user.storage.getFile(Query.urlLocal, {create: true, exclusive: true}, function(fileEntry) {
              $.fileWriter(fileEntry,Query.blob).then(function(e){
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