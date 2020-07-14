<template>
    <section class="create">

        <!-- als er minstens 1 adres is ingevuld, toon dan velden voor de ingevulde locaties -->
        <div class="route" v-if="routes[0].locations.length > 0" v-for="(route, index) in routes" :key="'route_' + index">

          <div v-if="index == 0">
            <iconType :iconString="route.type" />
          </div>
          <div v-if="routes[index-1] !== undefined">
            <iconType :iconString="route.type" />
          </div>

          <div class="address" v-for="(address, indexaddress) in route.locations" :key="'address_' + indexaddress" v-if="route.locations && route.locations.length > 0">
            <div v-if="route.names[indexaddress] !== undefined" v-html="route.names[indexaddress]" class="route_address"></div>
          </div>
        </div>

        <!-- toon adres als er nog geen routes zijn -->
        <addAddress/>

    </section>
</template>

<script>
import addAddress from '@/components/add_address'
import iconType from '@/components/type_icon'
export default {
    name: 'addresses',

    components: {
      addAddress,
      iconType
    },

    computed: {
      routes: function() {
        return this.$store.state.map.routes
      }
    }
}
</script>

<style scoped lang="scss">
.create {
  padding: 1em;
  height: 80vh;
  overflow-y: scroll;
  .route {
    border: 1px solid #dedede;
    background: #f2f2f2;
    padding: 1em;
    margin-bottom: 1em;
    -webkit-box-shadow: 0px 0px 8px 0px rgba(204,204,204,1);
    -moz-box-shadow: 0px 0px 8px 0px rgba(204,204,204,1);
    box-shadow: 0px 0px 8px 0px rgba(204,204,204,1);

    .address {
      background: white;
      margin-bottom: .3em;
      border-radius: 3px;

      .route_address {
        padding: .5em;
      }
    }
  }
}
</style>
