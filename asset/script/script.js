var file, msgContainer, app = {
  ready: function(callback){
    window.addEventListener('DOMContentLoaded', function(){
      hljs.initHighlightingOnLoad();
      // msgContainer= document.getElementById('msg');
      // msgContainer.innerHTML='init.??';
      if (callback instanceof Function) {
        if (window.cordova && location.protocol == 'file:') {
          document.addEventListener('deviceready', callback, false);
        } else {
          callback();
        }
      }
    });
  },
  store:{
    name:{},
    unique:'fileStorage:103',
    select:function() {
      var val = window.localStorage.getItem(this.unique);
      try {
        this.name = val?JSON.parse(val):{};
      } catch (e) {
        this.name = {};
      } finally {
        return this;
      }
    },
    update:function() {
      window.localStorage.setItem(this.unique,JSON.stringify(this.name));
    },
    find:function(filename) {
      return this.name.hasOwnProperty(filename);
    },
    delete:function(filename) {
      if (this.find(filename)) {
        delete this.name[filename];
        this.update();
      }
      return this;
    },
    insert:function(filename,filetype) {
      this.name[filename]=filetype;
      this.update();
      return this;
    }
  },
  requestResponse:function(s){
    var id,elm =document.getElementById('configuration').children;
    for (var i = 0, len = elm.length; i < len; i++) {
      id = elm[i].getAttribute('id');
      if (id && s.hasOwnProperty(id)) {
        elm[i].innerHTML= (s[id] instanceof Array)?s[id].join(", "):s[id];
      }
    }
    var toggleCode = document.getElementsByClassName('toggleCode');
    for (var i = 0, len = toggleCode.length; i < len; i++) {
      var e=toggleCode[i], codeBlock = toggleCode[i].nextSibling.nextSibling;
      e.classList.toggle('active',app.visibleElement(codeBlock));
      app.click(toggleCode[i],function(evt){

        var e = evt.target, codeBlock = e.nextSibling.nextSibling;
        if (app.visibleElement(codeBlock)) {
          codeBlock.style.display='none';
          e.classList.remove('active');
        } else {
          e.classList.add('active');
          codeBlock.style.display='block';
        }
      });
    }
  },
  click: function(element,callback) {
    element.addEventListener('click', callback);
  },
  submit: function(element,callback) {
    element.addEventListener('submit', callback);
  },
  visibleElement: function(element) {
    // incorrectIsVisible = window.getComputedStyle(codeBlock, null).getPropertyValue('display');
    return window.getComputedStyle(element).display === 'block';
  },
  form:{
    watch:function(){
      document.querySelectorAll("form").forEach(function(form) {
        app.submit(form,function(evt){
          var data = evt.target.elements, task = evt.target.getAttribute("id");
          if (task) app.form[task](data);
          evt.preventDefault();
        });
      });
      document.querySelectorAll('.update-urlLocalList').forEach(function(handler) {
        app.click(handler,function(evt){
          var p = evt.target.parentElement;
          var container = p.querySelector('datalist'), datalist = app.store.select().name;
            container.innerHTML='';
            p.querySelector('input').value='';
            for (var filename in datalist) {
              if (datalist.hasOwnProperty(filename)) {
                // <option value="directory/filename">
                var eOption = document.createElement("option");
                eOption.setAttribute('value',filename);
                container.appendChild(eOption);
              }
            }
        });
      });
    },
    download:function(o){
      // console.log('download',o);
      var url = o.url.value;
      var readAs = o.readAs.value;
      var responseType = o.responseType.value;
      var urlLocal = (o.urlLocal.value=='true')?true:o.urlLocal.value;
      var requestMethod =o.requestMethod.value;
      var requestCache = o.requestCache.value;
      file.download({
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
        // console.log('done');
      });
    },
    save:function(o){
      var urlLocal = o.urlLocal.value;
      var fileContent = o.fileContent.value;
      var fileType = o.fileType.value;
      if (urlLocal) {
        // NOTE: how **save** work!
        file.save({
          urlLocal: urlLocal,
          fileContent: fileContent,
          fileType: fileType
        }).then(function(e){
          console.log('success',e);
          app.store.insert(urlLocal,fileType);
          // app.store.delete(urlLocal);
        },function(e){
          console.log('fail',e);
        }).then(function(e){
          // console.log('done');
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
        file.open({
          urlLocal: urlLocal,
          readAs: readAs
        }).then(function(e){
          console.log('success',e);
        },function(e){
          console.log('fail',e);
        }).then(function(e){
          // console.log('done');
        });
      } else {
        console.log('urlLocal?');
      }
    },
    delete:function(o){
      var urlLocal = o.urlLocal.value;
      if (urlLocal) {
        // NOTE: how **delete** work!
        file.delete({
          urlLocal: urlLocal,
          fileNotFound: true // fileNotFound if true return successCallback, even the file is not found!
        }).then(function(e){
          console.log('success',e);
          // app.store.insert(urlLocal,fileType);
          app.store.delete(urlLocal);
        },function(e){
          console.log('fail',e);
        }).then(function(e){
          // console.log('done');
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
      file.download({
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
        app.store.insert(e.urlLocal,e.fileType);
      },function(e){
        console.log('fail',e);
      }).then(function(e){
        // console.log('done');
      });
    }
  }
};

app.ready(function(){
  file = fileStorage({
        Base: 'storage',
        RequestQuota: 1073741824,
        Permission: 1,
        objectStore:{
          name:'fileStorage',
          version:1,
          file:'file',
          other:{
           name:'otherName',option:{}
          }
        }
      },
      {
        done: function(status) {
          // NOTE: doneCallback!
          // REVIEW: executed either success or fail!
          app.requestResponse(status);
        },
        fail: function(status) {
          // NOTE: failCallback
          // REVIEW: executed to warn the Browser does not support 'requestFileSystem'!
        },
        success: function(fs) {
          // NOTE: successCallback
          // REVIEW: Browser supports 'requestFileSystem' or 'IndexedDB'!
          app.form.watch();
        }
      }
    );
});