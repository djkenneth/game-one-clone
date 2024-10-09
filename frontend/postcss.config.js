export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'tailwindcss/nesting': {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
}
