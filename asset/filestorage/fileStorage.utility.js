/*
return new Promise(function(resolve, reject) {
  
}).then(function(){
  
},function(){
  
}).then(function(){
  
});
*/
mergeObject:function(to){
  // $.mergeObject({},true, $.{});
  var a = arguments,s, b = Object(to);
  for (var o = 1; o < a.length; o++) {
    if (a[o].constructor === Object) {
      for (var i in a[o]) {
        try {
          // NOTE: Property in desination object set; update its value.
          if (s){
            // NOTE: Reverse is true, update only if orginal object hasNotOwnProperty
            if (!b.hasOwnProperty(i)){
              b[i] = a[o][i];
            } else if (b[i].constructor === Array) {
              b[i] = this.mergeArray(b[i],a[o][i]);
            } else if (b[i].constructor === Object) {
              b[i] = this.mergeObject(b[i],a[o][i]);
            }
          } else if (b[i].constructor === Array) {
            b[i] = this.mergeArray(b[i],a[o][i]);
          } else if (b[i].constructor === Object) {
            b[i] = this.mergeObject(b[i],a[o][i]);
          } else {
            b[i] = a[o][i];
          }
        } catch(e) {
          // NOTE: Property in desination object not set; create it and set its value.
          b[i] = a[o][i];
        }
      }
    } else if (o === 1){
      // console.log('what');
      // NOTE: checking if Reverse set to be true
      s = a[o];
    }
  }
  return b;
},
mergeArray:function(b){
  var a = arguments, b;
  for (var o = 1; o < a.length; o++) {
    if (a[o].constructor === Array) {
      b=b.concat(a[o]).filter(function(item, index,b) {
        return b.indexOf(item) === index;
      });
    }
  }
  return b;
},
hasCallback:function(a,b){
  return typeof a === 'object' && typeof a[b]==='function';
},
hasCallbackMethod:function(a,b){
  return this.hasCallback(a,b)?a[b]:new Function();
},
createBlob:function(Query){
  if (!Query.blob){
    if (Query.data){
      if (!Query.dataType){
        Query.blob = new Blob([Query.data],{type:Query.fileType});
      }
    } else {
      Query.blob = new Blob([Query.fileContent],{type:Query.fileType});
    }
  }
},
readBlob:function(a,b){
  return new Promise(function(resolve, reject) {
    try {
      var file = new FileReader();
      file.onabort = function(e) {
        reject(e);
      }
      file.onerror = function(e) {
        reject(e);
      }
      file.onload = function(e) {
        resolve(file.result);
      }
      // file.onloadstart = function (e) {}
      // file.onloadend = function (e) {}
      // file.onprogress = function (e) {}
      switch(b) {
        case 'readAsDataURL':
          file.readAsDataURL(a);
          break;
        case 'readAsText':
          file.readAsText(a);
          break;
        case 'readAsArrayBuffer':
          file.readAsArrayBuffer(a);
          break;
        case 'readAsBinaryString':
          file.readAsBinaryString(a);
          break;
        default:
          resolve(window.URL.createObjectURL(a));
          window.URL.revokeObjectURL();
      }
    } catch (e) {
      reject(e);
    }
  });
},
/*
download->multi->task
open
save
delete
afterDownload -> created blob Object and fileContent if they are not defined!
*/
afterDownload:function(Query){
  // var audio = document.getElementById('AudioElement') || new Audio();
  // var audio = new Audio();
  // audio.src = Query.fileContent;
  // audio.type = Query.fileType;
  // audio.play();
  // (Query.data instanceof Blob?Query.data:new Blob([Query.data],{type:Query.fileType}));
  // (Query.data instanceof Blob?Query.data:new Blob([Query.data],{type:Query.fileType}))
  if (Query.data.constructor !== Blob) {
    Query.blob = new Blob([(Query.data.constructor === Object?JSON.stringify(Query.data, null, 2):Query.data)],{type:Query.fileType});
  } else {
    Query.blob = Query.data;
  }
  return new Promise(function(resolve, reject) {
    $.readBlob(Query.blob,Query.readAs).then(function(e){
      Query.fileContent = e;
      resolve(Query);
    },function(e){
      reject(e);
    });
  });
},
dirChecker:function(dir){
  // NOTE: if Query.urlLocal has a listed directory, meaning having sub directorys
  return dir?dir.split('/').slice(0, -1):false;
},
dirCreator:function(root,dir,callback){
  if (dir[0] == '.' || dir[0] == '')dir = folders.slice(1);
  root.getDirectory(
      dir[0], {create: true},
      function(dirEntry){
        if (dir.length) {
          // NOTE: processing to sub dirs...
          $.dirCreator(dirEntry, dir.slice(1), callback);
        } else {
          // NOTE: Creating directory success!
          callback(true);
        }
      },
      function(e){
        // NOTE: Creating directory failed!
        callback(false, e);
      }
  );
},
fileWriter:function(fileEntry,blob){
  return new Promise(function(resolve, reject) {
    fileEntry.createWriter(function(fileWriter) {
      fileWriter.onwriteend = function(e) {
        this.onwriteend = null;
        this.truncate(this.position); //in case a longer file was already here
        resolve(e);
      };
      fileWriter.onerror = function(e) {
        reject(e);
      };
      fileWriter.write(blob);
    }, function(e){
      reject(e);
    });
  });
},
fileCreator:function(){
},
fileReader:function(){
},
fileRemover:function(){
},