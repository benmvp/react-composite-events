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
const flowCopySource = require('flow-copy-source')

const {rollup} = require('rollup')
const rollupBabel = require('rollup-plugin-babel')
const rollupNodeResolve = require('rollup-plugin-node-resolve')
const rollupCommonjs = require('rollup-plugin-commonjs')
const rollupReplace = require('rollup-plugin-replace')
const rollupUglify = require('rollup-plugin-uglify')

const FORMAT_ESM = 'esm'
const FORMAT_CJS = 'cjs'
const FORMAT_UMD = 'umd'

const MODULE_NAME = 'RCE'

const SOURCE_ENTRY = 'src/index.js'

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
      index: MODULE_NAME,
      compose: `${MODULE_NAME}_compose`,
      generic: `${MODULE_NAME}_generic`,
      mouse: `${MODULE_NAME}_mouse`,
      key: `${MODULE_NAME}_key`,
      './compose': `${MODULE_NAME}_compose`,
      './generic': `${MODULE_NAME}_generic`,
      './mouse': `${MODULE_NAME}_mouse`,
      './key': `${MODULE_NAME}_key`,
    },
    exactGlobals: true,
  },
]

const _getBabelConfig = (format) => ({
  babelrc: false,

  presets: [
    format === FORMAT_ESM ? ESM_ENV_PRESET : 'env',
    'stage-3',
    'react',
    'flow',
  ],
  plugins: [
    'transform-class-properties',
    'external-helpers',
    ...(format === FORMAT_UMD ? [UMD_TRANSFORM_PLUGIN] : []),
  ],
})

const _getBabelStream = (format) =>
  gulp
    // get a stream of the files to transpile
    .src(FILES_TO_BUILD)
    // initialize the sourcemaps (used by UMD only)
    .pipe(format === FORMAT_UMD ? sourcemaps.init() : util.noop())
    // do the appropriate babel transpile (this is a copy from package.json)
    .pipe(babel(_getBabelConfig(format)))

const _genRollupDist = (minify = false) =>
  rollup({
    entry: SOURCE_ENTRY,

    // exclude React dependency from bundle
    external: ['react'],

    plugins: [
      // Need to replace `process.env.NODE_ENV` in the bundle because most likely the place where this
      // would be used doesn't support it. When minified we assume production, dev otherwise
      rollupReplace({
        'process.env.NODE_ENV': JSON.stringify(
          minify ? 'production' : 'development'
        ),
      }),

      // Locate modules using the Node resolution algorithm, for using third party modules in node_modules
      rollupNodeResolve({
        // use "module" field for ES6 module if possible
        module: true,

        // use (legacy) "jsnext:main" if possible
        jsnext: true,

        // use "main" field or index.js
        main: true,
      }),

      // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
      rollupCommonjs({
        // Node modules are the ones we're trying to get it to understand
        include: 'node_modules/**',
      }),

      // Seamless integration between Rollup and Babel
      rollupBabel(
        Object.assign(
          {
            // don't worry about transpiling node_modules when bundling
            exclude: 'node_modules/**',

            // don't place helpers at the top of the files, but point to reference contained external helpers
            externalHelpers: true,
          },
          _getBabelConfig(FORMAT_ESM)
        )
      ),

      // Minify the code if that option is specified
      minify ? rollupUglify() : null,
    ].filter(Boolean),
  }).then((bundle) =>
    bundle.write({
      format: FORMAT_UMD,
      dest: `dist/react-composite-events${minify ? '.min' : ''}.js`,

      // The name to use for UMD bundle
      moduleName: MODULE_NAME,

      // Mapping of imported modules to globally accessible names for UMD bundle
      globals: {
        react: 'React',
      },

      sourceMap: true,
    })
  )

const _copyFlow = (format) =>
  flowCopySource(['src'], `lib/${format}`, {
    verbose: true,
    ignore: '**/*.spec.js',
  })

gulp.task('build:clean:lib:cjs', () => del(['lib/cjs']))
gulp.task('build:clean:lib:esm', () => del(['lib/esm']))
gulp.task('build:clean:lib:umd', () => del(['lib/umd']))
gulp.task('build:clean:dist', () => del(['dist/umd']))
gulp.task('build:clean', [
  'build:clean:lib:cjs',
  'build:clean:lib:esm',
  'build:clean:lib:umd',
  'build:clean:dist',
])

gulp.task('build:lib:cjs', ['build:clean:lib:cjs'], () =>
  _getBabelStream(FORMAT_CJS)
    .pipe(debug({title: 'Building CJS'}))
    .pipe(gulp.dest('lib/cjs'))
)

gulp.task('build:lib:cjs:flow', ['build:lib:cjs'], () => _copyFlow(FORMAT_CJS))

gulp.task('build:lib:esm', ['build:clean:lib:esm'], () =>
  _getBabelStream(FORMAT_ESM)
    .pipe(debug({title: 'Building ESM:'}))
    .pipe(gulp.dest('lib/esm'))
)

gulp.task('build:lib:esm:flow', ['build:lib:esm'], () => _copyFlow(FORMAT_ESM))

gulp.task('build:lib:umd', ['build:clean:lib:umd'], () =>
  _getBabelStream(FORMAT_UMD)
    // If you're using UMD, you probably don't have `process.env.NODE_ENV` so, we'll replace
    // it. If you're using the unimified UMD, you're probably in DEV
    .pipe(replace('process.env.NODE_ENV', JSON.stringify('development')))
    .pipe(sourcemaps.write('./'))
    .pipe(debug({title: 'Building UMD:'}))
    .pipe(gulp.dest('lib/umd'))
)

gulp.task('build:lib:umd:min', ['build:clean:lib:umd'], () =>
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

gulp.task('build:dist', ['build:clean:dist'], () => _genRollupDist())

gulp.task('build:dist:min', ['build:clean:dist'], () => _genRollupDist(true))

gulp.task('build', [
  'build:lib:cjs:flow',
  'build:lib:esm:flow',
  'build:lib:umd',
  'build:lib:umd:min',
  'build:dist',
  'build:dist:min',
])

gulp.task('default', ['build'])
