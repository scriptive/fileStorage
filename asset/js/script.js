(function(app) {
  app.versionNumber = '{application.version}';
  app.dataVersion = function(e){
    e.innerHTML=app.versionNumber;
  };
  app.initiate = function(o) {
    var notification = document.querySelector("ul#notification");
    notification.querySelector('p').innerHTML=app.versionNumber;
    app.fileStorage().then(function(){
      notification.style.display = 'none';
      notification.remove();
      document.querySelector("div#demo").style.display = 'block';
      document.querySelectorAll('form').each(function(i,form){
        form.addEventListener('submit', function(evt){
          var o = evt.target.elements;
          var task = evt.target.getAttribute('id');
          if (task) app.demo[task](o);
          evt.preventDefault();
        },false);
      });
    },function(e){
      app.config.msg.info.innerHTML='this Browser does not support the storage system!'
    }).then(function(){
      app.dataContent();
    });
  };
  app.fileStorage = function() {
    return new Promise(function(resolve, reject) {
      app.file = fileStorage({
            // Base:'database',
            // Permission: 1,
            objectStore:{
              version:2
            }
          },
          {
            success: function(status) {
              console.log('success',status);
              resolve();
            },
            fail: function(status) {
              console.log('fail',status);
              reject(status);
            },
            done: function(response) {
              console.log(response);
              // console.log(response);
              var support = document.querySelector("p.support");
              if (response.support.length){
                support.innerHTML=response.support.join(' & ')+', and using ';
                var base = document.createElement('strong');
                base.innerHTML=response.Base;
                support.appendChild(base);
              } else {
                support.innerHTML='none';
              }
            }
          }
      );
    });
  };
  app.demo = {
    download:function(o){
      var url = o.url.value;
      var readAs = o.readAs.value;
      var responseType = o.responseType.value;
      var urlLocal = (o.urlLocal.value=='true')?true:o.urlLocal.value;
      var requestMethod =o.requestMethod.value;
      var requestCache = o.requestCache.value;
      app.file.download({
        url: url,
        urlLocal: urlLocal,
        readAs: readAs,
        // readAs: 'createObjectURL',
        // readAs: 'readAsText',
        // readAs: 'readAsArrayBuffer',
        // readAs: 'readAsDataURL',
        // readAs: 'readAsBinaryString',
  
        requestMethod: requestMethod,
        // requestMethod: 'GET',
        // requestMethod: 'POST',
        
        requestCache:requestCache,
        // requestCache:false,
        // requestCache:true,
        before: function(xmlHttp){
          // xmlHttp.responseType = "blob";
          // xmlHttp.responseType = "document";
          // xmlHttp.responseType = "json";
          // xmlHttp.responseType = "text";
          // xmlHttp.responseType = 'arraybuffer';
          if (responseType)xmlHttp.responseType=responseType;
        }
      }).then(function(e){
        console.log('success',e);
      },function(e){
        console.log('fail',e);
      }).then(function(e){
        console.log('done');
      });
    },
    save:function(o){
      var urlLocal = o.urlLocal.value;
      var fileContent = o.fileContent.value;
      var fileType = o.fileType.value;
      if (urlLocal) {
        // NOTE: how **save** work!
        app.file.save({
          urlLocal: urlLocal,
          fileContent: fileContent,
          fileType: fileType
        }).then(function(e){
          console.log('success',e);
        },function(e){
          console.log('fail',e);
        }).then(function(e){
          console.log('done');
        });
      } else {
        console.log('urlLocal?');
      }
    },
    open:function(o){
      var urlLocal = o.urlLocal.value;
      var readAs = o.readAs.value;
      if (urlLocal) {
        // NOTE: how **open** work!
        app.file.open({
          urlLocal: urlLocal,
          readAs: readAs
        }).then(function(e){
          console.log('success',e);
        },function(e){
          console.log('fail',e);
        }).then(function(e){
          console.log('done');
        });
      } else {
        console.log('urlLocal?');
      }
    },
    delete:function(o){
      var urlLocal = o.urlLocal.value;
      if (urlLocal) {
        // NOTE: how **delete** work!
        app.file.delete({
          urlLocal: urlLocal,
          fileNotFound: true // fileNotFound if true return successCallback, even the file is not found!
        }).then(function(e){
          console.log('success',e);
        },function(e){
          console.log('fail',e);
        }).then(function(e){
          console.log('done');
        });
      } else {
        console.log('urlLocal?');
      }
    },
    downloadThenSave:function(o){
      var url = o.url.value;
      var readAs = o.readAs.value;
      var responseType = o.responseType.value;
      var urlLocal = (o.urlLocal.value=='true')?true:o.urlLocal.value;
      var requestMethod =o.requestMethod.value;
      var requestCache = o.requestCache.value;
      // NOTE: how **download** then **save** work!
      app.file.download({
        url: url,
        urlLocal: urlLocal,
        readAs: readAs,
        requestMethod: requestMethod,
        requestCache:requestCache,
        fileOption:{
          create:true
        },
        before: function(xmlHttp){
          if (responseType)xmlHttp.responseType=responseType;
        }
      }).then(function(e){
        console.log('success',e);
      },function(e){
        console.log('fail',e);
      }).then(function(e){
        console.log('done');
      });
    }
  };
}(scriptive("app")));