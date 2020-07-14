<template>
  <section class="Add_address">
     <h2>Add an address</h2>
     <div class="route">
       <div class="route_type">
         <input type="radio" id="car" value="car" v-model="type">
         <label for="car">Car</label>
      </div>
      <div class="route_type">
        <input type="radio" id="airplane" value="airplane" v-model="type">
        <label for="airplane">Airplane</label>
      </div>
      <div class="route_type">
        <input type="radio" id="train" value="train" v-model="type">
        <label for="train">Train</label>
      </div>
       <div class="address">
         <GmapAutocomplete @place_changed="addAddressMethod" placeholder="Please type your address" ref="autocomplete"/>
        </div>
     </div>

  </section>
</template>

<script>
export default {
    name: 'addAddress',

    data() {
        return {
            type: 'car'
        }
    },

    methods: {
      addAddressMethod(address) {

        this.$refs.autocomplete.$el.value = ''

        // set address one in store
        let payloadAddress = {
            address: address,
            type: this.type
        }
        this.$store.dispatch('map/changeAddress', payloadAddress)

      },
    }
}
</script>

<style scoped lang="scss">
.route_type{
  display: inline;
}
.Add_address {
  background: #b6dbb7;
  padding: .5em;
  color: #406b42;
  border-radius: 3px;

  h2 {
    font-size: 20px;
    line-height: 23px;
    text-align: center;
    margin: 1em 0;
  }

  .address {
      margin: 0;

      p {
        line-height: 6px;
        color: $gray;
      }

      input {
      width: 100%;
      border: none;
      padding: 1em;
      background: $light-gray;
      color: $dark-blue;
      font-size: 18px;
      border: 1px solid $light-gray;
      transition: .3s all ease;
      background: white;

      &:focus {
          outline: none;
          border: 1px solid $light-gray;
      }

      &.filled {
          background: $light-green;
          color: $green;
      }
      }
  }
}
</style>
