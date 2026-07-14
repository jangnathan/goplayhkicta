<script>
	import { LocationDetails } from '$lib/locations';
	import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let { height, locationID } = $props();

import { onMount, onDestroy } from 'svelte';

let map;
let mapDiv;

$effect(() => {
	if (mapDiv) mapDiv.style.height = height || '200px';
});

onMount(() => {
	if (locationID && mapDiv) {
		const details = LocationDetails[locationID];

		// initialize the map using the bound element instead of a fixed id
		map = L.map(mapDiv).setView([22.29 - (22.29 - details.lat) * 0.8, 114.1 - (114.1 - details.lng) * 0.8], 12);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		L.marker([details.lat, details.lng]).addTo(map);
	}
});

onDestroy(() => {
	if (map) {
		map.remove();
		map = null;
	}
});
</script>

<div bind:this={mapDiv}></div>
