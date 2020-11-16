import typescript from '@rollup/plugin-typescript'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const plugins = [nodeResolve()]

export default [
  {
    plugins: [...plugins, commonjs(), typescript()],
    input: 'src/index.ts',
    output: {
      file: 'lib/pikaso.js',
      format: 'cjs'
    }
  },
  {
    plugins: [
      ...plugins,
      typescript({
        declaration: true,
        outDir: 'es/pikaso'
      })
    ],
    input: 'src/index.ts',
    preserveModules: true,
    output: {
      dir: 'es/pikaso',
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
