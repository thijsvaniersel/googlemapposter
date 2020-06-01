// initial state
const state = {
  routes: [
    {
      type: "car",
      locations: [],
      names: []
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

    console.log(payload)

    // als er geen echt adres in zit, voeg niet toe
    if(payload.address.address_components === undefined){
      return
    }

    // add address to the routes object
    state.routes[0].locations.push(payload.address.geometry.location.lat() + ',' + payload.address.geometry.location.lng())

    // add name in different array omdat deze niet mee moet gaan in de url
    state.routes[0].names.push(payload.address.adr_address)

  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
