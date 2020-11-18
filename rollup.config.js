import typescript from '@rollup/plugin-typescript'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const plugins = [
  nodeResolve(),
  commonjs({
    exclude: '/node_modules/'
  })
]

export default [
  {
    plugins: [...plugins, typescript()],
    input: 'src/index.ts',
    output: {
      exports: 'named',
      file: 'dist/lib/pikaso.js',
      format: 'cjs'
    }
  },
  {
    plugins: [
      ...plugins,
      typescript({
        declaration: true,
        outDir: 'dist/es'
      })
    ],
    input: 'src/index.ts',
    preserveModules: false,
    output: {
      dir: 'dist/es',
      format: 'esm'
    }
  },
  {
    plugins: [
      ...plugins,
      typescript({
        sourceMap: true
      }),
      terser()
    ],
    input: 'src/index.ts',
    output: {
      name: 'Pikaso',
      file: pkg.unpkg.replace('.js', '.min.js'),
      format: 'iife',
      sourcemap: true
    }
  }
]
