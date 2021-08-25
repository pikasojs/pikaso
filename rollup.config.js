import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import ignore from 'rollup-plugin-ignore'

import pkg from './package.json'

export default [
  {
    plugins: [
      ignore(['canvas']),
      nodeResolve(),
      commonjs({
        exclude: '/node_modules/'
      }),
      typescript({
        declaration: true,
        outDir: 'esm',
        declarationDir: 'esm'
      })
    ],
    input: 'src/index.all.ts',
    preserveModules: false,
    output: {
      dir: 'esm',
      format: 'esm'
    }
  },
  {
    plugins: [
      ignore(['canvas']),
      nodeResolve(),
      commonjs({
        exclude: '/node_modules/'
      }),
      typescript({
        declaration: true,
        outDir: 'lib',
        declarationDir: 'lib'
      })
    ],
    input: 'src/index.all.ts',
    output: {
      dir: 'lib',
      format: 'cjs',
      exports: 'named'
    }
  },
  {
    plugins: [
      ignore(['canvas']),
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
