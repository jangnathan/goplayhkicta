<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Map from '$lib/component/Map.svelte';
	import ProfilePic from '$lib/component/ProfilePic.svelte';
	import { db } from '$lib/firebase.svelte';
	import { getDoc, doc as getDocRef } from 'firebase/firestore';
	import { fetchUserProfile } from '$lib/profile.js';
	import { fetchMatchById, formatMatchDate } from '$lib/matches.js';

	let match = null;
	let loading = $state(true);
	let error = null;
	let players = [];

	let creatorProfile = null;

	let matchId = $page.params.id;

	if (!matchId) {
		error = 'No match ID provided in the URL.';
		loading = false;
		goto('/app/');
	}

	onMount(async () => {
		try {
			match = await fetchMatchById(matchId);

			// load player profiles for display names / avatars
			if (match?.joinedPlayers?.length) {
				const docs = await Promise.all(
					match.joinedPlayers.map(async (uid) => {
						try {
							const ref = getDocRef(db, 'users', uid);
							const snap = await getDoc(ref);
							if (snap.exists()) return { uid: snap.id, ...snap.data() };
							return { uid, displayName: uid, photoURL: '' };
						} catch (e) {
							return { uid, displayName: uid, photoURL: '' };
						}
					})
				);
				players = docs;
			}

			// load creator profile
			if (match?.creatorID) {
				creatorProfile = await fetchUserProfile(match.creatorID);
			}
		} catch (e) {
			console.error('Failed fetching match', e);
			error = e.message || String(e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{match ? `${match.title} — Match` : 'Match'}</title>
</svelte:head>

{#if loading}
	<p>Loading match…</p>
{:else if error}
	<p class="error">Error: {error}</p>
{:else}
	<div class="match-page">
		<div class="card">
			<div class="header">
				<h1>{match.title}</h1>
				<div class="meta">
					<span><strong>Sport:</strong> {match.sport}</span>
					<span><strong>Created:</strong> {formatMatchDate(match.createdAt)}</span>
					<span
						><strong>Creator:</strong>
						<ProfilePic
							uid={match.creatorID}
							displayName={creatorProfile?.displayName || match.creatorID}
							photoURL={creatorProfile?.photoURL}
							size={24}
						></ProfilePic>
						<a href={'/profile/' + match.creatorID}
							>{creatorProfile?.displayName || match.creatorID}</a
						></span
					>
				</div>
			</div>

			<div class="content-grid">
				<div class="map-col">
					<div class="map-wrapper">
						<Map height="360px" locationID={match.locationID} />
					</div>
				</div>

				<div class="info-col">
					<div class="description">
						<h3>Description</h3>
						<p>{match.description || 'No description provided.'}</p>
					</div>

					<div class="spots">
						<strong>Spots:</strong>
						{match.joinedPlayers?.length ?? 0}/{match.spotsTotal ?? 'N/A'}
					</div>

					<div class="players">
						<h3>Joined Players ({players?.length ?? 0})</h3>
						{#if players && players.length > 0}
							<div class="players-list">
								{#each players as p}
									<a class="player-item" href={'/profile/' + p.uid}>
										<ProfilePic
											uid={p.uid}
											displayName={p.displayName}
											photoURL={p.photoURL}
											size={40}
										/>
										<div class="player-meta">
											<div class="player-name">{p.displayName || p.uid}</div>
										</div>
									</a>
								{/each}
							</div>
						{:else}
							<p>No players have joined yet.</p>
						{/if}
					</div>

					<div class="footer">
						<button
							class="copy-link-button btn"
							onclick={() => navigator.clipboard.writeText(window.location.href)}
						>
							<i class="ri-link"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.match-page {
		max-width: 1000px;
		width: 100%;
		padding: 0 1rem;
	}

	.card {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		box-shadow: var(--shadow);
		color: var(--text-dark);

		width: 100%;
		max-width: 1000px;
	}

	.header {
		margin-bottom: 0.75rem;
	}

	.header h1 {
		margin: 0 0 0.35rem 0;
		font-size: 1.5rem;
	}

	.meta {
		display: flex;
		gap: 0.75rem;
		color: var(--text-muted);
		flex-wrap: wrap;
		font-size: 0.95rem;
	}

	.content-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr 320px;
		align-items: start;
	}

	.map-wrapper {
		border-radius: 10px;
		overflow: hidden;
		height: 100%;
		background: #f2f6f8;
	}

	.description {
		margin-bottom: 1rem;
		color: var(--text-muted);
		white-space: pre-wrap;
	}

	.spots {
		margin-bottom: 1rem;
		color: var(--text-muted);
	}

	.players ul {
		list-style: none;
		padding: 0;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.players li {
		background: var(--bg-main);
		padding: 0.4rem 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
	}

	.players-list {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.player-item {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.45rem;
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		transition:
			background var(--transition),
			transform var(--transition);
	}

	.player-item:hover {
		background: #fbfbfc;
		transform: translateY(-2px);
	}

	.player-meta {
		display: flex;
		flex-direction: column;
	}
	.player-name {
		font-weight: 600;
	}
	.player-uid {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	a {
		color: var(--primary);
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}

	.error {
		color: #b00020;
	}

	@media (max-width: 780px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
		.map-wrapper {
			height: 220px;
		}
	}

	.footer {
		margin-top: 2rem;
		display: flex;
		justify-content: flex-end;
	}
	.copy-link-button {
		background: var(--bg-main);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		transition: var(--transition);
	}
</style>
