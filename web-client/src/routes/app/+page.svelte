<script>
	import { activePage } from '$lib/dashboard';
	import { onMount } from 'svelte';
	import { SportEnum, SportLabels } from '$lib/sports';
	import { LocationEnum, LocationDetails } from '$lib/locations';
	import { fetchMatches } from '$lib/matches';
	import FeedCard from '$lib/component/FeedCard.svelte';

	onMount(() => {
		activePage.set('home');
	});

	let selectedFilter = 'all';

	let isLoadingMatches = $state(true);
	let allMatches = [];

	onMount(async () => {
		activePage.set('home');

		allMatches = await fetchMatches(selectedFilter);
		isLoadingMatches = false;
	});
</script>

<div class="page-layout">
	<header class="feed-header">
		<div class="header-text">
			<h1 class="page-title">Find a Pickup Game</h1>
			<p class="page-subtitle">
				Discover and join local sports matches happening in your area today.
			</p>
		</div>
		<a href="/app/my-matches/create" class="create-hero-btn">
			<span>+</span> Host a Game
		</a>
	</header>

	<div class="filter-bar">
		<button
			class="filter-pill"
			class:active={selectedFilter === 'all'}
			on:click={() => (selectedFilter = 'all')}
		>
			All Sports
		</button>
		{#each Object.entries(SportLabels) as [id, label]}
			<button
				class="filter-pill"
				class:active={selectedFilter === id}
				on:click={() => (selectedFilter = id)}
			>
				{label}
			</button>
		{/each}
	</div>

	<main class="feed-container">
		{#if isLoadingMatches}

		{:else}
			{#if allMatches.length === 0}
				<div class="empty-state">
					<p class="empty-text">
						No upcoming matches available under this sport category right now.
					</p>
				</div>
			{:else}
				<div class="matches-grid">
					{#each allMatches as match (match.id)}
						<FeedCard match={match}></FeedCard>
					{/each}
				</div>
			{/if}
		{/if}
	</main>
</div>

<style>
	/* Base structural page layout styling matching strict margin system context */
	.page-layout {
		padding: 2rem;
		box-sizing: border-box;
		background-color: var(--bg-main);
		min-height: 100vh;
	}

	/* Header Structure layout */
	.feed-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1.5rem;
		margin-bottom: 2rem;
		border-bottom: 1px solid var(--border-color);
	}

	.page-title {
		font-size: 1.85rem;
		font-weight: 700;
		color: var(--text-dark);
		letter-spacing: -0.02em;
	}

	.page-subtitle {
		font-size: 1rem;
		color: var(--text-muted);
		margin-top: 0.25rem;
	}

	.create-hero-btn {
		background-color: var(--primary);
		color: white;
		text-decoration: none;
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: var(--transition);
		box-shadow: 0 4px 12px rgba(255, 59, 43, 0.15);
	}

	.create-hero-btn:hover {
		background-color: var(--primary-hover);
		transform: translateY(-1px);
	}

	/* Filter bar structure setup */
	.filter-bar {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 2rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
	}

	.filter-pill {
		background-color: var(--card-bg);
		color: var(--text-muted);
		border: 1px solid var(--border-color);
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-lg);
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		white-space: nowrap;
		transition: var(--transition);
	}

	.filter-pill:hover {
		border-color: var(--text-muted);
		color: var(--text-dark);
	}

	.filter-pill.active {
		background-color: var(--secondary);
		color: white;
		border-color: var(--secondary);
		box-shadow: var(--shadow);
	}

	/* Core Feed Grid Section */
	.feed-container {
		width: 100%;
	}

	.matches-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.75rem;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: var(--card-bg);
		border: 2px dashed var(--border-color);
		border-radius: var(--radius-lg);
	}

	.empty-text {
		color: var(--text-muted);
		font-size: 0.95rem;
	}
</style>
