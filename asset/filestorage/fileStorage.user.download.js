return new Promise(function(resolve, reject) {
  var xmlHttp = win.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  var Percentage = 0;
  xmlHttp.addEventListener("progress", function(e) {
      Percentage++;
      if (app.hasCallback(Query,'progress')){
        if (e.lengthComputable) {
          Percentage = Math.floor(e.loaded / e.total * 100);
          Query.progress(Percentage);
        } else if (xmlHttp.readyState == XMLHttpRequest.DONE) {
          Query.progress(100);
        } else if (xmlHttp.status != 200) {
          Query.progress(Math.floor(Percentage / 7 * 100));
          Percentage++;
        } else {
          Query.progress(100);
        }
      }
  }, false);
  xmlHttp.addEventListener("load", function (e) {
    Query.urlResponse = xmlHttp.responseURL;
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
    Query.data = xmlHttp.response;
    if (app.setting.extension[Query.fileExtension])Query.fileType = app.setting.extension[Query.fileExtension].ContentType;
    if (xmlHttp.responseType) {
      Query.dataType = xmlHttp.responseType;
      Query.fileType = (xmlHttp.response.type)?xmlHttp.response.type:Query.fileType;
    } else {
      if (xmlHttp.responseXML) {
        Query.fileCharset = xmlHttp.responseXML.charset;
        Query.fileType = xmlHttp.responseXML.contentType;
        Query.xml = xmlHttp.responseXML;
      }
      Query.fileContent = xmlHttp.responseText;
    }
    if (xmlHttp.status == 200) {
      delete Query.before;
      delete Query.progress;
      app.afterDownload(Query).then(function(){
        // TODO: resolve should return(Query,user,api Native)
        if(typeof Query.fileOption == 'object' && Query.fileOption.create === true && Query.urlLocal && app.config.support.length){
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
    } else if (xmlHttp.statusText) {
      reject({message:xmlHttp.statusText+': '+ Query.url,code:xmlHttp.status});
    } else if(xmlHttp.status) {
      reject({message:app.message.Fail,code:xmlHttp.status});
    } else {
      reject({message:app.message.UnknownError});
    }
  }, false);
  // xmlHttp.addEventListener('readystatechange', function(e) {});
  xmlHttp.addEventListener("error", function(e) {
      reject(e);
  }, false);
  xmlHttp.addEventListener("abort", function(e) {
      reject(e);
  }, false);
  if (Query.requestCache) {
      Query.urlRequest = Query.url + (Query.url.indexOf("?") > 0 ? "&" : "?") + "_=" + new Date().getTime();
  } else {
      Query.urlRequest = Query.url;
  }
  if(Query.url){
      xmlHttp.open(Query.requestMethod ? Query.requestMethod : 'GET', Query.urlRequest, true);
      // NOTE: how 'before' function should do!
      // xmlHttp.responseType = "blob";
      // xmlHttp.responseType = "document";
      // xmlHttp.responseType = "json";
      // xmlHttp.responseType = "text";
      // xmlHttp.responseType = 'arraybuffer';
      // xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
      // xmlHttp.withCredentials = true;
      // if (app.hasCallback(Query,'before'))Query.before(xmlHttp);
      app.hasCallbackMethod(Query,'before')(xmlHttp);
      xmlHttp.send();
  }else{
      reject({message:app.message.NoURLProvided});
  }
});