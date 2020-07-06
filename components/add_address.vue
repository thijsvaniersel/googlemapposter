<template>
  <section class="Add_address">
     <h2>Add an address</h2>
     {{ search }}
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
         <GmapAutocomplete @place_changed="addAddressMethod" :value="search" />
        </div>
     </div>

  </section>
</template>

<script>
export default {
    name: 'addAddress',

    data() {
        return {
            search: '',
            type: 'car'
        }
    },

    methods: {
      addAddressMethod(address) {

console.log(this.search)

        this.search = ''

        console.log(this.search)
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
.address {
    margin: 0;
    border-bottom: 1px solid #dedede;
    padding-bottom: 2em;

    h2 {
        font-size: 16px;
        line-height: 23px;
    }

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

    &:focus {
        outline: none;
        background: none;
        border: 1px solid $light-gray;
    }

    &.filled {
        background: $light-green;
        color: $green;
    }
    }
}
</style>
