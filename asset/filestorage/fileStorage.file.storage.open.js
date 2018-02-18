return new Promise(function(resolve, reject) {
  $.user.storage.getFile(Query.urlLocal, {create: false}, function(fileEntry) {
    fileEntry.file(function(file) {
      $.readBlob(file,Query.readAs).then(function(e){
        Query.fileSize = file.size;
        Query.fileExtension = file.name.split('.').pop();
        if (file.type) {
          Query.fileType = file.type;
        } else if (Query.fileExtension) {
          if ($.setting.extension[Query.fileExtension])Query.fileType = $.setting.extension[Query.fileExtension].ContentType;
        }
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