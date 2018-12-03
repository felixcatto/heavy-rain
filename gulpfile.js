const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const babel = require('gulp-babel');
const Browser = require('browser-sync');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const cssImport = require('postcss-import');
const webpackConfig = require('./webpack.config.js');


const serverJsPath = [
  '*/**/*.js',
  '!node_modules/**',
  '!dist/**',
  '!clientComponents/**',
  '!views/**/*.js',
];

let server;
const devServer = Browser.create();
const bundler = webpack(webpackConfig);
bundler.plugin('done', () => devServer.reload());

const clearCache = () => Object.keys(require.cache)
  .filter(p => !p.match(/node_modules/) && p.match(/dist/))
  .forEach(key => delete require.cache[key]);

const startServer = (done) => {
  const app = require('./dist/main').default; // eslint-disable-line
  server = app.listen(process.env.PORT || 4000, done);
};

const reloadServer = (done) => {
  server.close(() => {
    clearCache();
    startServer(done);
  });
};

const startDevServer = (done) => {
  devServer.init({
    open: false,
    notify: false,
    proxy: 'localhost:4000',
    port: 3000,
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        logLevel: 'silent',
      }),
    ],
  });
  done();
};

const reloadDev = (done) => {
  devServer.reload();
  done();
};

const transpileScss = () => gulp.src(['public/**/*.scss', 'views/**/*.scss'])
  .pipe(sass())
  .pipe(postcss([cssImport()]))
  .pipe(concat('index.css'))
  .pipe(gulp.dest('dist/public/css'));

const copyViews = () => gulp.src('views/**/*.pug').pipe(gulp.dest('dist/views'));

const copyMisc = gulp.series(
  () => gulp.src('public/font/*').pipe(gulp.dest('dist/public/font')),
  () => gulp.src('public/img/*').pipe(gulp.dest('dist/public/img')),
);

const bundleClientJs = done => bundler.run(done);

const transpileServerJs = () => gulp.src(serverJsPath)
  .pipe(babel())
  .pipe(gulp.dest('dist'));

const clean = () => del(['dist']);

const watch = () => {
  gulp.watch(serverJsPath, gulp.series(transpileServerJs, reloadServer, reloadDev));
  gulp.watch('views/**/*.pug', gulp.series(copyViews, reloadDev));
  gulp.watch(['public/**/*.scss', 'views/**/*.scss'], gulp.series(transpileScss, reloadDev));
};


const dev = gulp.series(
  clean,
  copyMisc,
  copyViews,
  transpileScss,
  transpileServerJs,
  startServer,
  startDevServer,
  watch,
);


const prod = gulp.series(
  clean,
  copyMisc,
  copyViews,
  transpileScss,
  transpileServerJs,
  bundleClientJs,
);


module.exports = { dev, prod };
