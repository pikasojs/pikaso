import path from 'path'
import { fileURLToPath } from 'node:url'

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import _import from 'eslint-plugin-import'
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

export default [
  ...fixupConfigRules(
    compat.extends(
      'prettier',
      'plugin:prettier/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript'
    )
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
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
      'import/resolver': {
        node: {
          'import/extensions': ['.js', '.ts', '.d.ts', '.json']
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

      'import/prefer-default-export': 'off',
      'import/extensions': 'off',

      'import/no-unresolved': [
        2,
        {
          commonjs: true,
          amd: true
        }
      ],

      'no-shadow': 'off',
      'no-underscore-dangle': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-console': 'off',
      'func-names': 'off',
      'import/named': 2,
      'import/namespace': 2,
      'import/default': 2,
      'import/export': 2,
      '@typescript-eslint/member-ordering': [2, {}],

      'import/order': [
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
]
