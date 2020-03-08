const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');

//Compile scss into css
function style() {
    // where is my scss
    return gulp.src('./scss/**/*.scss')
        // pass that file through sass compiler
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        //autoprefix things
        .pipe(prefix())
        // where do i save the compiled css
        .pipe(gulp.dest('./public/assets/css'));
}

exports.style = style;
