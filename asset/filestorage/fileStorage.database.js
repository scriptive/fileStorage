start: function() {
  return new Promise(function(resolve, reject) {
    if (config.objectStore){
      $.database.IndexedDB().then(function(e){
        resolve(e);
      },function(e){
        reject(e);
      });
    } else {
      $.database.localStorage().then(function(e){
        resolve(e);
      },function(e){
        reject(e);
      });
    }
  });
},
IndexedDB: function(){
  return new Promise(function(resolve, reject) {
    Object.defineProperty($.user, 'db', {enumerable: false, value:win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB});
    try {
      var db = $.user.db.open(config.objectStore.name, config.objectStore.version);
      db.onerror = function(){
        reject(this.error);
      };
      db.onupgradeneeded = function(){
        var o = config.objectStore.store;
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
      db.onsuccess = function(e){
        var o = config.objectStore.store.file;
        if (typeof o ==='object' && o.hasOwnProperty('name')) {
          config.objectStore.store.file = o.name;
        }
        // $.user.objectStore = this.result;
        // console.log('2',e);
        // $.support.database = this.result;
        // console.log(e.target.result, this.result);
        config.support.push('database');
        Object.defineProperty($.user, 'database', {enumerable: false, value:e.target.result});
        // objectStore, object
        // if (config.support.indexOf('database') == -1)config.support.push('database');
        // config.support.push('database');
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
      // $.user.db = win.localStorage;
      Object.defineProperty($.user, 'db', {enumerable: false, value:win.localStorage});
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}