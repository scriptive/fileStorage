(function(app) {
  app.load = function(o) {
    // console.log("loaded");
    app.fileStorage().then(function(){
       var demo = document.querySelector("ul#demo");
       demo.style.display = 'block';
    },function(e){
      console.log(e);
    });
    // console.log(app.file);
  };
  app.fileStorage = function() {
    return new Promise(function(resolve, reject) {
      app.file = fileStorage({
            // Permission: 1,
            objectStore:{
              version:2
            }
          },
          {
            done: function(status) {
              resolve();
            },
            fail: function(status) {
              reject(status);
            }
          }
      );
    });
  };
}(scriptive("app")));