/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
module.exports = {
  extends: [
    // we use default rules from all the plugins we installed.
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    // Disable all rules that eslint conflict with prettier
    // put all the prettier rule below for it to override all the above rules
    'eslint-config-prettier',
    'prettier'
  ],
  plugins: ['prettier'],
  settings: {
    react: {
      // Tell eslint-plugin-react automatically detect React version.
      version: 'detect'
    },
    // Tell Eslint to handle imports
    'import/resolver': {
      node: {
        paths: [path.resolve(__dirname)],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json')
      }
    }
  },
  env: {
    node: true
  },
  rules: {
    // Turn off rule need to import React in JSX file
    'react/react-in-jsx-scope': 'off',
    // Warn when a <a target='_blank'> without putting rel="noreferrer"
    'react/jsx-no-target-blank': 'warn',
    // Enhance some prettier rule (copy từ file .prettierrc qua)
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 80,
        jsxSingleQuote: true
      }
    ]
  }
}
