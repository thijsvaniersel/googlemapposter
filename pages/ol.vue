<template>
  <div>
      <client-only>
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

        <vl-map ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" :data-projection="'EPSG:4326'" @created="onMapCreated" id="map">
          <vl-view ref="mapView" :zoom.sync="zoom" :center.sync="center"></vl-view>

          <vl-layer-tile id="osm">
            <vl-source-osm></vl-source-osm>
          </vl-layer-tile>

          <!--
            https://studio.mapbox.com/styles/thijsvaniersel/ckca4nrcp1uwc1jo0m2mf90k3/
            bij share, kies voor share. Dan developer resources->third party en select fulcrum as type
          -->
          <vl-layer-tile>
            <vl-source-xyz
              cross-origin="Anonymous"
              url="https://api.mapbox.com/styles/v1/thijsvaniersel/ckca4nrcp1uwc1jo0m2mf90k3/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidGhpanN2YW5pZXJzZWwiLCJhIjoiY2tjOWR6ejloMWttYTJ2bG0wOWF2ZGlkZyJ9.aBDTsgvAz7ufZX5TnHrPOA"
            >
            </vl-source-xyz>
          </vl-layer-tile>

          <!-- <vl-layer-vector render-mode="image">
            <vl-source-vector :url="'/assets/map/style.json'"/>
            <vl-source-vector :url="'https://api.mapbox.com/styles/v1/thijsvaniersel/ckca4nrcp1uwc1jo0m2mf90k3/wmts?access_token=pk.eyJ1IjoidGhpanN2YW5pZXJzZWwiLCJhIjoiY2tjOWR6ejloMWttYTJ2bG0wOWF2ZGlkZyJ9.aBDTsgvAz7ufZX5TnHrPOA'"></vl-source-vector>
          </vl-layer-vector> -->

          <!-- <vl-layer-tile id="bingmaps">
              <vl-source-bingmaps :api-key="apiKey" :imagery-set="imagerySet"></vl-source-bingmaps>
          </vl-layer-tile> -->

          <!-- routes in lijnen -->
          <vl-layer-vector>
            <vl-source-vector ref="vectorSource" :projection="'EPSG:4326'">

              <vl-feature v-for="(route, index) in routes" :key="index + '_line'" v-if="routes[0].route.length > 0 && route.route !== undefined && route.route.length > 0">
                <!-- <vl-geom-multi-point :coordinates="route.locations"></vl-geom-multi-point> -->
                <vl-geom-line-string :coordinates="route.route"></vl-geom-line-string>
                <vl-style-box>
                  <vl-style-fill color="white"></vl-style-fill>
                  <!-- vliegtuig lijn -->
                  <vl-style-stroke
                    v-if="route.type == 'airplane'"
                    color="#cfaaa9"
                    :width="strokeWidth"
                    :line-dash="[8, 8]"
                  ></vl-style-stroke>
                  <!-- auto lijn -->
                  <vl-style-stroke
                    v-if="route.type == 'car'"
                    color="#cfaaa9"
                    :width="strokeWidth"
                  ></vl-style-stroke>
                  <!-- trein lijn -->
                  <vl-style-stroke
                    v-if="route.type == 'train'"
                    color="#cfaaa9"
                    :width="strokeWidth"
                    :line-dash="[3, 5, 30, 5]"
                  ></vl-style-stroke>
                </vl-style-box>
              </vl-feature>
            </vl-source-vector>
          </vl-layer-vector>

          <!-- Stippen per locatie -->
          <vl-layer-vector v-for="(route, routeIndex) in routes" :key="routeIndex + '_dot'" v-if="routes[0].locations.length > 0">
            <vl-source-vector :projection="'EPSG:4326'">

              <vl-feature v-for="(location, locIndex) in route.locations" :key="routeIndex + ' ' + locIndex + '_loc'">
                <vl-geom-point :coordinates="location"></vl-geom-point>

                  <vl-style-box>
                    <!-- <vl-style-icon v-if="route.type == 'train'" src="/map/train.svg" :scale="0.05"></vl-style-icon>
                    <vl-style-icon v-if="route.type == 'car'" src="/map/car.svg" :scale="0.05"></vl-style-icon>
                    <vl-style-icon v-if="route.type == 'plane'" src="/map/plane.svg" :scale="0.05"></vl-style-icon> -->
                    <vl-style-text :text="routeIndex == 0 ? route.names[locIndex] : route.names[locIndex - 1]" font="14px arial" :offsetX="20" textAlign="left" textBaseline="middle" :scale="1.3">
                      <vl-style-fill color="#a06d6d"></vl-style-fill>
                    </vl-style-text>
                    <vl-style-circle :radius="10">
                      <vl-style-fill color="#cfaaa9"></vl-style-fill>
                      <vl-style-stroke color="#a06d6d"></vl-style-stroke>
                    </vl-style-circle>
                  </vl-style-box>

              </vl-feature> -->

            </vl-source-vector>
          </vl-layer-vector>

        </vl-map>
      </client-only>
  </div>
</template>

<script>

var dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [420, 594],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148]
};

// import mapStyle from '@/assets/map/style.json'
import addresses from '@/components/addresses'
export default {
  name: 'openlayers',

  components: {
      addresses
  },

  data() {
    return {
      strokeWidth: 10,
      zoom: 10,
      features: [],
      format: 'a2',
      resolution: 300,
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
      center: {
        get(){
          return this.$store.state.map.center
        },
        set(newName){
          return newName
        }
      },
      style() {
        return this.$store.state.style.style
      }
  },

  mounted(){
    // this.$store.dispatch('map/setTestContent')
  },

  methods: {
    onMapCreated () {

      // var layer = new VectorTileLayer({
      //   renderMode: 'vector',
      //   source: new VectorTileSource({
      //     format: new MVT(),
      //     url: 'http://localhost:8080/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=myvic:suburb_cultural_diversity&STYLE=&TILEMATRIX=EPSG:900913:{z}&TILEMATRIXSET=EPSG:900913&FORMAT=application/x-protobuf;type=mapbox-vector&TILECOL={x}&TILEROW={y}',
      //   }),
      // })
      //
      // let map = this.$refs.map.$map
      // fetch('https://api.mapbox.com/styles/v1/thijsvaniersel/ckca4nrcp1uwc1jo0m2mf90k3/wmts?access_token=pk.eyJ1IjoidGhpanN2YW5pZXJzZWwiLCJhIjoiY2tjOWR6ejloMWttYTJ2bG0wOWF2ZGlkZyJ9.aBDTsgvAz7ufZX5TnHrPOA').then(function (response) {
      //   response.json().then(function (glStyle) {
      //     applyStyle(layer, glStyle, 'suburb_culture_diversity').then(function () {
      //       map.addLayer(layer)
      //     })
      //   })
      // })
    },
    exportMap() {

      if(process.client){

        // this.fit()

        const jsPDF = require('jspdf');

        var map = this.$refs.map.$map;
              var dim = dims[this.format];
              var width = Math.round(dim[0] * this.resolution / 25.4);
              var height = Math.round(dim[1] * this.resolution / 25.4);
              // map.getView().setCenter(this.center)
              var size = map.getSize();
              var extent = map.getView().calculateExtent(size);
              this.message = 'exporting...';

              map.once('postcompose', function(event) {
                var canvas = event.context.canvas;
                var data = canvas.toDataURL('image/jpeg');


                var pdf = new jsPDF('portrait', 'mm', this.format);

                // vind de breedte en hoogte van het document
                var pdfwidth = pdf.internal.pageSize.getWidth();
                var pdfheight = pdf.internal.pageSize.getHeight();

                //voeg een image in met deze dimenties
                pdf.addImage(data, 'JPEG', 0, 0, pdfwidth, pdfheight);
                // pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);

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
    // position: absolute;
    width: 841px;
    height: 1189px;
    right:0;
    // top: 0;
    // right: 0;
    // width: 100%;
    // height: 100%;
    position: absolute;
  }
</style>
