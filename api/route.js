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
    }
};
