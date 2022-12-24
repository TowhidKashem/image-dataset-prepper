module.exports = {
  extends: ['erb', 'prettier'],
  rules: {
    'import/no-unresolved': 2,

    // disable rules
    'no-console': 0,
    'no-param-reassign': 0,
    'global-require': 0,
    'consistent-return': 0,
    'promise/always-return': 0,

    'import/no-cycle': 0,
    'import/order': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,

    'react/react-in-jsx-scope': 0,
    'react/jsx-props-no-spreading': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/require-default-props': 0,

    'typescript-eslint/no-shadow': 0,
    'typescript-eslint/no-explicit-any': 0,

    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    '@typescript-eslint/no-shadow': 0,

    'jest/no-deprecated-functions': 0
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true
  },
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts')
      },
      typescript: {}
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  },
  ignorePatterns: ['.eslintrc.js']
};
