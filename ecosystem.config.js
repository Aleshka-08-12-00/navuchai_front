module.exports = {
    apps : [{
      name: 'hrm',
      script: 'npm run preview',
      args: 'serve',
      interpreter: 'none',
      env: {
        PORT: 4174,
        NODE_ENV: 'development'
      }
    }]
  };
