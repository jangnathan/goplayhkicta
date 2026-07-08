<script>
	import { activePage } from '$lib/dashboard';
	import { onMount } from 'svelte';

	onMount(() => {
		activePage.set('home');
	});
</script>

<h1>Dashboard</h1>

<div class="feed-section">
	<div class="placeholder-card">
		<h3>Discovery</h3>
	</div>
</div>
