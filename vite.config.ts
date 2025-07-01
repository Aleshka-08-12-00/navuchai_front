// https://github.com/vitejs/vite/discussions/3448
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
  base: '/', // accessing env variable is not possible here. So hard coding this.
  define: {
    global: 'window'
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1')
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1')
      }
    ]
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3010,
    allowedHosts: ['navuchai.sellwin.by']
  },
  preview: {
    // this ensures that the browser opens upon preview start
    open: true,
    // this sets a default port to 3000
    port: 3010,
    allowedHosts: ['navuchai.sellwin.by']
  }
});


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import https from 'https';

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3010,
//     proxy: {
//       // '/api/evesell/': {
//       //   target: 'http://portal.sellwingroup.com',
//       //   changeOrigin: true,
//       //   configure: (proxy) => {
//       //     proxy.on('proxyRes', (proxyRes, req, res) => {
//       //       // res.setHeader('Access-Control-Allow-Origin', 'https://report.sellwin.by');
//       //     });
//       //   },
//       // },
//       '/api-t': {
//         target: 'http://172.16.0.97:8012',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api-t/, ''),
//         configure: (proxy, options) => {
//           // proxy.on('proxyReq', (proxyReq, req, res) => {
//           //   proxyReq.setHeader('Authorization', 'Basic ' + Buffer.from('webMobileService:KU7Libep').toString('base64'));
//           // });
//           proxy.on('proxyRes', (proxyRes, req, res) => {
//             // res.setHeader('Access-Control-Allow-Origin', 'https://report.sellwin.by');
//           });
//         },
//       },
//       '/img/': {
//         target: 'https://img.sellwingroup.com',
//         changeOrigin: true,
//         secure: false, // добавляем параметр secure: false
//         agent: httpsAgent,
//         rewrite: (path) => path.replace(/^\/img/, ''),
//         configure: (proxy, options) => {
//           proxy.on('error', (err, req, res) => {
//             console.error('Proxy error:', err);
//             res.writeHead(500, {
//               'Content-Type': 'text/plain',
//             });
//             res.end('Something went wrong.');
//           });
//         },
//       },
//     },
//   },
// });
