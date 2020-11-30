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
    plugins: [
      ...plugins,
      typescript({
        declaration: true,
        outDir: 'lib',
        declarationDir: 'lib'
      })
    ],
    input: 'src/index.ts',
    preserveModules: false,
    output: {
      dir: 'lib',
      format: 'esm'
    }
  },
  {
    plugins: [...plugins, typescript(), terser()],
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
