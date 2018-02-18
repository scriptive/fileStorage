/**
* gulp sass
* gulp script
* gulp test
* gulp watch


asset/
docs/

*/
//DEFAULT
var path=require('path'),Argv=require('minimist')(process.argv);
//COMMON PACKAGE
var fs=require('fs-extra'),clc=require('cli-color'),extend=require('node.extend');
//REQUIRE PACKAGE
var gulp=require('gulp'),sass=require('gulp-sass'),minifyCss=require('gulp-clean-css'),
uglify=require('gulp-uglify'),concat=require('gulp-concat'),include=require('gulp-include');
// REQUIRE DATA
var Package=JSON.parse(fs.readFileSync('package.json'));
// GULP
var configAssetRoot=Package.config.common.asset.root;
var configPublicRoot=Package.config.common.public.root;
var configDistRoot=Package.config.common.dist.root;

var rootAsset=path.join(configAssetRoot);
var rootDist=path.join(configDistRoot);
var rootPublic=path.join(configPublicRoot);

var style = {
  normal:{
    sass:{
      debugInfo: false,
      lineNumbers: true,
      errLogToConsole: true,
      outputStyle: 'nested' //compact, expanded, nested, compressed,
    },
    js:{
      mangle:false,
      output:{
          beautify: true
          // comments:'license'
      },
      compress:false
      //outSourceMap: true
    }
  },
  compressed:{
    sass:{
      debugInfo: true,
      lineNumbers: false,
      errLogToConsole: true,
      outputStyle: 'compressed'
    },
    js:{
      mangle:true,
      compress:true,
      output:{
        // beautify: true,
        comments:false
      }
    }
  },
};

var codeStyle = Argv.style;
if (codeStyle && style[codeStyle]) {
  codeStyle = style[codeStyle];
} else {
  codeStyle=style.compressed;
}
// NOTE: SASS
gulp.task('sass', function () {
  return gulp.src(path.join(rootAsset,'sass','*([^A-Z0-9-]).scss'))//!([^A-Z0-9-])
    .pipe(sass(codeStyle.sass).on('error', sass.logError))
    .pipe(gulp.dest(path.join(rootPublic,'css')));
});
// NOTE: Script
gulp.task('script',function(){
    return gulp.src(path.join(rootAsset,'script','*([^A-Z0-9-]).js'))
    .pipe(include().on('error', console.log))
    .pipe(uglify(codeStyle.js).on('error', console.log))
    .pipe(gulp.dest(path.join(rootPublic,'js')));
});
// NOTE: Main
gulp.task('filestorage',function(){
    return gulp.src(path.join(rootAsset,'filestorage','fileStorage.js'))
    .pipe(include().on('error', console.log))
    .pipe(uglify(style.compressed.js).on('error', console.log))
    .pipe(concat('filestorage.min.js'))
    .pipe(gulp.dest(rootDist))
    .pipe(uglify(codeStyle.js).on('error', console.log))
    .pipe(gulp.dest(path.join(rootPublic,'js')));
});

// /home/khensolomon/server/test/hello/www
// NOTE: Copy
gulp.task('copy',function(){
    return gulp.src(path.join(rootPublic,'js','*.js'))
    .pipe(gulp.dest(path.join('../test/hello/www','js')));
});
// NOTE: Base
// gulp.task('scriptive',function(){
//     return gulp.src(path.join(rootAsset,'scriptive','*([^A-Z0-9-]).js'))
//     .pipe(include().on('error', console.log))
//     .pipe(uglify(codeStyle.js).on('error', console.log))
//     .pipe(gulp.dest(path.join(rootPublic,'js')));
// });
// NOTE: Watch
gulp.task('watch', function() {
  // echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
    gulp.watch(path.join(rootAsset,'sass','*.scss'), ['sass']);
    gulp.watch(path.join(rootAsset,'filestorage','*.js'), ['filestorage']);
    gulp.watch(path.join(rootAsset,'script','*.js'), ['script']);
    gulp.watch(path.join(rootPublic,'js','*.js'), ['copy']);
});
// NOTE: TASK
gulp.task('default', ['watch']);
