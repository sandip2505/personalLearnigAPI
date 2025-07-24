const browsersync = require('browser-sync').create();
const cached = require('gulp-cached');
const cssnano = require('gulp-cssnano');
const del = require('del');
const fileinclude = require('gulp-file-include');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const npmdist = require('gulp-npm-dist');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref-plus');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require('gulp-clean-css');
const newer = require("gulp-newer");


const paths = {
    base: {
        base: {
            dir: './'
        },
        node: {
            dir: './node_modules'
        },
        packageLock: {
            files: './package-lock.json'
        }
    },
    dist: {
        libs: {
            dir: './public/libs'
        },
        images: {
            dir: "./public/images",
        },
        fonts: {
            dir: "./public/fonts",
        },
        data: {
            dir: './public/data',
        },
        css: {
            dir: './public/css',
        },
        js: {
            dir: './public/js',
            files: './public/js/pages',
        },
    },
    src: {
        base: {
            dir: 'public/source/',
            files: 'public/source/**/*'
        },
        css: {
            dir: 'public/source/css',
            files: 'public/source/css/**/*'
        },
        data: {
            dir: 'public/source/data',
            files: 'public/source/data/**/*',
        },
        images: {
            dir: 'public/source/images',
            files: 'public/source/images/**/*',
        },
        fonts: {
            dir: "public/source/fonts",
            files: "public/source/fonts/**/*",
        },
        js: {
            dir: 'public/source/js',
            pages: 'public/source/js/pages',
            files: 'public/source/js/pages/*.js',
            main: 'public/source/js/*.js',
        },
        scss: {
            dir: 'public/source/scss',
            files: 'public/source/scss/**/*',
            icons: 'public/source/scss/icons.scss',
            main: 'public/source/scss/app**.scss',
            bootstrap: 'public/source/scss/bootstrap**.scss'
        }
    }
};

gulp.task('browsersync', function (callback) {
    browsersync.init({
        server: {
            baseDir: [paths.dist.base.dir, paths.src.base.dir, paths.base.base.dir]
        },
    });
    callback();
});

gulp.task('browsersyncReload', function (callback) {
    browsersync.reload();
    callback();
});

gulp.task('watch', function () {
    gulp.watch(paths.src.js.dir, gulp.series('js', 'browsersyncReload'));
    gulp.watch(paths.src.js.pages, gulp.series('jsPages', 'browsersyncReload'));
    gulp.watch(paths.src.scss.icons, gulp.series('icons', 'browsersyncReload'));
    gulp.watch([paths.src.scss.bootstrap, '!' + paths.src.scss.main, '!' + paths.src.scss.icons], gulp.series('bootstrap', 'browsersyncReload'));
    gulp.watch([paths.src.scss.files, '!' + paths.src.scss.bootstrap, '!' + paths.src.scss.icons], gulp.series('scss', 'bootstrap', 'browsersyncReload'));
});

gulp.task('js', function () {
    return gulp
        .src(paths.src.js.main)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.js.dir));
});

gulp.task('jsPages', function () {
    return gulp
        .src(paths.src.js.files)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.js.files));
});

//  Compile app scss
gulp.task('scss', function () {
    // generate ltr  
    return gulp
        .src([paths.src.scss.main, '!' + paths.src.scss.bootstrap, '!' + paths.src.scss.icons])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer()
        )
        .pipe(gulp.dest(paths.dist.css.dir))
        .pipe(cleanCSS())
        .pipe(
            rename({
                suffix: ".min"
            })
        )
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.dist.css.dir));

});

//  Compile bootstrap scss
gulp.task('bootstrap', function () {
    return gulp
        .src([paths.src.scss.bootstrap, '!' + paths.src.scss.main, '!' + paths.src.scss.icons])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer()
        )
        .pipe(gulp.dest(paths.dist.css.dir))
        .pipe(cleanCSS())
        .pipe(
            rename({
                suffix: ".min"
            })
        )
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.dist.css.dir));

});

//  Compile Icons
gulp.task('icons', function () {
    return gulp
        .src(paths.src.scss.icons)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.dist.css.dir))
        .pipe(cleanCSS())
        .pipe(
            rename({
                suffix: ".min"
            })
        )
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(paths.dist.css.dir));
});


gulp.task("images", function () {
    return gulp
        .src(paths.src.images.files)
        .pipe(newer(paths.dist.images.dir))
        .pipe(gulp.dest(paths.dist.images.dir));
});

gulp.task("fonts", function () {
    return gulp
        .src(paths.src.fonts.files)
        .pipe(newer(paths.dist.fonts.dir))
        .pipe(gulp.dest(paths.dist.fonts.dir));
});

gulp.task("data", function () {
    return gulp
        .src(paths.src.data.files)
        .pipe(newer(paths.dist.data.dir))
        .pipe(gulp.dest(paths.dist.data.dir));
});

//  Delete Packge-lock file
gulp.task('clean:packageLock', function (callback) {
    del.sync(paths.base.packageLock.files);
    callback();
});

//  Clean Dist
gulp.task('clean:dist', function (callback) {
    del.sync(paths.dist.base.dir);
    callback();
});

//  Copy All File
gulp.task('copy:all', function () {
    return gulp
        .src([
            paths.src.base.files,
            '!' + paths.src.scss.dir, '!' + paths.src.scss.files,
            '!' + paths.src.js.dir, '!' + paths.src.js.files, '!' + paths.src.js.main,
            '!' + paths.src.html.files,
        ])
        .pipe(gulp.dest(paths.dist.base.dir));
});

gulp.task('copy:libs', function () {
    return gulp
        .src(npmdist(), {base: paths.base.node.dir})
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
        }))
        .pipe(gulp.dest(paths.dist.libs.dir));
});

//  Producation Task
gulp.task('default', gulp.series(gulp.parallel('clean:packageLock', 'copy:libs', 'scss', 'bootstrap', 'icons', 'js', 'jsPages', 'images', 'fonts','data'), gulp.parallel('watch')));

//  Build Task
gulp.task('build', gulp.series(gulp.parallel('clean:packageLock', 'copy:libs', 'scss', 'bootstrap', 'icons', 'js', 'jsPages', 'images', 'fonts','data')));
