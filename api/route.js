import axios from 'axios'

export default {
    getRoutePolyline(locations, type){

      // create url string from locations
      let i
      let locationString = ''
      for (i = 0; i < locations.length; i++) {
        let lng = locations[i][0]
        let lat = locations[i][1]
        locationString += lng + ',' + lat

        if(i !== locations.length - 1){
          locationString += ';'
        }
      }

      return axios
      .get('http://router.project-osrm.org/route/v1/'+type+'/'+locationString+'?overview=full')
      .then(response => {
          return response.data
      });
    },
    getPublicTransitRoute(locations, type){

      // API key
      let apiKey = '6x-6ovJkdJnM4ErU1khig5jQjYuCbgT7CJU-5tU4s88'
      let apiUrl = 'https://transit.router.hereapi.com/v8/routes?apiKey='+apiKey

      // https://developer.here.com/documentation/public-transit/dev_guide/index.html
      // GET https://transit.router.hereapi.com/v8/routes?apiKey={YOUR_API_KEY}&origin=41.79457,12.25473&destination=41.90096,12.50243


      // create url string from locations
      let i
      let locationString = ''
      for (i = 0; i < locations.length; i++) {
        let lng = locations[i][0]
        let lat = locations[i][1]
        locationString += lng + ',' + lat

        if(i !== locations.length - 1){
          locationString += ';'
        }
      }

      return axios
      .get('http://router.project-osrm.org/route/v1/'+type+'/'+locationString+'?overview=full')
      .then(response => {
          return response.data
      });
    }
};
