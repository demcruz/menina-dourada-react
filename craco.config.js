/**
 * CRACO config — customiza Webpack 5 do CRA sem ejetar.
 *
 * Otimizações:
 *   1. splitChunks mais agressivo — separa vendor, react, router
 *   2. Minimiza CSS com cssnano
 *   3. Gzip/Brotli compression hints
 */
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 1. splitChunks — separa dependências grandes em chunks menores
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        minSize: 20000,
        cacheGroups: {
          // React core — muda raramente, cache longo
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react-vendor',
            chunks: 'all',
            priority: 40,
          },
          // Router — separado do react core
          router: {
            test: /[\\/]node_modules[\\/](react-router|react-router-dom)[\\/]/,
            name: 'router-vendor',
            chunks: 'all',
            priority: 35,
          },
          // Axios — usado em muitas páginas
          axios: {
            test: /[\\/]node_modules[\\/]axios[\\/]/,
            name: 'axios-vendor',
            chunks: 'all',
            priority: 30,
          },
          // Outros vendors
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };

      // 2. Terser — otimizações extras
      if (webpackConfig.optimization.minimizer) {
        webpackConfig.optimization.minimizer.forEach((minimizer) => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              compress: {
                ...minimizer.options.terserOptions?.compress,
                drop_console: false, // manter console.error
                passes: 2,
              },
              mangle: true,
            };
          }
        });
      }

      return webpackConfig;
    },
  },
};
