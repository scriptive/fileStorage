/*!
    fileStorage -- Javascript file Storage
    Version {package.version}-{application.buildDate}
    https://scriptive.github.io/fileStorage
*/
(function(os,win) {
  'use strict';
  // win.requestfileStorage;
  // win.resolvefileStorage;
  // window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // var ob='app';
  // filesystem:http://localhost/temporary/
  // filesystem:http://localhost/persistent/
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
    // request:{
    //   // TODO: ?
    // },
    // resolve:{
    //   // TODO: ?
    // },
    open:function(a,b){
      return app.openRequest(a,b);
    },
    openRequest:function(a,b){
      if (a && typeof a === 'object')this.mergeObject(this.config,a);
      return (this.ready.constructor === Function)?this.ready(b):this.user;
    },
    ready:function(response){
      return this.ready = new Promise(function(resolve, reject) {
        app.initiate.start(function(e) {
            // NOTE: success
            // REVIEW: app.user.file, user.database, user.storage are created if they support
            if (app.config.support.indexOf(app.config.Base) == -1)app.config.Base = app.config.support[0];
            // Object.defineProperty(app.user, 'file', {enumerable: false, value:app.file[app.config.Base]});
            Object.defineProperties(app.user,{
              file:{
                enumerable: false, value:app.file[app.config.Base]
              }
            });
            if(!app.config.message)app.config.message = app.message.RequestFileSystem;
            resolve(app.user[app.config.Base]);
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
        app.hasCallbackMethod(response,'success').call(app.user,e);
      }, function(e) {
        app.hasCallbackMethod(response,'fail')(e);
      }).then(function(){
        // win[os]=app.user;
        app.hasCallbackMethod(response,'done').call(app.user,app.config);
        // app.hasCallbackMethod(response,'done')(app.config);
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
      },
      browse:function(Query){
        return app.ready.then(function(user){
          // TODO: ???
        });
      }
    }
  };
  win[os] = app.open;
}("fileStorage",window));