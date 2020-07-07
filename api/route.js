import axios from 'axios'

const DEFAULT_PRECISION = 5;

const ENCODING_TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const DECODING_TABLE = [
    62, -1, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
];

const FORMAT_VERSION = 1;

const ABSENT = 0;
const LEVEL = 1;
const ALTITUDE = 2;
const ELEVATION = 3;
// Reserved values 4 and 5 should not be selectable
const CUSTOM1 = 6;
const CUSTOM2 = 7;

const Num = typeof BigInt !== "undefined" ? BigInt : Number;

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
    getPublicTransitRoute(locations){

      // API key
      let apiKey = '6x-6ovJkdJnM4ErU1khig5jQjYuCbgT7CJU-5tU4s88'

      // https://developer.here.com/documentation/public-transit/dev_guide/index.html
      // GET https://transit.router.hereapi.com/v8/routes?apiKey={YOUR_API_KEY}&origin=41.79457,12.25473&destination=41.90096,12.50243


      // create url string from locations
      let last = locations[locations.length -1]
      let origin = '&origin=' + locations[0][1] + ',' + locations[0][0]
      let destination = '&destination=' + last[1] + ',' + last[0]
      let apiUrl = 'https://transit.router.hereapi.com/v8/routes?apiKey='+apiKey+origin+destination+'&return=polyline'

      return axios
      .get(apiUrl)
      .then(response => {

          let data = response.data.routes[0].sections[1].polyline


          return this.decode(data)

          // return response.data
      });
    },
    decode(encoded) {
        const decoder = this.decodeUnsignedValues(encoded);
        const header = this.decodeHeader(decoder[0], decoder[1]);

        const factorDegree = 10 ** header.precision;
        const factorZ = 10 ** header.thirdDimPrecision;
        const { thirdDim } = header;

        let lastLat = 0;
        let lastLng = 0;
        let lastZ = 0;
        const res = [];

        let i = 2;
        for (;i < decoder.length;) {
            const deltaLat = this.toSigned(decoder[i]) / factorDegree;
            const deltaLng = this.toSigned(decoder[i + 1]) / factorDegree;
            lastLat += deltaLat;
            lastLng += deltaLng;

            if (thirdDim) {
                const deltaZ = this.toSigned(decoder[i + 2]) / factorZ;
                lastZ += deltaZ;
                res.push([lastLat, lastLng, lastZ]);
                i += 3;
            } else {
                res.push([lastLat, lastLng]);
                i += 2;
            }
        }

        if (i !== decoder.length) {
            throw new Error('Invalid encoding. Premature ending reached');
        }

        return {
            ...header,
            polyline: res,
        };
    },
    decodeChar(char) {
        const charCode = char.charCodeAt(0);
        return DECODING_TABLE[charCode - 45];
    },
    decodeUnsignedValues(encoded) {
        let result = Num(0);
        let shift = Num(0);
        const resList = [];

        encoded.split('').forEach((char) => {
            const value = Num(this.decodeChar(char));
            result |= (value & Num(0x1F)) << shift;
            if ((value & Num(0x20)) === Num(0)) {
                resList.push(result);
                result = Num(0);
                shift = Num(0);
            } else {
                shift += Num(5);
            }
        });

        if (shift > 0) {
            throw new Error('Invalid encoding');
        }

        return resList;
    },
    decodeHeader(version, encodedHeader) {
        if (+version.toString() !== FORMAT_VERSION) {
            throw new Error('Invalid format version');
        }
        const headerNumber = +encodedHeader.toString();
        const precision = headerNumber & 15;
        const thirdDim = (headerNumber >> 4) & 7;
        const thirdDimPrecision = (headerNumber >> 7) & 15;
        return { precision, thirdDim, thirdDimPrecision };
    },
    toSigned(val) {
        // Decode the sign from an unsigned value
        let res = val;
        if (res & Num(1)) {
            res = ~res;
        }
        res >>= Num(1);
        return +res.toString();
    }
};
