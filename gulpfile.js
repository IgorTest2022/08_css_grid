const { src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const gulpif = require('gulp-if');
const argv = require('yargs').argv;
const ttf2woff2 = require('gulp-ttftowoff2');
const ttf2woff = require('gulp-ttf2woff');
const browserSync = require('browser-sync').create();

const clean = () => {
    return del(['dist'])
}

const resources = () => {
    return src('sources/resources/**')
    .pipe(dest('dist'))
}

const woff2 = () => {
  return src('sources/fonts/**/*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest("dist/fonts"))
}

const woff = () => {
    return src('sources/fonts/**/*.ttf')
      .pipe(ttf2woff())
      .pipe(dest("dist/fonts"))
  }

const styles = () => {
    return src('sources/styles/**/*.css') //выбираем файлы которые будем контактинировать
        .pipe(gulpif(argv.dev,sourcemaps.init()))
        .pipe(concat('main.css')) //имя полученного файла
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('dist/css')) //папка, где будет хранится файл
        .pipe(browserSync.stream())
};

const htmlMinify = () => {
    return src('sources/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const svgSprites = () => {
    return src('sources/images/svg/**/*.svg')
    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: '../sprite.svg'
            }
        }
    }))
    .pipe(dest('dist/images'))
}

const scripts = () => {
    return src ([
        'sources/js/**/*.js',
        'sources/js/main.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(gulpif(argv.build,uglify().on('error', notify.onError())))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const watchFiles = () => {
    browserSync.init ({
        server: {
            baseDir: 'dist'
        }
    })
}

const images = () => {
    return src ([
        'sources/images/**/*.jpg',
        'sources/images/**/*.png',
        'sources/images/*.svg',
        'sources/images/**/*.jpeg'
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
}

watch('sources/**/*.html', htmlMinify)
watch('sources/styles/**/*.css', styles)
watch('sources/images/svg/**/*.svg', svgSprites)
watch('sources/js/**/*.js', scripts)
watch('sources/resources/**', resources)

exports.styles = styles; //вызываем функцию
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
exports.default = series(clean, woff2, woff, resources, htmlMinify, scripts, styles, images, svgSprites, watchFiles);
