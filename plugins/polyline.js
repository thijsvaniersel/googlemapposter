import Vue from 'vue'
import Polyline from '@mapbox/polyline'

export default (context, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('polyline', Polyline)
  // For Nuxt <= 2.12, also add 👇
  context.$polyline = Polyline
}
