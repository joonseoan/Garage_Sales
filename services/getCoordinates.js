// const { googleGeoKey } = require('../config/keys');

// // const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleGeoKey}&`;
// // // const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleGeoKey}&address=${encodedAddress}`;

// module.exports = (address) => {

//     axios.create({
//         baseURL: `https://maps.googleapis.com/maps/api/geocode/json?key=${googleGeoKey}&address=` 
//     })
//     .then(res => {
        
//         if(res.data.status === 'ZERO_RESULTS') throw new Error('Invalid Address');

//         return body.results[0].geometry.location;

//     })
//     .catch(e => {
//         throw new Error(e || 'Unable to finish having geocode data.');
//     })

// }