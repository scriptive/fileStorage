return new Promise(function(resolve, reject) {
  var xhr = win.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var Percentage = 0;
  xhr.addEventListener("progress", function(e) {
      Percentage++;
      if ($.hasCallback(Query,'progress')){
        if (e.lengthComputable) {
          Percentage = Math.floor(e.loaded / e.total * 100);
          Query.progress(Percentage);
        } else if (xhr.readyState == XMLHttpRequest.DONE) {
          Query.progress(100);
        } else if (xhr.status != 200) {
          Query.progress(Math.floor(Percentage / 7 * 100));
          Percentage++;
        } else {
          Query.progress(100);
        }
      }
  }, false);
  xhr.addEventListener("load", function (e) {
    Query.urlResponse = xhr.responseURL;
    Query.fileName = Query.url.replace(/[\#\?].*$/, '').substring(Query.url.lastIndexOf('/') + 1);
    Query.fileExtension = Query.fileName.split('.').pop();
    if(Query.urlLocal){
        // NOTE: Requested to save!
        if(Query.urlLocal === true){
            // NOTE: if true, then extract path from url
            var fileUrlLocalTmp = Query.url.match(/\/\/[^\/]+\/([^\.]+)/);
            if(fileUrlLocalTmp){
                Query.urlLocal = fileUrlLocalTmp[1].replace(/[\#\?].*$/, '');
            } else {
                Query.urlLocal = Query.url.replace(/[\#\?].*$/, '');
            }
        } else {
            Query.urlLocal = Query.urlLocal.replace(/[\#\?].*$/, '');
        }
    } else {
        Query.urlLocal=Query.fileName;
    }
    Query.fileCharset = 'UTF-8';
    Query.fileSize = e.total;
    Query.data = xhr.response;
    if ($.setting.extension[Query.fileExtension])Query.fileType = $.setting.extension[Query.fileExtension].ContentType;
    if (xhr.responseType) {
      Query.dataType = xhr.responseType;
      Query.fileType = (xhr.response.type)?xhr.response.type:Query.fileType;
    } else {
      if (xhr.responseXML) {
        Query.fileCharset = xhr.responseXML.charset;
        Query.fileType = xhr.responseXML.contentType;
        Query.xml = xhr.responseXML;
      }
      Query.fileContent = xhr.responseText;
    }
    if (xhr.status == 200 || xhr.status == 0) {
      delete Query.before;
      delete Query.progress;
      $.afterDownload(Query).then(function(){
        // TODO: resolve should return(Query,user,api Native)
        if(typeof Query.fileOption == 'object' && Query.fileOption.create === true && Query.urlLocal && config.support.length){
          user.file.save(Query).then(function(e){
            Query.fileCreation=true;
            Query.api=e;
            resolve(Query);
          },function(e){
            reject(e);
          });
        } else {
          resolve(Query);
        }
      },function(e){
        reject(e);
      });
    } else if (xhr.statusText) {
      reject({message:xhr.statusText+': '+ Query.url,code:xhr.status});
    } else if(xhr.status) {
      reject({message:$.message.Fail,code:xhr.status});
    } else {
      reject({message:$.message.UnknownError});
    }
  }, false);
  // xhr.addEventListener('readystatechange', function(e) {});
  xhr.addEventListener("error", function(e) {
      reject(e);
  }, false);
  xhr.addEventListener("abort", function(e) {
      reject(e);
  }, false);
  if (Query.requestCache) {
      Query.urlRequest = Query.url + (Query.url.indexOf("?") > 0 ? "&" : "?") + "_=" + new Date().getTime();
  } else {
      Query.urlRequest = Query.url;
  }
  if(Query.url){
      xhr.open(Query.requestMethod ? Query.requestMethod : 'GET', Query.urlRequest, true);
      // NOTE: how 'before' function should do!
      // xhr.responseType = "blob";
      // xhr.responseType = "document";
      // xhr.responseType = "json";
      // xhr.responseType = "text";
      // xhr.responseType = 'arraybuffer';
      // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      // xhr.withCredentials = true;
      // if ($.hasCallback(Query,'before'))Query.before(xhr);
      $.hasCallbackMethod(Query,'before')(xhr);
      xhr.send();
  }else{
      reject({message:$.message.NoURLProvided});
  }
});