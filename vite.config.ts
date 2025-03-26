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
    port: 3000
  },
  preview: {
    // this ensures that the browser opens upon preview start
    open: true,
    // this sets a default port to 3000
    port: 3000
  }
});


  // plugins: [react()],
  // server: {
  //   port:4173,
  //   proxy: {
  //     '/api/evesell/': {
  //       target: 'http://portal.sellwingroup.com',
  //       changeOrigin: true,
  //       configure: (proxy) => {
  //         proxy.on('proxyRes', (proxyRes, req, res) => {
  //          // res.setHeader('Access-Control-Allow-Origin', 'https://report.sellwin.by');
  //         });
  //       }
  //     },
  //     '/api-t': {
  //       target: 'http://trade.sellwin.by',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api-t/, ''),
  //       configure: (proxy, options) => {
  //         proxy.on('proxyReq', (proxyReq, req, res) => {
  //           proxyReq.setHeader('Authorization', 'Basic ' + Buffer.from('webMobileService:KU7Libep').toString('base64'));
  //         });
  //         proxy.on('proxyRes', (proxyRes, req, res) => {
  //          // res.setHeader('Access-Control-Allow-Origin', 'https://report.sellwin.by');
  //         });
  //       }
  //     } 
  //   },
  // },




// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import jsconfigPaths from 'vite-jsconfig-paths';
// // import path from 'path';

// export default defineConfig({
//   plugins: [react(), jsconfigPaths()],
//   // https://github.com/jpuri/react-draft-wysiwyg/issues/1317
//   // base: '/', // accessing env variable is not possible here. So hard coding this.
//   // define: {
//   //   global: 'window'
//   // },
//   // resolve: {
//   //   alias: [
//   //     {
//   //       find: /^~(.+)/,
//   //       replacement: path.join(process.cwd(), 'node_modules/$1')
//   //     },
//   //     {
//   //       find: /^src(.+)/,
//   //       replacement: path.join(process.cwd(), 'src/$1')
//   //     }
//   //   ]
//   // },
//   // plugins: [react()],
//   server: {
//     port:4174,
//     proxy: {
//      '/server': {
//         target: 'http://api-hrm.sellwin.by',
//         rewrite: (path) => path.replace(/^\/server/, ''),
//         changeOrigin: true,
//         configure: (proxy) => {
//           proxy.on('proxyRes', (proxyRes, req, res) => {
//           //  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4174');
//           });
//         }
//       }
       
      
//       // '/api-t': {
//       //   target: 'http://trade.sellwin.by',
//       //   changeOrigin: true,
//       //   rewrite: (path) => path.replace(/^\/api-t/, ''),
//       //   configure: (proxy, options) => {
//       //     proxy.on('proxyReq', (proxyReq, req, res) => {
//       //       proxyReq.setHeader('Authorization', 'Basic ' + Buffer.from('webMobileService:KU7Libep').toString('base64'));
//       //     });
//       //     proxy.on('proxyRes', (proxyRes, req, res) => {
//       //      // res.setHeader('Access-Control-Allow-Origin', 'https://report.sellwin.by');
//       //     });
//       //   }
//       // } 
//     },
//   },
//   // preview: {
//   //   // this ensures that the browser opens upon preview start
//   //   open: true,
//   //   // this sets a default port to 3000
//   //   port: 3000
//   // }
// })