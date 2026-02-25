import fs from 'fs'

import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import ignore from 'rollup-plugin-ignore'

import pkg from './package.json'

const banner = `/* Pikaso v${pkg.version} by [${
  pkg.author
}] * ${new Date().toDateString()} */`

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
      }),
      terser()
    ],
    input: 'src/index.all.ts',
    output: {
      banner,
      dir: 'esm',
      format: 'esm'
    }
  },
  {
    external: ['canvas'],
    plugins: [
      nodeResolve(),
      commonjs({
        exclude: '/node_modules/'
      }),
      typescript({
        declaration: true,
        outDir: 'lib',
        declarationDir: 'lib'
      }),
      terser()
    ],
    input: 'src/index.node.all.ts',
    output: {
      banner,
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
      freeze: false,
      sourcemap: true,
      intro: fs.readFileSync('./build/global.js', 'utf-8')
    }
  }
]
