module.exports = {
    extends: [
      'react-app',
      'plugin:react-hooks/recommended',
    ],
    plugins: ['react-hooks'],
    rules: {
      'react-hooks/exhaustive-deps': 'warn', // Treat warnings as 'warn' instead of 'error'
    },
  };
  