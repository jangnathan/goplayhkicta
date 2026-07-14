<script>
	import CreatorMatchCard from '$lib/component/CreatorMatchCard.svelte';
	import JoinedMatchCard from '$lib/component/JoinedMatchCard.svelte';
	import { activePage } from '$lib/dashboard';
	import { authState } from '$lib/firebase.svelte';
	import { fetchMatches } from '$lib/matches';
	import { onMount } from 'svelte';

	// Tell your sidebar layout that "my-matches" is the active view
	activePage.set('my-matches');

	let hostingMatches = $state([]);
	let isLoadingHostingMatches = $state(true);
	let hasMoreHostingMatches = $state(false);
	let joinedMatches = $state([]);
	let isLoadingJoinedMatches = $state(true);
	let hasMoreJoinedMatches = $state(false);

	onMount(async () => {
		const fetchResult = await fetchMatches({ creatorID: authState.user?.uid, limit: 10 });
		hostingMatches = fetchResult.matches;
		isLoadingHostingMatches = false;
		hasMoreHostingMatches = fetchResult.hasMore;

		const joinedFetchResult = await fetchMatches({
			joinedPlayerID: authState.user?.uid,
			limit: 10
		});
		joinedMatches = joinedFetchResult.matches;
		isLoadingJoinedMatches = false;
		hasMoreJoinedMatches = joinedFetchResult.hasMore;
	});

	function handleDeleted(event) {
		hostingMatches = hostingMatches.filter((match) => match.id !== event.detail.id);
	}

	function handleLeft(event) {
		joinedMatches = joinedMatches.filter((match) => match.id !== event.detail.id);
	}

	async function loadMoreHostingMatches() {
		isLoadingHostingMatches = true;
		const fetchResult = await fetchMatches({
			creatorID: authState.user?.uid,
			limit: 10,
			offset: hostingMatches.length
		});
		hostingMatches = [...hostingMatches, ...fetchResult.matches];
		isLoadingHostingMatches = false;
		hasMoreHostingMatches = fetchResult.hasMore;
	}

	async function loadMoreJoinedMatches() {
		isLoadingJoinedMatches = true;
		const fetchResult = await fetchMatches({
			joinedPlayerID: authState.user?.uid,
			limit: 10,
			offset: joinedMatches.length
		});
		joinedMatches = [...joinedMatches, ...fetchResult.matches];
		isLoadingJoinedMatches = false;
		hasMoreJoinedMatches = fetchResult.hasMore;
	}
</script>

<div class="page-layout">
	<div class="control-container">
		<a href="./my-matches/create" class="create-match-button">
			<span class="icon">+</span> Create New Match
		</a>
	</div>

	<div class="schedule-sections">
		<section class="schedule-group">
			<h2 class="section-heading">Matches You're Hosting</h2>
			{#if isLoadingHostingMatches || hostingMatches.length === 0}
				<div class="empty-state">
					<p>You aren't organizing any matches right now.</p>
				</div>
			{:else}
				<div class="matches-grid">
					{#each hostingMatches as match}
						<CreatorMatchCard {match} on:deleted={handleDeleted}></CreatorMatchCard>
					{/each}
				</div>

				{#if hasMoreHostingMatches}
					<button class="load-more-button btn" onclick={loadMoreHostingMatches}>
						Load More
					</button>
				{/if}
			{/if}
		</section>
		<section class="schedule-group">
			<h2 class="section-heading">Matches You've Joined</h2>
			{#if isLoadingJoinedMatches || joinedMatches.length === 0}
				<div class="empty-state">
					<p>You haven't joined any matches yet.</p>
				</div>
			{:else}
				<div class="matches-grid">
					{#each joinedMatches as match}
						<JoinedMatchCard {match} on:left={handleLeft}></JoinedMatchCard>
					{/each}
				</div>
			{/if}

			{#if hasMoreJoinedMatches}
				<button class="load-more-button btn" onclick={loadMoreJoinedMatches}> Load More </button>
			{/if}
		</section>
	</div>
</div>

<style>
	/* Page Wrapper setup */
	.page-layout {
		padding: 2rem;
		box-sizing: border-box;
		background-color: var(--bg-main);
		min-height: 100vh;
	}

	/* Control Header Area */
	.control-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.page-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-dark);
	}

	.page-subtitle {
		font-size: 0.95rem;
		color: var(--text-muted);
		margin-top: 0.25rem;
	}

	.create-match-button {
		background-color: var(--primary);
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: var(--transition);
	}

	.create-match-button:hover {
		background-color: var(--primary-hover);
	}

	/* Section Splitting */
	.schedule-sections {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.section-heading {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-dark);
		margin-bottom: 1rem;
	}

	.matches-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
		align-items: start;
		max-width: calc(3 * 300px + 2 * 1.5rem); /* 3 columns + gaps */
		width: 100%;
		box-sizing: border-box;
	}

	.btn {
		background-color: var(--secondary);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		cursor: pointer;
		transition: var(--transition);
		margin-top: 1rem;
	}

	.empty-state {
		padding: 2rem;
		color: var(--text-muted);
		background: var(--card-bg);
		border: 1px dashed var(--border-color);
		border-radius: var(--radius-lg);
		font-size: 0.95rem;
	}
</style>
