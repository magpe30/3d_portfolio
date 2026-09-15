module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  overrides: [{
    files: ['src/components/canvas/**/*.jsx'],
    // React Three Fiber uses Three.js properties rather than DOM attributes.
    rules: { 'react/no-unknown-property': 'off' },
  }],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
}
