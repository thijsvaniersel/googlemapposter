<template>
  <div>
      <no-ssr>
        <div id="route_nav">

          <button @click="exportMap">Export</button>
          {{ message }}


          <button @click="fit">FIT</button>

          <addresses />

          <!-- <div v-for="(route, index) in routes" :key="index" v-if="routes[0].route.length > 0">
            <div v-if="route.route !== undefined && route.route.length > 0">
              {{ route.route }}
            </div>
          </div> -->
        </div>

        <vl-map ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" :data-projection="'EPSG:4326'" @created="mapCreated" id="map">
          <vl-view ref="mapView" :zoom.sync="zoom" :center.sync="center"></vl-view>

          <vl-layer-tile id="osm">
            <vl-source-osm></vl-source-osm>
          </vl-layer-tile>

          <vl-layer-vector render-mode="image">
            <vl-source-vector :url="'/assets/map/style.json'"/>
          </vl-layer-vector>

          <!-- <vl-layer-tile id="bingmaps">
              <vl-source-bingmaps :api-key="apiKey" :imagery-set="imagerySet"></vl-source-bingmaps>
          </vl-layer-tile> -->

          <vl-layer-vector>
            <vl-source-vector ref="vectorSource" :projection="'EPSG:4326'">

              <vl-feature v-for="(route, index) in routes" :key="index + '_line'" v-if="routes[0].route.length > 0 && route.route !== undefined && route.route.length > 0">
                <vl-geom-line-string :coordinates="route.route"></vl-geom-line-string>
                <vl-style-box>
                  <vl-style-fill color="white"></vl-style-fill>
                  <!-- auto lijn -->
                  <vl-style-stroke
                    v-if="route.type == 'car'"
                    color="red"
                    :width="6"
                  ></vl-style-stroke>
                  <!-- vliegtuig lijn -->
                  <vl-style-stroke
                    v-if="route.type == 'airplane'"
                    color="blue"
                    :width="6"
                  ></vl-style-stroke>
                </vl-style-box>
              </vl-feature>


              <vl-feature v-for="(route, index) in routes" :key="index + '_dot'" v-if="routes[0].locations.length > 0">
                <vl-geom-multi-point :coordinates="route.locations"></vl-geom-multi-point>
                <vl-style-box>
                  <vl-style-circle :radius="10">
                    <vl-style-fill color="white"></vl-style-fill>
                    <vl-style-stroke color="red"></vl-style-stroke>
                  </vl-style-circle>
                </vl-style-box>
              </vl-feature>

            </vl-source-vector>
          </vl-layer-vector>

        </vl-map>
      </no-ssr>
  </div>
</template>

<script>

var dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148]
};

import mapStyle from '@/assets/map/style.json'
import addresses from '@/components/addresses'
export default {
  name: 'openlayers',

  components: {
      addresses
  },

  data() {
    return {
      zoom: 10,
      features: [],
      format: 'a2',
      resolution: 72,
      message: '',
      apiKey: 'AnqhLoxDaqM4GRk2qR6U641ZFGlZ68HF9OyMTH1lBYOhh6DN8ZFBYkQJk6ThVZ4g',
      imagerySet: 'CanvasLight',
      // geojsonUrl: '@/assets/map/style.json',
      features: [],
    }
  },

  computed: {
      routes() {
        return this.$store.state.map.routes
      },
      center: function() {
        return this.$store.state.map.center
      },
      style() {
        return this.$store.state.style.style
      }
  },

  created(){

  },

  methods: {
    styleFuncFactory(){
return {
        elements: {
            area: { fillColor: '#b6e591' },
            water: { fillColor: '#75cff0' },
            tollRoad: { fillColor: '#a964f4', strokeColor: '#a964f4' },
            arterialRoad: { fillColor: '#ffffff', strokeColor: '#d7dae7' },
            road: { fillColor: '#ffa35a', strokeColor: '#ff9c4f' },
            street: { fillColor: '#ffffff', strokeColor: '#ffffff' },
            transit: { fillColor: '#000000' }
        },
        settings: {
            landColor: '#efe9e1'
        }
      }
    },
    mapCreated (vm) {
      // http://router.project-osrm.org/route/v1/driving/15.458470,47.064970;15.476760,47.071100;15.458470,47.064970?overview=full

      // OSRM REQUEST -> dna decoden en doorgeven als locations aan de feature

      // console.log(this.$polyline)
      // console.log(this.$polyline.decode('_p~iF~ps|U_ulLnnqC_mqNvxq`@'))
    },
    exportMap() {

      if(process.client){

        this.fit()

        const jsPDF = require('jspdf');

        var map = this.$refs.map.$map;
        var dim = dims[this.format];
        var width = Math.round(dim[0] * this.resolution / 25.4);
        var height = Math.round(dim[1] * this.resolution / 25.4);
        var size = /** @type {module:ol/size~Size} */ (map.getSize());
        var extent = this.$refs.vectorSource.$source.getExtent();

        this.message = 'exporting...';

        map.once('rendercomplete', function(event) {
          var canvas = event.context.canvas;
          var data = canvas.toDataURL('image/jpeg');
          var pdf = new jsPDF('portait', undefined, this.format);
          pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
          pdf.save('map.pdf');
          // Reset original map size
          map.setSize(size);
          map.getView().fit(extent, {
            size: size
          });

          this.message = '';
        });

        // Set print size
        var printSize = [width, height];
        map.setSize(printSize);
        map.getView().fit(extent, {
          size: printSize
        });
      } // end if process client
    },
    fit () {

      	this.$refs.mapView.$view.fit(this.$refs.vectorSource.$source.getExtent(), {
        	size: this.$refs.map.$map.getSize(),
        	duration: 1000,
        })

    }
  }, // end mothods

  watch: {
    routes: function (newRoutes, oldRoutes) {
      console.log('changed')
      this.fit()
    }
  },
}
</script>

<style lang="scss">
  html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  #route_nav {
    position: absolute;
    top: 0;
    z-index: 2;
    background: white;
    width: 30%;
  }
  .vl-map {
    position: absolute;
    width: 841px;
    height: 1189px;
    top: 0;
    right: 0;
  }
</style>
