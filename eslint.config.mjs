import path from 'path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'eslint/config'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import importX from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([
  {
    extends: fixupConfigRules(
      compat.extends('prettier', 'plugin:prettier/recommended')
    ),

    plugins: {
      'import-x': importX,
      prettier: fixupPluginRules(prettier),
      '@typescript-eslint': typescriptEslint
    },

    languageOptions: {
      globals: {
        ...globals.browser
      },

      parser: tsParser,
      ecmaVersion: 11,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {}
      }
    },

    settings: {
      'import-x/resolver': {
        node: {
          'import-x/extensions': ['.js', '.ts', '.d.ts', '.json']
        },

        typescript: {}
      }
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          printWidth: 80,
          trailingComma: 'none',
          arrowParens: 'avoid',
          endOfLine: 'auto'
        }
      ],

      'import-x/prefer-default-export': 'off',
      'import-x/extensions': 'off',

      'import-x/no-unresolved': [
        2,
        {
          commonjs: true,
          amd: true
        }
      ],

      'no-shadow': 'off',
      'no-underscore-dangle': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'no-console': 'off',
      'func-names': 'off',
      'import-x/named': 2,
      'import-x/namespace': 2,
      'import-x/default': 2,
      'import-x/export': 2,
      '@typescript-eslint/member-ordering': [2, {}],

      'import-x/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          groups: [
            'builtin',
            'external',
            'internal',
            ['sibling', 'parent'],
            'index'
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      'no-unused-vars': ['off'],
      'no-undef': ['off'],

      '@typescript-eslint/no-unused-vars': [
        2,
        {
          args: 'none'
        }
      ]
    }
  },
  {
    files: ['**/*.d.ts']
  }
])
