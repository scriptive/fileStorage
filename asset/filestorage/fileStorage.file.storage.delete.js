return new Promise(function(resolve, reject) {
  app.user.objectLocal.getFile(Query.urlLocal, {}, function(fileEntry) {
    fileEntry.remove(function(e) {
        // NOTE: remove success
        resolve();
    }, function(e){
        // NOTE: remove fail
        reject(e);
    });
  }, function(e){
    if(Query.fileNotFound){
      // REVIEW: user set, to return 'success' When file is not Found! Query.fileNotExists, Query.fileNotFound
      resolve();
    } else {
      // NOTE: otherwise return fail!
      reject(e);
    }
  });
});