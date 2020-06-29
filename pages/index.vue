<template>
  <no-ssr>
    <div class="middle" >

      <nav class="sidebar">
        <div class="sidebarInner">                    

          <!-- https://openlayers.org/en/latest/examples/export-map.html -->



          {{ makeUrlParamsString(urlArray) }}

          <!-- component to switch between addresses and meet here -->
          <buttons />

          <!-- component with input for addresses -->
          <addresses />

        </div>
      </nav>

      <!-- map -->
      <main role="main" id="mainMap">
             <img :src="'https://maps.googleapis.com/maps/api/staticmap?' + makeUrlParamsString(urlArray)" />
      </main>
    </div>
  </no-ssr>
</template>

<script>
import top from '@/components/top'
import buttons from '@/components/buttons'
import addresses from '@/components/addresses'

export default {

  components: {
    top,
    buttons,
    addresses
  },        

  data(){
    return {
      urlArray: [
        { center: "52.1601144,4.4970097" },
        { size: "2048x2048" },
        { scale: 1 },
        { maptype: "roadmap" },
        { key: "AIzaSyAqoY35uszevWNM62s3QQCMnmvUzXGkuh0" }
      ]
    } // end return 
  },

  computed: {
    routes: function() {
      return this.$store.state.map.routes
    },
  },


  methods: {
    makeUrlParamsString(array){
      var str = ""    
      var i
      var j

      // loop door de array met objecten
      for (i = 0; i < array.length; i++) {

        // als de string nog leeg is, voeg geen & toe
        if (str != "") {
            str += "&";
        }
        
        // krijg de keys en values van dit object in een array
        let entries = Object.entries(array[i])       

        // entries is een array met daarin array voor een key en een value
        // pak dus altijd de 0. Daarin is [0] de key en [1] de value
        str += entries[0][0] + "=" + encodeURIComponent(entries[0][1]);        
      }

      str = this.addMarkers(str);
      str = this.addPath(str);
      str = this.addVisible(str);

      return str;
    },

    addMarkers(str){
           
      var i      
      var j
      // loop door de array met routes
      for (i = 0; i < this.routes.length; i++) {
        
        // pak de locaties van deze route
        var locations = this.routes[i].locations
        var type = this.routes[i].type

        // als de string nog leeg is, voeg geen & toe
        if (str != "") {
            str += "&";
        }

        // open een nieuwe markers parameter
        str += "markers=" + encodeURIComponent("color:red|label:C|")

        // loop door de locaties en plak ze allemaal in een markers object
        for (j = 0; j < locations.length; j++) {

          // bepaal nog de stijl van de marker op basis van de type

          // voeg een | toe vanaf nummer 1
          if(j > 0){
            str += encodeURIComponent('|')
          }

          str += encodeURIComponent(locations[j]);      

        }
      }

      return str
    },

    addPath(str){
           
      var i      
      var j

      // loop door de array met routes
      for (i = 0; i < this.routes.length; i++) {
        
        // pak de locaties van deze route
        var locations = this.routes[i].locations
        var type = this.routes[i].type

        // als de string nog leeg is, voeg geen & toe
        if (str != "") {
            str += "&";
        }

        // open een nieuwe markers parameter
        str += "path=" + encodeURIComponent("color:red|weight:5|geodesic:true|")

        // loop door de locaties en plak ze allemaal in een markers object
        for (j = 0; j < locations.length; j++) {

          // bepaal nog de stijl van de marker op basis van de type

          // voeg een | toe vanaf nummer 1
          if(j > 0){
            str += encodeURIComponent('|')
          }

          str += encodeURIComponent(locations[j]);      

        }
      }

      return str
    },

    addVisible(str){
      var i      
      var j

      // loop door de array met routes
      for (i = 0; i < this.routes.length; i++) {
        
        // pak de locaties van deze route
        var locations = this.routes[i].locations
        var type = this.routes[i].type

        // als de string nog leeg is, voeg geen & toe
        if (str != "") {
            str += "&";
        }

        // open een nieuwe markers parameter
        str += "visible="

        // loop door de locaties en plak ze allemaal in een markers object
        for (j = 0; j < locations.length; j++) {

          // bepaal nog de stijl van de marker op basis van de type

          // voeg een | toe vanaf nummer 1
          if(j > 0){
            str += encodeURIComponent('+')
          }

          str += encodeURIComponent(locations[j]);      

        }
      }

      return str
    }

  },

}
</script>

<style lang="scss">
.middle {
  width: 100%;
  height: 100vh;

  #googleMap {
    width: 50%;
  }

  #mainMap {
    float: right;
    width: 50%;

    img {
      width: 100%;
      height: auto;

    }
  }

   .map {
        width: 100%;
        height:400px;
      }

  .sidebar {
    width: 50%;
    float: left;
    position: fixed;
    overflow-y: auto;
    height: 100vh;
    left: 0;
    top: 0;
    transition: .3s all ease;

    .sidebarInner {
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* IE10+/Edge */
      user-select: none; /* Standard */

      .buttons {
        width: 100%;
        display: block;
        transition: .3s all ease;

        a {
          float: left;
          padding: 2%;
          width: 50%;
          background: $dark-blue;
          color: white;
          text-transform: uppercase;
          font-size: 18px;
          text-align: center;
          margin: 0;
          opacity: .5;
          cursor: pointer;
          transition: .3s all ease;

          &.active,
          &:hover {
            opacity: 1;
          }
        }
      }
      
      .suggestions {
        margin: 0 0 2em 0;

        .error {
          padding: 0 1em;
          text-align: center;
        }

        .suggestion {
          border-top: 1px solid #dedede;
          border-bottom: 1px solid #dedede;
          padding: .5em;
          clear: both;
          transition: .3s all ease;
          cursor: pointer;

          &.active,
          &:hover {
            background: $light-green;
            padding: 0 0 1em 0;
          }

          .headerImage {
            background-size: cover;
            background-position: 50% 50%;
            height: 400px;
          }

          .info {
            padding: 1em 1em 0 1em;

            .suggestionAddress {
              color: $dark-blue;
            }

            p {
              color: $green;
            }
          }
        }
      }
    }
  } // end sidebar

  // common style
  .clear {
    clear: both;
  }
}
</style>
