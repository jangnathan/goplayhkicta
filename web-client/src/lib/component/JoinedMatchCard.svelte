<script>
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import { LocationDetails } from '$lib/locations';
	import { SportLabels } from '$lib/sports';
	import { authState } from '$lib/firebase.svelte.js';
	import { leaveMatch, formatMatchDate } from '$lib/matches';
	import ProfilePic from './ProfilePic.svelte';

	const dispatch = createEventDispatcher();
	let { match } = $props();
	let leaveError = '';
	let leaving = false;
	let organizerName = 'Organizer';
	let organizerPhotoURL = undefined;
	let finishedLoadingOrganizer = $state(false);

	const matchDate = formatMatchDate(match.date || match.createdAt);

	let alreadyJoined = $state(false);
	$effect(() => {
		alreadyJoined =
			authState.user && Array.isArray(match.joinedPlayers)
				? match.joinedPlayers.includes(authState.user.uid)
				: false;
	});

	async function loadOrganizer() {
		try {
			const { db } = await import('$lib/firebase.svelte.js');
			const { doc, getDoc } = await import('firebase/firestore');
			const userRef = doc(db, 'users', match.creatorID);
			const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				organizerName = userSnap.data().displayName || 'Organizer';
				organizerPhotoURL = userSnap.data().photoURL;
			}
		} catch (err) {
			console.error('Error loading match organizer', err);
		} finally {
			finishedLoadingOrganizer = true;
		}
	}

	loadOrganizer();

	async function handleLeave() {
		leaveError = '';
		leaving = true;

		try {
			await leaveMatch(match.id, authState.user?.uid);
			dispatch('left', { id: match.id });
		} catch (err) {
			leaveError = err?.message || 'Unable to leave the match.';
		} finally {
			leaving = false;
		}
	}

	function handleView() {
		goto(`/app/matches/${match.id}`);
	}

	function getMemberSnapshot() {
		const members = Array.isArray(match.joinedPlayers) ? [...match.joinedPlayers] : [];
		const currentUid = authState.user?.uid;
		if (currentUid) {
			const index = members.indexOf(currentUid);
			if (index !== -1) {
				members.splice(index, 1);
				members.unshift(currentUid);
			}
		}
		return members.slice(0, 3);
	}
</script>

<div class="joined-card">
	<div class="card-header">
		<span class="sport-tag">{SportLabels[match.sport]}</span>
		<div class="organizer-row">
			{#if finishedLoadingOrganizer}
				<ProfilePic
					uid={match.creatorID}
					displayName={organizerName}
					photoURL={organizerPhotoURL}
					size={34}
				/>

				<div class="organizer-meta">
					<span class="organizer-label">Organized by</span>
					<span class="organizer-name">{organizerName}</span>
				</div>
			{/if}
		</div>
	</div>

	<h3 class="match-title">{match.title || 'Untitled Match'}</h3>
	<p class="match-info">{LocationDetails[match.locationID]?.name || 'Unknown location'}</p>
	<p class="match-info"><i class="ri-calendar-line"></i> {matchDate}</p>

	<div class="member-stack">
		{#each getMemberSnapshot() as memberUid, index}
			<div
				class="member-avatar"
				style="z-index: {10 - index}; margin-left: {index === 0 ? '0' : '-10px'};"
			>
				<ProfilePic uid={memberUid} displayName={memberUid} photoURL={undefined} size={34} />
			</div>
		{/each}
		<span class="member-count">{match.joinedPlayers.length} joined</span>
	</div>

	<div class="button-row">
		<button type="button" class="view-button" on:click={handleView}> View match </button>
		<button type="button" class="leave-button" disabled={leaving} on:click={handleLeave}>
			{leaving ? 'Leaving…' : 'Leave'}
		</button>
	</div>

	{#if leaveError}
		<p class="error-message">{leaveError}</p>
	{/if}
</div>

<style>
	.joined-card {
		width: 100%;
		box-sizing: border-box;
		max-width: 400px;
		align-self: start;
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transition: var(--transition);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.sport-tag {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		color: var(--primary);
		background: var(--card-bg);
		padding: 0.35rem 0.75rem;
		border-radius: 9999px;
		border: 1px solid rgba(59, 130, 246, 0.15);
	}

	.organizer-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.organizer-meta {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.organizer-label {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.organizer-name {
		font-size: 0.95rem;
		font-weight: 700;
	}

	.match-title {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		color: var(--text-dark);
	}

	.match-info {
		font-size: 0.95rem;
		color: var(--text-muted);
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.member-stack {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.member-avatar {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid var(--card-bg);
		box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.05);
	}

	.member-count {
		color: var(--text-muted);
		font-weight: 600;
		margin-left: 0.5rem;
	}

	.button-row {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.view-button,
	.leave-button {
		flex: 1;
		border: none;
		border-radius: var(--radius-md);
		padding: 0.85rem 1rem;
		font-size: 0.95rem;
		font-weight: 700;
		cursor: pointer;
		transition: var(--transition);
	}

	.view-button {
		background: var(--bg-main);
		color: var(--text-dark);
		border: 1px solid var(--border-color);
	}

	.view-button:hover {
		background: var(--border-color);
	}

	.leave-button {
		background: #fee2e2;
		color: #b91c1c;
	}

	.leave-button:hover {
		background: #fca5a5;
	}

	.error-message {
		color: #b91c1c;
		font-size: 0.9rem;
		margin: 0;
	}
</style>
