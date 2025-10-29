export default {
  plugins: {
    // Tailwind CSS processing
    tailwindcss: {},
    
    // Autoprefixer for vendor prefixes
    autoprefixer: {},
    
    // Optional: CSS nesting support (if you want to use nested CSS)
    // 'postcss-nesting': {},
    
    // Optional: CSS minification in production
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
        }],
      },
    } : {}),
  },
};