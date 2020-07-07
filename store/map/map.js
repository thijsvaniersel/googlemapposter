// folder where I receive API data from custom endpoints
import route from '../../api/route'

// initial state
const state = {
  center: [4.4777326,51.9244201],
  routes: [
    {
      type: "car",
      locations: [],
      names: [],
      route: []
    }
  ],
}

// getters
const getters = {}

// actions
const actions = {
  changeAddress(context, payload){
      context.commit('setAddress', payload)
  }
}

// mutations
const mutations = {
  setAddress(state, payload){

    // als er geen echt adres in zit, voeg niet toe
    if(payload.address.address_components === undefined){
      return
    }

    // check de laatste route in de huidige state
    var lastRoute = state.routes[state.routes.length - 1];
    var type = payload.type
    var count = state.routes.length -1

    // add new object if type is different
    if(state.routes.length > 1 && lastRoute.type !== type){

      // krijg laatste locatie in de laatste route
      let previousLocation = lastRoute.locations.slice(-1)

      // vul de locations met de laatste uit de vorige route
      // voeg een nieuwe route toe
      state.routes.push(
        {
          type: type,
          locations: [previousLocation[0]],
          names: [],
          route: []
        }
      )

      // voeg een extra count to omdat dit nu de laatste is
      count++
    }

    // change order of lat and lng
    // https://openlayers.org/en/latest/doc/faq.html
    var lat = Number(payload.address.geometry.location.lat())
    var lng = Number(payload.address.geometry.location.lng())
    var locations = state.routes[count].locations

    // add address to the routes object
    locations.push([lng,lat])

    // alleen als de eerste locatie is gevuld, pas de center aan
    if(state.routes[0].locations.length == 1){
      state.center = [lng,lat]
    }

    // Make this to points to a route
    if(locations.length > 1){
      if(type == 'car' || type == 'bicycle' || type == 'walk'){
        route.getRoutePolyline(locations, type).then((data) => {

          // krijg de compressed geo uit de API call
          let compressedRouteGeo = data.routes[0].geometry

          // gebruik de polyline plugin om deze te decoden naar een array van punten
          let routeArrayFromOSRM = this.$polyline.decode(compressedRouteGeo)

          // draai de lat en lng om voor OSRM en zet in de route property van deze route
          state.routes[count].route = routeArrayFromOSRM.map(function(l) {
            return l.reverse();
          });
        })
      } else if(type == 'train') {
        route.getPublicTransitRoute(locations).then((data) => {

          // krijg de compressed geo uit de API call
          let compressedRouteGeo = data.routes[0].sections[1].polyline
          console.log(compressedRouteGeo);

          // state.routes[count].route = this.$polyline.decode(compressedRouteGeo)
          console.log(this.$polyline.decode(compressedRouteGeo))
        })
      } else {
        state.routes[count].route = locations
      }
    }

    // add name in different array omdat deze niet mee moet gaan in de url
    state.routes[count].names.push(payload.address.adr_address)

  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
