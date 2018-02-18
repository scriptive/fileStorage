start: function(done, error) {
  return $.database.start().then(function(e){
    return e;
  },function(){
    return false;
  }).then(function(database){
    $.initiate.Chrome(done, function(){
      $.initiate.Cordova(done, function(e){
        if(database){
          config.message = $.message.IndexedDBAPI;
          done(database);
        } else {
          error(e);
        }
      })
    });
  });
},
Chrome: function(done, error) {
  // NOTE: see Chrome App API, navigator.webkitTemporaryStorage, navigator.webkitPersistentStorage (1024*1024*1024)
  try {
    // window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024,
    navigator.webkitPersistentStorage.requestQuota(
      config.RequestQuota,
      function(grantedBytes) {
        config.ResponseQuota = grantedBytes;
        win.requestfileStorage = win.webkitRequestFileSystem;
        win.resolvefileStorage = win.webkitResolveLocalFileSystemURL;

        // if (win.requestfileStorage instanceof Function) {
        //
        // } else {
        //   error('Chrome not supported..');
        // }
        try {
          win.requestfileStorage(
            config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
            grantedBytes,
            function(e) {
              // $.user.objectLocal = e.root.toURL();
              config.support.push('storage');
              Object.defineProperty($.user, 'storage', {enumerable: false, value:e.root});
              done(e);
            },
            function(e) {
              error(e);
            }
          );
        } catch (e) {
          error(e);
        }
      },
      function(e) {
        error(e);
      }
    );
  } catch (e) {
    error(e);
  }
},
Cordova: function(done, error) {
  // NOTE: see Cordova API
  try {
    win.requestfileStorage = win.requestFileSystem || win.webkitRequestFileSystem;
    win.resolvefileStorage = win.resolveLocalFileSystemURL || win.webkitResolveLocalFileSystemURL;
    if (win.requestfileStorage) {
      if (win.LocalFileSystem) {
        win.PERSISTENT = win.LocalFileSystem.PERSISTENT;
        win.TEMPORARY = win.LocalFileSystem.TEMPORARY;
      }
      // if (win.cordova && location.protocol === 'file:') {
      //   win.PERSISTENT =win.PERSISTENT; win.TEMPORARY =win.TEMPORARY;
      // }
      win.requestfileStorage(
        config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
        config.RequestQuota,
        function(e) {
          config.support.push('storage');
          Object.defineProperty($.user, 'storage', {enumerable: false, value:e.root});
          done(e);
        },
        function(e) {
          error(e);
        }
      );
    } else {
      error($.message.NoRequestFileSystem);
    }
  } catch (e) {
    error(e);
  }
}
/*
Chrome: function(done, error) {
  // NOTE: see Chrome App API, navigator.webkitTemporaryStorage, navigator.webkitPersistentStorage (1024*1024*1024)
  try {
    navigator.webkitPersistentStorage.requestQuota(
      config.RequestQuota,
      function(grantedBytes) {
        config.ResponseQuota = grantedBytes;
        win.requestfileStorage=win.webkitRequestFileSystem;
        win.resolvefileStorage=win.webkitResolveLocalFileSystemURL;
        win.requestfileStorage(
          config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
          grantedBytes,
          function(fs) {
            config.support.push('storage');
            // $.user.objectLocal = fs.root.toURL();
            config.Base = 'Chrome';
            done(fs);
          },
          function(e) {
            error(e);
          }
        );
      },
      function(e) {
        error(e);
      }
    );
  } catch (e) {
    error(e);
  }
},
Cordova: function(done, error) {
  // NOTE: see Cordova API
  try {
    win.requestfileStorage = win.requestFileSystem || win.webkitRequestFileSystem;
    win.resolvefileStorage = win.resolveLocalFileSystemURL || win.webkitResolveLocalFileSystemURL;
    if (win.requestfileStorage) {
      if (win.LocalFileSystem) {
        win.PERSISTENT = win.LocalFileSystem.PERSISTENT;
        win.TEMPORARY = win.LocalFileSystem.TEMPORARY;
      } else if (win.cordova && location.protocol === 'file:') {
        // win.PERSISTENT =win.PERSISTENT; win.TEMPORARY =win.TEMPORARY;
      }
      win.requestfileStorage(
        config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
        config.RequestQuota,
        function(fs) {
          config.support.push('storage');
          $.user.objectLocal = fs.root.toURL();
          config.Base = 'Cordova';
          done(fs);
        },
        function(e) {
          error(e);
        }
      );
    } else {
      error($.message.NoRequestFileSystem);
    }
  } catch (e) {
    error(e);
  }
},
*/
// Webkit: function(done, error) {
//   return $.database.request().then(function(e){
//     return e;
//   },function(){
//     return false;
//   }).then(function(objectStore){
//     try {
//       win.requestfileStorage = win.requestFileSystem || win.webkitRequestFileSystem;
//       win.resolvefileStorage = win.resolveLocalFileSystemURL || win.webkitResolveLocalFileSystemURL;
//       if (win.LocalFileSystem) {
//         win.PERSISTENT = win.LocalFileSystem.PERSISTENT;
//         win.TEMPORARY = win.LocalFileSystem.TEMPORARY;
//       }
//       // if (win.cordova && location.protocol === 'file:') {  }
//       win.requestfileStorage(
//         config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
//         config.RequestQuota,
//         function(fs) {
//           config.support.push('storage');
//           $.user.objectLocal = fs.root.toURL();
//           done(fs);
//         },
//         function(e) {
//           error(e);
//         }
//       );
//     } catch (e) {
//       if (objectStore){
//         config.Base = 'IndexedDB';
//         config.message = $.message.IndexedDBAPI;
//         done(config);
//       } else if(navigator.webkitPersistentStorage){
//         $.initiate.Chrome(done, error);
//       } else if (win.cordova && location.protocol === 'file:') {
//         $.initiate.Cordova(done, error);
//       } else {
//         error(e);
//       }
//     }
//   });
// },