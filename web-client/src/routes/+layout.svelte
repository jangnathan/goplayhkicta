<script>
	import { onMount } from 'svelte';
	import 'remixicon/fonts/remixicon.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		try {
			const stored = localStorage.getItem('theme');
			if (stored === 'dark') {
				document.documentElement.classList.add('dark');
			} else if (stored === 'light') {
				document.documentElement.classList.remove('dark');
			} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				document.documentElement.classList.add('dark');
			}
		} catch (e) {
			// ignore (SSR safety)
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
