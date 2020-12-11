import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

export default [
  {
    plugins: [
      nodeResolve(),
      commonjs({
        exclude: '/node_modules/'
      }),
      typescript({
        declaration: true,
        outDir: 'es',
        declarationDir: 'es'
      })
    ],
    input: 'src/index.ts',
    preserveModules: false,
    output: {
      dir: 'es',
      format: 'esm'
    }
  },
  {
    plugins: [
      nodeResolve(),
      commonjs({
        exclude: '/node_modules/'
      }),
      typescript({
        declaration: true,
        outDir: 'cjs',
        declarationDir: 'cjs'
      })
    ],
    input: 'src/index.cjs.ts',
    output: {
      dir: 'cjs',
      format: 'cjs'
    }
  },
  {
    plugins: [
      nodeResolve(),
      commonjs({
        exclude: '/node_modules/'
      }),
      typescript(),
      terser()
    ],
    input: 'src/index.ts',
    output: {
      name: 'Pikaso',
      file: pkg.unpkg,
      format: 'iife',
      sourcemap: false,
      freeze: false
    }
  }
]
