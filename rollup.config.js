import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',

  // exclude React dependency from bundle
  external: ['react'],

  // The name to use for UMD bundle
  moduleName: 'ReactCompositeEvents',

  // Mapping of imported modules to globally accessible names for UMD bundle
  globals: {
    react: 'React',
  },

  targets: [
    {dest: 'dist/react-composite-events.es.js', format: 'es'},
    {dest: 'dist/react-composite-events.cjs.js', format: 'cjs'},
    {dest: 'dist/react-composite-events.umd.js', format: 'umd'},
  ],

  plugins: [
    // Seamless integration between Rollup and Babel
    babel({
      // don't worry about transpiling node_modules when bundling
      exclude: 'node_modules/**',

      // don't place helpers at the top of the files, but point to reference contained external helpers
      externalHelpers: true,

      babelrc: false,

      // Copied from setting in package.json
      presets: [
        [
          'env',
          {
            // needed for rollup because it operates w/ ES modules only
            modules: false,
            loose: true,
          },
        ],
        'stage-3',
        'react',
      ],
      plugins: ['transform-class-properties'],
    }),

    // Locate modules using the Node resolution algorithm, for using third party modules in node_modules
    resolve({
      // use "module" field for ES6 module if possible
      module: true,

      // use (legacy) "jsnext:main" if possible
      jsnext: true,

      // use "main" field or index.js
      main: true,
    }),

    // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    commonjs({
      // Node modules are the ones we're trying to get it to understand
      include: 'node_modules/**',
    }),
  ],
}
