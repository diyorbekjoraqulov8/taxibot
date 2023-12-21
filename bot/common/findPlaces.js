const axios = require('axios');

async function findPlaces(lat,long) {
  const coordinates = `${lat}, ${long}`; // Example: San Francisco, CA

  // Make a request to Google Maps Geocoding API
  // geocode/json
  return axios.get(`${process.env.GOOGLE_MAPS_API_URL}geocode/json`, {
    params: {
      latlng: coordinates,
      key: process.env.GOOGLE_MAPS_API_KEY,
      language: 'uz',
    },
  })
  .then(response => {
    const addressComponents = response.data.results[0].address_components;

    // Extracting relevant components
    const street = addressComponents.find(component => component.types.includes('locality')).long_name;
    const district = addressComponents.find(component => component.types.includes('administrative_area_level_2')).long_name;
    const province = addressComponents.find(component => component.types.includes('administrative_area_level_1')).long_name;
    const country = addressComponents[addressComponents.length - 1].long_name

    // // Full Address
    const fullAddress = `${street}, ${district}, ${province}, ${country}`;

    // return fullAddress
    return {
      text:fullAddress,
      latLng:coordinates
    }
  })
  .catch(error => {
    throw new Error('Error1:', error.message)
  });
}

module.exports = {
  findPlaces
}