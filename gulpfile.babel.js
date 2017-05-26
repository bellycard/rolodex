import gulp from 'gulp';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import'
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

gulp.task('css', () => {
  return gulp.src('./src/rolodex.css')
    .pipe(postcss([
      postcssImport(),
      autoprefixer(),
    ]))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({
      extname: '.min.css',
    }))
    .pipe(postcss([
      cssnano({svgo: false}),
    ]))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['css']);
