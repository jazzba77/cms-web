export default {
  mode: 'universal',

  server: {
    port: 5000, // default: 3000
    host: '127.0.0.1', // default: localhost
  },

  router: {
    middleware: ['auth'],
    // base: "/nuxt-ssr",
    extendRoutes(routes, resolve) {
      routes.forEach((item) => {
        switch (item.path) {
          case '/':
            item.redirect = '/content/banner'
            break
          case '/content':
            item.redirect = '/content/banner'
            break
          case '/meta':
            item.redirect = '/meta/collection'
            break
          default:
            break
        }
      })
    },
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'CMS内容管理系统',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/image/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/global.css', 'element-ui/lib/theme-chalk/index.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/js-cookie',
    { src: '@/plugins/cloudbase', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/eslint-module'],
  /*
   ** Nuxt.js modules
   */
  modules: [],

  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    // publicPath: "/nuxt-ssr/_nuxt/",
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
