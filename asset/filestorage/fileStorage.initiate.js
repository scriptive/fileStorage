start: function(done, error) {
  return app.database.start().then(function(e){
    return e;
  },function(){
    return false;
  }).then(function(database){
    app.initiate.Chrome(done, function(){
      app.initiate.Cordova(done, function(e){
        if(database){
          app.config.message = app.message.IndexedDBAPI;
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
      app.config.RequestQuota,
      function(grantedBytes) {
        app.config.ResponseQuota = grantedBytes;
        win.requestfileStorage = win.webkitRequestFileSystem;
        win.resolvefileStorage = win.webkitResolveLocalFileSystemURL;
        win.requestfileStorage(
          app.config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
          grantedBytes,
          function(e) {
            // app.user.objectLocal = e.root.toURL();
            app.config.support.push('storage');
            Object.defineProperty(app.user, 'storage', {enumerable: false, value:e.root});
            done(e);
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
      }
      // if (win.cordova && location.protocol === 'file:') {
      //   win.PERSISTENT =win.PERSISTENT; win.TEMPORARY =win.TEMPORARY;
      // }
      win.requestfileStorage(
        app.config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
        app.config.RequestQuota,
        function(e) {
          app.config.support.push('storage');
          Object.defineProperty(app.user, 'storage', {enumerable: false, value:e.root});
          done(e);
        },
        function(e) {
          error(e);
        }
      );
    } else {
      error(app.message.NoRequestFileSystem);
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
      app.config.RequestQuota,
      function(grantedBytes) {
        app.config.ResponseQuota = grantedBytes;
        win.requestfileStorage=win.webkitRequestFileSystem;
        win.resolvefileStorage=win.webkitResolveLocalFileSystemURL;
        win.requestfileStorage(
          app.config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
          grantedBytes,
          function(fs) {
            app.config.support.push('storage');
            // app.user.objectLocal = fs.root.toURL();
            app.config.Base = 'Chrome';
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
        app.config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
        app.config.RequestQuota,
        function(fs) {
          app.config.support.push('storage');
          app.user.objectLocal = fs.root.toURL();
          app.config.Base = 'Cordova';
          done(fs);
        },
        function(e) {
          error(e);
        }
      );
    } else {
      error(app.message.NoRequestFileSystem);
    }
  } catch (e) {
    error(e);
  }
},
*/
// Webkit: function(done, error) {
//   return app.database.request().then(function(e){
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
//         app.config.Permission > 0 ? win.PERSISTENT : win.TEMPORARY,
//         app.config.RequestQuota,
//         function(fs) {
//           app.config.support.push('storage');
//           app.user.objectLocal = fs.root.toURL();
//           done(fs);
//         },
//         function(e) {
//           error(e);
//         }
//       );
//     } catch (e) {
//       if (objectStore){
//         app.config.Base = 'IndexedDB';
//         app.config.message = app.message.IndexedDBAPI;
//         done(app.config);
//       } else if(navigator.webkitPersistentStorage){
//         app.initiate.Chrome(done, error);
//       } else if (win.cordova && location.protocol === 'file:') {
//         app.initiate.Cordova(done, error);
//       } else {
//         error(e);
//       }
//     }
//   });
// },