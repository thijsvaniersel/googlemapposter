const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  // Style resource config
  styleResources: {
    scss: [
      './assets/vars/*.scss',
      ]
  },

  /*
  ** Router settings to work in a subdirectory on the server
  */
  router: {
    // base: process.env.NODE_ENV !== 'production' ? '' : '/mmap/'
    base: '/poster'
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: './plugins/googleMaps', ssr: false },
    { src: './plugins/vuelayers.js', ssr: false },
    { src: './plugins/polyline.js', ssr: false }
    // { src: './plugins/ol.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    // load scss vars
    '@nuxtjs/style-resources',
    // vuelayers
    '~/shared/vueLayers',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    // vendor: [
    //   'ol',
    // ]
    // this modules are included in the "vendor" js file
    // because we use them in every page
    /*
    ** You can extend webpack config here
    */
    // extend(config, ctx) {
    //   // Run ESLint on save
    //   if (ctx.isDev && ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
  }
}
