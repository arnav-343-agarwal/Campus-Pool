import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

export async function getCoordinates(placeName) {
  const geoData = await geocoder.forwardGeocode({
    query: placeName,
    limit: 1
  }).send();

  const feature = geoData.body.features[0];

  if (!feature) throw new Error(`Could not geocode: ${placeName}`);

  return {
    name: placeName,
    coordinates: feature.geometry.coordinates // [lng, lat]
  };
}
