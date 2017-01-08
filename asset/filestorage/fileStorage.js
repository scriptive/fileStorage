/*!
    fileStorage -- Javascript file Storage
    Version 1.0.2
    https://scriptive.github.io/fileStorage
    (c) 2017
*/
(function(os,win) {
  'use strict';
  // win.requestfileStorage;
  // win.resolvefileStorage;
  // window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // var ob='app';
  var app={
    setting:{
      // =require fileStorage.setting.js
    },
    
    config:{
      // =require fileStorage.config.js
    },
    message:{
      // =require fileStorage.message.js
    },
    userCallback:{
      // =require fileStorage.userCallback.js
    },
    // mergeObject, mergeArray
    // =require fileStorage.utility.js
    initiate:{
      // =require fileStorage.initiate.js
    },
    database:{
      // =require fileStorage.database.js
    },
    support:{
      // NOTE: app.initiate
    },
    request:{
      // TODO: ?
    },
    resolve:{
      // TODO: ?
    },
    open:function(a,b){
      if (typeof a === 'object')app.mergeObject(app.config,a);
      return app.ready(b);
    },
    ready:function(response){
      return this.ready = new Promise(function(resolve, reject) {
        app.initiate.start(function(e) {
            // NOTE: success
            // REVIEW: app.user.file, user.objectRoot, user.objectStore are created if they support
            app.config.support = Object.keys(app.support);
            if (app.config.support.indexOf(app.config.Base) == -1)app.config.Base = app.config.support[0];
            Object.defineProperty(app.user, 'file', {enumerable: false, value:app.file[app.config.Base]});
            if(!app.config.message)app.config.message = app.message.RequestFileSystem;
            resolve(app.support[app.config.Base]);
        }, function(e) {
          // NOTE: fail
          if (typeof e === 'string') {
            app.config.message = e;
          } else if (e.message) {
            app.config.message = e.message;
            if(e.name)app.config.name = e.name;
            if(e.code)app.config.status = e.code;
          } else {
            app.config.status = e;
            app.config.message = app.message.PleaseSeeStatus;
          }
          reject(app.config);
        });
      }).then(function(e) {
        app.hasCallbackMethod(response,'success')(e);
      }, function(e) {
        app.hasCallbackMethod(response,'fail')(e);
      }).then(function(){
        app.hasCallbackMethod(response,'done')(app.config);
        return app.user;
      }), this.user;
    },
    file:{
      storage:{
        save:function(Query){
          // =require fileStorage.file.storage.save.js
        },
        open:function(Query){
          // =require fileStorage.file.storage.open.js
        },
        delete:function(Query){
          // =require fileStorage.file.storage.delete.js
        },
        // =require fileStorage.file.storage.js
      },
      database:{
        save:function(Query){
          // =require fileStorage.file.database.save.js
        },
        open:function(Query){
          // =require fileStorage.file.database.open.js
        },
        delete:function(Query){
          // =require fileStorage.file.database.delete.js
        },
        // =require fileStorage.file.database.js
      }
    },
    user:{
      download:function(Query){
        return app.ready.then(function(user){
          // =require fileStorage.user.download.js
        });
      },
      save:function(Query){
        return app.ready.then(function(user){
          return user.file.save(Query);
        });
      },
      open:function(Query){
        return app.ready.then(function(user){
          return user.file.open(Query);
        });
      },
      delete:function(Query){
        return app.ready.then(function(user){
          return user.file.delete(Query);
        });
      }
    }
  };
  win[os] = app.open;
}("fileStorage",window));
/*
win[os] = new user(a,b);

*/