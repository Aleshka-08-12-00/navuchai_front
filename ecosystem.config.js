module.exports = {
    apps : [{
      name: 'navuchai',
      script: 'npm run preview -- -- host',
      args: 'serve',
      interpreter: 'none',
      env: {
        PORT: 3010,
        NODE_ENV: 'development'
      }
    }]
  };
