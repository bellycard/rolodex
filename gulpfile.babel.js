import gulp from 'gulp';
import rename from 'gulp-rename';
import header from 'gulp-header';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import'
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import pkg from './package.json';

const banner = `/*! ${pkg.name} v${pkg.version} | ${pkg.license} License | ${pkg.repository.url} */\n`;

gulp.task('default', () => {
  return gulp.src('./src/rolodex.css')
    .pipe(postcss([
      postcssImport(),
      autoprefixer()
    ]))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(postcss([
      cssnano({
        svgo: false,
      })
    ]))
    .pipe(gulp.dest('./dist'))
});

gulp.task('watch', ['default'], () => {
  gulp.watch('src/**/*.css', ['default'])
});
