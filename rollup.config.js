const { babel } = require('@rollup/plugin-babel')
const babelConfig = require('./.babelrc')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const path = require('path')
const sass = require('rollup-plugin-sass')
const { terser } = require('rollup-plugin-terser')

const plugins = [
  babel({
    babelHelpers: 'runtime',
    babelrc: false,
    plugins: babelConfig.plugins.filter(
      (p) => p !== '@babel/plugin-transform-modules-commonjs'
    ),
    presets: babelConfig.presets
  }),
  nodeResolve(),
  sass({
    insert: true
  }),
  terser()
]

module.exports = [
  {
    external: ['./utils'],
    input: `${path.resolve(__dirname, 'src/index.js')}`,
    output: {
      dir: `${path.resolve(__dirname, 'dist')}`,
      exports: 'named',
      format: 'cjs'
    },
    plugins
  },
  {
    input: `${path.resolve(__dirname, 'src/utils/index.js')}`,
    output: {
      dir: `${path.resolve(__dirname, 'dist/utils')}`,
      exports: 'named',
      format: 'cjs'
    },
    plugins
  },
  {
    input: `${path.resolve(
      __dirname,
      'src/polyfills/polyfill-wheel-listener.js'
    )}`,
    output: {
      dir: `${path.resolve(__dirname, 'dist/polyfills')}`,
      exports: 'named',
      format: 'cjs'
    },
    plugins
  }
]
