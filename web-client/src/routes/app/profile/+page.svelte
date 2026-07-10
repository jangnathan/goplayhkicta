<script>
	import { onMount } from 'svelte';
	import { activePage } from '$lib/dashboard';

	onMount(() => {
		activePage.set('profile');
	});
</script>
