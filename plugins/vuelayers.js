import Vue from 'vue'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader

Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326'
})

// export default (context, inject) => {
//   // Inject $hello(msg) in Vue, context and store.
//   inject('ol', VueLayers)
//   // For Nuxt <= 2.12, also add 👇
//   context.$ol = VueLayers
//
//
//   // Inject $hello(msg) in Vue, context and store.
//   inject('olproj', proj)
//   // For Nuxt <= 2.12, also add 👇
//   context.$olproj = proj
// }
