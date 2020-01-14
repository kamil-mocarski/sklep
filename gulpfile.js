const gulp = require('gulp');
const sass = require('gulp-sass');
//const babel = require('gulp-babel');
const jsSrcPath = 'src/js/**/*.js';
 
// gulp.task('babel', () =>
//     gulp.src(jsSrcPath)
//         .pipe(babel({
//             presets: ['@babel/preset-env']
//         }))
//         .pipe(gulp.dest('dist'))
// );
// gulp.task('babel:watch', function () {
//     gulp.watch(jsSrcPath, gulp.series('babel'));
// });

sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', gulp.parallel('sass'));
});