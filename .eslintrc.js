module.exports = {
  extends: ['erb', 'prettier'],
  rules: {
    'import/no-unresolved': 2,

    'import/no-cycle': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'typescript-eslint/no-shadow': 0,
    'react/react-in-jsx-scope': 0,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
