module.exports = {
  '*.{js,jsx,ts,tsx}': 'cross-env NODE_ENV=development eslint --cache',
  '**/*.{js,ts,tsx,mts,json,yaml,yml,md}': 'prettier --write',
  '*.{css,scss}': 'prettier --write',
  '*.{html,md,yml}': 'prettier --write'
};
