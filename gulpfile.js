 const gulp = require('gulp');
 const concat = require('gulp-concat');
 const sass = require('gulp-sass');
 const child = require('child_process');
 const gutil = require('gulp-util');
 const fs = require('fs');
 const browserSync = require('browser-sync').create();
 const siteRoot = '_site';
 const cssFiles = '_css/**/*.?(s)css';
 var download = require('gulp-downloader'),
     jeditor = require('gulp-json-editor'),
     jsonTransform = require('gulp-json-transform'),
     request = require('request'),
     source = require('vinyl-source-stream'),
     ghPages = require('gulp-gh-pages'),
     streamify = require('gulp-streamify');

 
  gulp.task('devos', function () {
    return request({
      url: 'https://api.airtable.com/v0/appWalqcA1KjDB5Ix/Devotions?&view=ordered',
            headers: {
                  'User-Agent': 'request',
                  'Authorization': 'Bearer keyRTLlrVS02vC3Vx'
            }
        })
        .pipe(source('devos.json'))
        .pipe(streamify(jsonTransform(function (data) {
                // data is your json
                
                // start off with an empty array
                var arr = [];
                // loop through every record
                for (var i = 0, ii = data.records.length; i < ii; i++)
                {
                  // push the item value into the array
                  arr.push(data.records[i].fields);
                }
                return arr;
            })))
        .pipe(gulp.dest('./_data'));
 });

 
 gulp.task('css', () => {
   gulp.src(cssFiles)
   .pipe(sass())
     .pipe(concat('all.css'))
     .pipe(gulp.dest('assets'));
      });

 gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
  gulp.watch(cssFiles, ['css']);
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('default', ['css', 'jekyll', 'serve']);