<script>
	import { activePage } from '$lib/dashboard';
	import { onMount } from 'svelte';
	import { SportEnum, SportLabels } from '$lib/sports';
	import { LocationEnum, LocationDetails } from '$lib/locations';
	import { fetchMatches } from '$lib/matches';

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
						{@const venue = LocationDetails[match.locationID]}
						<div class="match-card">
							<span class="sport-tag">{SportLabels[match.sport]}</span>

							<h3 class="match-title">{match.title}</h3>
							<p class="match-location">📍 {venue?.name || 'Unknown Location'}</p>

							<div class="creator-attribution">
								<div class="avatar-placeholder"></div>
								<span class="creator-name">Organized by {match.creatorID}</span>
							</div>

							<div class="match-footer">
								<div class="spots-indicator">
									<span class="spots-text"
										>👥 {match.spotsFilled} / {match.spotsTotal} Spots filled</span
									>
									<div class="progress-bar-bg">
										<div
											class="progress-bar-fill"
											style="width: {(match.spotsFilled / match.spotsTotal) * 100}%"
										></div>
									</div>
								</div>
								<button class="join-button" disabled={match.spotsFilled >= match.spotsTotal}>
									{match.spotsFilled >= match.spotsTotal ? 'Full' : 'Join Game'}
								</button>
							</div>
						</div>
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

	/* Match Card Architecture */
	.match-card {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow);
		display: flex;
		flex-direction: column;
		transition: var(--transition);
	}

	.match-card:hover {
		transform: translateY(-4px);
	}

	.sport-tag {
		align-self: flex-start;
		font-size: 0.7rem;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--primary);
		background-color: #fff5f2;
		border: 1px solid #ffe4de;
		padding: 0.25rem 0.6rem;
		border-radius: var(--radius-md);
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
	}

	.match-title {
		font-size: 1.25rem;
		color: var(--text-dark);
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.match-location {
		color: var(--text-muted);
		font-size: 0.95rem;
		margin-bottom: 1.25rem;
	}

	/* Creator info block inside feed cards */
	.creator-attribution {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		background-color: var(--bg-main);
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-md);
	}

	.avatar-placeholder {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background-color: var(--secondary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: bold;
	}

	.creator-name {
		font-size: 0.85rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	/* Card footer and custom spots progress metric logic styling */
	.match-footer {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-top: 1px solid var(--border-color);
		padding-top: 1.25rem;
	}

	.spots-indicator {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.spots-text {
		font-size: 0.85rem;
		color: var(--text-dark);
		font-weight: 600;
	}

	.progress-bar-bg {
		background-color: var(--border-color);
		height: 6px;
		border-radius: var(--radius-lg);
		width: 100%;
		overflow: hidden;
	}

	.progress-bar-fill {
		background-color: var(--primary);
		height: 100%;
		border-radius: var(--radius-lg);
		transition: width 0.3s ease-out;
	}

	.join-button {
		background-color: transparent;
		color: var(--primary);
		border: 1px solid var(--primary);
		padding: 0.6rem 1rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		cursor: pointer;
		width: 100%;
		text-align: center;
		transition: var(--transition);
	}

	.join-button:hover:not(:disabled) {
		background-color: var(--primary);
		color: white;
	}

	.join-button:disabled {
		background-color: var(--border-color);
		border-color: var(--border-color);
		color: var(--text-muted);
		cursor: not-allowed;
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
