/*!
    fileStorage -- Javascript file Storage
    Version 1.0.3
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
  var config={
    // =require fileStorage.config.js
  },
  $={
    setting:{
      // =require fileStorage.setting.js
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
      return $.openRequest(a,b);
    },
    openRequest:function(a,b){
      if (a && typeof a === 'object')this.mergeObject(config,a);
      return (this.ready.constructor === Function)?this.ready(b):this.user;
    },
    ready:function(response){
      return this.ready = new Promise(function(resolve, reject) {
        $.initiate.start(function(e) {
            // NOTE: success
            // REVIEW: $.user.file, user.database, user.storage are created if they support
            if (config.support.indexOf(config.Base) == -1)config.Base = config.support[0];
            // Object.defineProperty($.user, 'file', {enumerable: false, value:$.file[config.Base]});
            Object.defineProperties($.user,{
              file:{
                enumerable: false, value:$.file[config.Base]
              }
            });
            if(!config.message)config.message = $.message.RequestFileSystem;
            resolve($.user[config.Base]);
        }, function(e) {
          // NOTE: fail
          if (typeof e === 'string') {
            config.message = e;
          } else if (e.message) {
            config.message = e.message;
            if(e.name)config.name = e.name;
            if(e.code)config.status = e.code;
          } else {
            config.status = e;
            config.message = $.message.PleaseSeeStatus;
          }
          reject(config);
        });
      }).then(function(e) {
        $.hasCallbackMethod(response,'success').call($.user,e);
      }, function(e) {
        $.hasCallbackMethod(response,'fail')(e);
      }).then(function(){
        // win[os]=$.user;
        $.hasCallbackMethod(response,'done').call($.user,config);
        // $.hasCallbackMethod(response,'done')(config);
        return $.user;
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
        return $.ready.then(function(user){
          // =require fileStorage.user.download.js
        });
      },
      save:function(Query){
        return $.ready.then(function(user){
          return user.file.save(Query);
        });
      },
      open:function(Query){
        return $.ready.then(function(user){
          return user.file.open(Query);
        });
      },
      delete:function(Query){
        return $.ready.then(function(user){
          return user.file.delete(Query);
        });
      },
      browse:function(Query){
        return $.ready.then(function(user){
          // TODO: ???
        });
      }
    }
  };
  win[os] = $.open;
}("fileStorage",window));