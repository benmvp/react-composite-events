/* eslint-disable import/unambiguous */

const gulp = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const replace = require('gulp-replace')
const debug = require('gulp-debug')
const util = require('gulp-util')
const del = require('del')

const FORMAT_ESM = 'esm'
const FORMAT_CJS = 'cjs'
const FORMAT_UMD = 'umd'

const FILES_TO_BUILD = [
  // include all the JavaScript files in src/ directory
  'src/*.js',

  // but exclude the test files
  '!src/*.spec.js',
]

// When transpiling to ES format, we still use the `env` preset
// and we want everything transpiled EXCEPT modules
const ESM_ENV_PRESET = ['env', {modules: false}]

// When transpiling to UMD, we need the UMD transform plugin.
// Need to explicitly list the globals unfortunately
const UMD_TRANSFORM_PLUGIN = [
  'transform-es2015-modules-umd',
  {
    globals: {
      react: 'React',
      index: 'RCE',
      compose: 'RCE_compose',
      generic: 'RCE_generic',
      mouse: 'RCE_mouse',
      key: 'RCE_key',
      './compose': 'RCE_compose',
      './generic': 'RCE_generic',
      './mouse': 'RCE_mouse',
      './key': 'RCE_key',
    },
    exactGlobals: true,
  },
]

const _getBabelStream = (format) =>
  gulp
    // get a stream of the files to transpile
    .src(FILES_TO_BUILD)
    // initialize the sourcemaps (used by UMD only)
    .pipe(format === FORMAT_UMD ? sourcemaps.init() : util.noop())
    // do the appropriate babel transpile (this is a copy from package.json)
    .pipe(
      babel({
        babelrc: false,

        presets: [
          format === FORMAT_ESM ? ESM_ENV_PRESET : 'env',
          'stage-3',
          'react',
        ],
        plugins: [
          'transform-class-properties',
          'external-helpers',
          ...(format === FORMAT_UMD ? [UMD_TRANSFORM_PLUGIN] : []),
        ],
      })
    )

gulp.task('build:clean:cjs', () => del(['lib/cjs']))
gulp.task('build:clean:esm', () => del(['lib/esm']))
gulp.task('build:clean:umd', () => del(['lib/umd']))
gulp.task('build:clean', [
  'build:clean:cjs',
  'build:clean:esm',
  'build:clean:umd',
])

gulp.task('build:cjs', ['build:clean:cjs'], () =>
  _getBabelStream(FORMAT_CJS)
    .pipe(debug({title: 'Building CJS'}))
    .pipe(gulp.dest('lib/cjs'))
)

gulp.task('build:esm', ['build:clean:esm'], () =>
  _getBabelStream(FORMAT_ESM)
    .pipe(debug({title: 'Building ESM:'}))
    .pipe(gulp.dest('lib/esm'))
)

gulp.task('build:umd', ['build:clean:umd'], () =>
  _getBabelStream(FORMAT_UMD)
    // If you're using UMD, you probably don't have `process.env.NODE_ENV` so, we'll replace
    // it. If you're using the unimified UMD, you're probably in DEV
    .pipe(replace('process.env.NODE_ENV', JSON.stringify('development')))
    .pipe(sourcemaps.write('./'))
    .pipe(debug({title: 'Building UMD:'}))
    .pipe(gulp.dest('lib/umd'))
)

gulp.task('build:umd:min', ['build:clean:umd'], () =>
  _getBabelStream(FORMAT_UMD)
    // If you're using UMD, you probably don't have `process.env.NODE_ENV` so, we'll replace
    // it. If you're using the imified UMD, you're probably in production
    .pipe(replace('process.env.NODE_ENV', JSON.stringify('production')))
    // minify the files and rename to .min.js extension
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('./'))
    .pipe(debug({title: 'Building + Minifying UMD:'}))
    .pipe(gulp.dest('lib/umd'))
)

gulp.task('build', ['build:cjs', 'build:esm', 'build:umd', 'build:umd:min'])

gulp.task('default', ['build'])
