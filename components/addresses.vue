<template>
    <section class="create" v-show="show === 'create'">

        <!-- als er minstens 1 adres is ingevuld, toon dan velden voor de ingevulde locaties -->
        <div class="route" v-if="routes[0].locations.length > 0" v-for="(route, index) in routes" :key="'route_' + index">

            Route nummer {{ routeCount }}
            <div class="address" v-for="(address, index) in route.locations" :key="'address_' + index" v-if="route.locations && route.locations.length > 0">
                <strong>{{ route.type }}</strong>
                <div v-html="route.names[index]"></div>
             </div>
        </div>

        <h2>Add an address</h2>
        <!-- zo niet, toon 1 veld om mee te starten -->
        <div class="route">
            <div class="address">
                <GmapAutocomplete @place_changed="addAddress" :value="search" />
             </div>
        </div>

        <!-- <h2>Add a route</h2>
        <button @click="addRoute()">Add</button> -->

    </section>
</template>

<script>
export default {
    name: 'addresses',

    data() {
        return {
            search: '',
            routeCount: 0
        }
    },

    computed: {
        routes: function() {
            return this.$store.state.map.routes
        },
        show: function() {
            return this.$store.state.user.show
        }
    },

    methods: {
      // addRoute(){
      //   let payload = {
      //     count: this.routeCount++,
      //     type: 'car'
      //   }
      //   this.$store.dispatch('map/addRoute', payload)
      // },
      addAddress(address) {

        // set address one in store
        let payloadAddress = {
            address: address,
            type: 'car',
            count: this.routeCount
        }
        this.$store.dispatch('map/changeAddress', payloadAddress)

        this.search = ''
      },
    }
}
</script>

<style scoped lang="scss">
.create {
    padding: 0 1em;

    .address {
        margin: 2em 0;
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
    } // end addresses
</style>
