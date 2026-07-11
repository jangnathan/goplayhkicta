<script>
	import { LocationDetails } from '$lib/locations';
	import { SportLabels } from '$lib/sports';
	import { db, authState } from '$lib/firebase.svelte';
	import { doc, getDoc } from 'firebase/firestore';
	import { joinMatch } from '$lib/matches';
	import ProfilePic from './ProfilePic.svelte';

	let { match } = $props();
	let joinError = '';
	let joining = false;

	let creatorDisplayName = $state(undefined);
	let creatorPhotoURL = $state(undefined);
	let finishedLoadingCreatorInfo = $state(false);

	function formatMatchDate(value) {
		if (!value) return 'No date set';

		const date =
			value.toDate?.() ??
			(value.seconds ? new Date(value.seconds * 1000) : null) ??
			(typeof value === 'string' ? new Date(value) : null) ??
			(value instanceof Date ? value : null);

		if (!date || Number.isNaN(date.getTime())) {
			return 'No date set';
		}

		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		}).format(date);
	}

	const matchDate = formatMatchDate(match.date || match.createdAt);

	let alreadyJoined = $state(false);
	$effect(() => {
		alreadyJoined = authState.user && Array.isArray(match.joinedPlayers)
			? match.joinedPlayers.includes(authState.user.uid)
			: false;
	});

	async function handleJoin() {
		joinError = '';

		if (alreadyJoined) {
			joinError = 'You already joined this match.';
			return;
		}

		if (match.spotsFilled >= match.spotsTotal) {
			joinError = 'Match is full.';
			return;
		}

		joining = true;
		try {
			await joinMatch(match.id);
			match.joinedPlayers = [...(match.joinedPlayers || []), authState.user.uid];

			alreadyJoined = true;
		} catch (err) {
			joinError = err?.message || 'Unable to join the match.';
		} finally {
			joining = false;
		}
	}

	$effect(async () => {
		try {
			const userRef = doc(db, 'users', match.creatorID);
			const userSnap = await getDoc(userRef);

			if (userSnap.exists()) {
				creatorDisplayName = userSnap.data().displayName;
				creatorPhotoURL = userSnap.data().photoURL;
			} else {
				creatorDisplayName = 'Unknown Player';
				creatorPhotoURL = undefined;
			}
		} catch (e) {
			creatorDisplayName = 'Error loading name';
			creatorPhotoURL = undefined;
			console.error(`Error loading display name for ${match.creatorID}`, e);
		}
		finishedLoadingCreatorInfo = true;
	});
</script>

{#if !finishedLoadingCreatorInfo}
	<div class="match-card">
		<p>Loading match info...</p>
	</div>
{:else}
	<div class="match-card">
		<span class="sport-tag">{SportLabels[match.sport]}</span>

		<h3 class="match-title">{match.title}</h3>
		<p class="match-location">
			<i class="ri-map-pin-line"></i>
			{LocationDetails[match.locationID]?.name || 'Unknown Location'}
		</p>
		<p class="match-date">
			<i class="ri-calendar-line"></i>
			{matchDate}
		</p>

		<div class="creator-attribution">
			<ProfilePic
				uid={match.creatorID}
				displayName={creatorDisplayName}
				photoURL={creatorPhotoURL}
				size={24}
			/>
			<span class="creator-name">Organized by {creatorDisplayName}</span>
		</div>

		<div class="match-footer">
			<div class="spots-indicator">
				<span class="spots-text">
					<i class="ri-user-3-line"></i>
					{match.joinedPlayers.length} / {match.spotsTotal} Spots filled
				</span>
				<div class="progress-bar-bg">
					<div
						class="progress-bar-fill"
						style="width: {(match.joinedPlayers.length / match.spotsTotal) * 100}%"
					></div>
				</div>
			</div>

			<button
				class="join-button"
				disabled={alreadyJoined || match.joinedPlayers.length >= match.spotsTotal || joining}
				on:click={handleJoin}
			>
				{joining
					? 'Joining…'
					: alreadyJoined
						? 'Already joined'
						: match.joinedPlayers.length >= match.spotsTotal
							? 'Full'
							: 'Join Game'}
			</button>

			{#if joinError}
				<p class="error-message">{joinError}</p>
			{/if}
		</div>
	</div>
{/if}

<style>
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

	.match-date {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}
	.error-message {
		margin-top: 0.75rem;
		color: #dc2626;
		font-size: 0.9rem;
	}
</style>
