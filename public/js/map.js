
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
	center: coordinates, // starting position [lng, lat]
	zoom: 9, // starting zoom
	
});

const marker1 = new mapboxgl.Marker({color: "red"})
        .setLngLat(coordinates)
        .addTo(map);