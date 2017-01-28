fileStorage -- Javascript file Storage
========
Demo: https://scriptive.github.io/fileStorage

[Download](dist/filestorage.min.js) lastest version.

For [License](LICENSE) information.

## TODO
- [x] open() returned [fileContent, fileType, fileSize]

## file!
- [x] download
- [x] save
- [x] open
- [x] delete

:sparkles: :camel: :boom:

## Configuration
```javascript
var file = fileStorage({
    // Base: 'storage',
    // Base: 'database',
    // RequestQuota: 1073741824,
    Permission: 1,
    objectStore:{
      version:2
    }
  },
  {
    done: function(status) {
      // NOTE: doneCallback!
      // REVIEW: executed either success or fail!
      console.log('init.done');
    },
    fail: function(status) {
      // NOTE: failCallback
      // REVIEW: executed to warn the Browser does not support 'requestFileSystem'!
      console.log('init.fail');
    },
    success: function(fs) {
      // NOTE: successCallback
      // REVIEW: Browser supports 'requestFileSystem'!
      console.warn('init.success');
    }
  }
);
```
## Download
how **download** work!
```javascript
file.download({
  url: 'http://www.example.com/file.xml',
  urlLocal: 'filename.xml',
  // urlLocal===true -> file.xml

  // readAs: 'createObjectURL',
  // readAs: 'readAsText',
  // readAs: 'readAsArrayBuffer',
  // readAs: 'readAsDataURL',
  // readAs: 'readAsBinaryString',

  // requestMethod: 'GET',
  // requestMethod: 'POST',
  
  // requestCache:false,
  // requestCache:true,
  before: function(xmlHttp){
    // xmlHttp.responseType = "blob";
    // xmlHttp.responseType = "document";
    // xmlHttp.responseType = "json";
    // xmlHttp.responseType = "text";
    // xmlHttp.responseType = 'arraybuffer';
  },
  progress: function(Percentage){
    console.log(Percentage);
  }
}).then(function(e){
  console.log('success');
},function(e){
  console.log('fail');
}).then(function(e){
  console.log('done');
});
```
## Save
how **save** work!
```javascript
file.save({
  urlLocal: 'directory/filename.txt',
  fileContent: 'this is plain text',
  fileType: 'text/plain'
}).then(function(e){
  console.log('success');
},function(e){
  console.log('fail');
}).then(function(e){
  console.log('done');
});
```
## Open
how **open** work!
```javascript
file.open({
  urlLocal: 'directory/filename.txt',
  readAs: 'createObjectURL'
}).then(function(e){
  console.log('success');
},function(e){
  console.log('fail');
}).then(function(e){
  console.log('done');
});
```
## Delete
how **delete** work!
```javascript
file.delete({
  urlLocal: 'directory/filename.txt',
  fileNotFound: true // fileNotFound if true return successCallback, even the file is not found!
}).then(function(e){
  console.log('success');
},function(e){
  console.log('fail');
}).then(function(e){
  console.log('done');
});
```
## Download then save
how **download** then **save** work!
```javascript
file.download({
  url: 'http://www.example.com/file.xml',
  urlLocal: true,
  readAs: 'createObjectURL'
  fileOption:{
    create:true
  },
  before: function(xmlHttp){
    xmlHttp.responseType='blob';
  },
  progress: function(Percentage){
    console.log(Percentage);
  }
}).then(function(e){
  console.log('success');
},function(e){
  console.log('fail');
}).then(function(e){
  console.log('done');
});
```
## Promise
how **Promise** process in Javascript!
```javascript
return new Promise(function(resolve, reject) {
    // NOTE: resolve, reject
}).then(function(e) {
    // NOTE: if success
    return e;
}, function(e) {
    // NOTE: if fail
    return e;
}).then(function(e){
    // NOTE: when done
    return e;
});
```
