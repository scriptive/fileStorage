start: function() {
  return new Promise(function(resolve, reject) {
    if (app.config.objectStore){
      app.database.IndexedDB().then(function(e){
        resolve(e);
      },function(e){
        reject(e);
      });
    } else {
      app.database.localStorage().then(function(e){
        resolve(e);
      },function(e){
        reject(e);
      });
    }
  });
},
IndexedDB: function(){
  return new Promise(function(resolve, reject) {
    app.user.database = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
    try {
      var db = app.user.database.open(app.config.objectStore.name, app.config.objectStore.version);
      db.onerror = function(){
        reject(this.error);
      };
      db.onupgradeneeded = function(){
        var o = app.config.objectStore.store;
        if (typeof o === 'object') {
          for (var i in o) {
            if (o.hasOwnProperty(i)) {
              var store = o[i];
              if (typeof store === 'object' && store.hasOwnProperty('name')){
                var storeName = store['name'];
                if (!this.result.objectStoreNames.contains(storeName)) {
                  if (typeof store['option'] === 'object') {
                    this.result.createObjectStore(storeName,store['option']);
                  } else {
                    this.result.createObjectStore(storeName);
                  }
                }
              } else if (typeof store === 'string' ) {
                if (!this.result.objectStoreNames.contains(store)) {
                  this.result.createObjectStore(store);
                }
              }
            } 
          }
        }
      };
      db.onsuccess = function(){
        var o = app.config.objectStore.store.file;
        if (typeof o ==='object' && o.hasOwnProperty('name')) {
          app.config.objectStore.store.file = o.name;
        }
        app.user.objectStore = this.result;
        app.support.database = this.result;
        // objectStore, object
        // if (app.config.support.indexOf('database') == -1)app.config.support.push('database');
        // app.config.support.push('database');
        resolve(this.result);
      };
    } catch (e) {
      reject(e);
    } 
  });
},
localStorage: function(){
  return new Promise(function(resolve, reject) {
    try {
      app.user.database = win.localStorage;
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}