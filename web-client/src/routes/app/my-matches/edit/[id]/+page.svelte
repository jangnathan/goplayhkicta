<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { activePage } from '$lib/dashboard';
	import { authState, db } from '$lib/firebase.svelte.js';
	import {
		fetchMatchById,
		updateMatch,
		removeMatchMember,
		formatMatchDate,
		MAX_MATCH_SPOTS
	} from '$lib/matches';
	import { LocationDetails } from '$lib/locations';
	import { SportLabels } from '$lib/sports';
	import ProfilePic from '$lib/component/ProfilePic.svelte';
	import { doc, getDoc } from 'firebase/firestore';

	let isLoading = $state(true);
	let isSaving = $state(false);
	let isKicking = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	let match = null;
	let title = $state('');
	let description = $state('');
	let sport = $state(0);
	let locationID = $state(0);
	let spotsTotal = $state(0);
	let createdAt = $state(null);

	let joinedPlayers = $state([]);
	let playerProfiles = $state([]);

	let currentUID = $state(null);
	let isOwner = $state(false);
	let requiredRemovals = $state(0);
	let canSave = $state(false);

	$effect(() => {
		requiredRemovals = Math.max((joinedPlayers?.length || 0) - Number(spotsTotal), 0);
		canSave =
			!isLoading &&
			!isSaving &&
			requiredRemovals === 0 &&
			title.trim().length > 0 &&
			sport !== 0 &&
			locationID !== 0 &&
			isOwner;
	});

	activePage.set('my-matches');

	async function loadPlayerProfiles(uids) {
		if (!Array.isArray(uids) || uids.length === 0) {
			playerProfiles = [];
			return;
		}

		const profiles = await Promise.all(
			uids.map(async (uid) => {
				try {
					const userSnap = await getDoc(doc(db, 'users', uid));
					const userData = userSnap.exists() ? userSnap.data() : {};
					return {
						uid,
						displayName: userData.displayName || 'Unknown Player',
						photoURL: userData.photoURL,
						isCreator: uid === match.creatorID
					};
				} catch (err) {
					return {
						uid,
						displayName: 'Unknown Player',
						photoURL: undefined,
						isCreator: uid === match.creatorID
					};
				}
			})
		);

		playerProfiles = profiles;
	}

	async function loadMatch() {
		isLoading = true;
		errorMessage = '';
		successMessage = '';

		console.log('Loading match with ID:', $page.params.id);

		try {
			const matchId = $page.params.id;
			const loadedMatch = await fetchMatchById(matchId);

			match = loadedMatch;
			title = match.title ?? '';
			description = match.description ?? '';
			sport = String(match.sport ?? 0);
			locationID = String(match.locationID ?? 0);
			spotsTotal = Number(match.spotsTotal ?? 0);
			createdAt = match.createdAt;
			joinedPlayers = Array.isArray(match.joinedPlayers) ? [...match.joinedPlayers] : [];

			currentUID = authState.user?.uid;
			isOwner = match?.creatorID && currentUID && match.creatorID === currentUID;

			await loadPlayerProfiles(joinedPlayers);

			if (!isOwner) {
				errorMessage = 'Only the match creator may edit this match.';
                goto('/app/my-matches');
			}
		} catch (err) {
			errorMessage = err?.message || 'Unable to load match information.';
			match = null;
		} finally {
			isLoading = false;
		}
	}

	onMount(loadMatch);

	async function kickMember(uid) {
		if (!match || uid === match.creatorID) return;
		isKicking = true;
		errorMessage = '';
		successMessage = '';

		try {
			await removeMatchMember(match.id, uid);
			joinedPlayers = joinedPlayers.filter((playerId) => playerId !== uid);
			playerProfiles = playerProfiles.filter((profile) => profile.uid !== uid);
			successMessage = 'Member removed successfully.';
		} catch (err) {
			errorMessage = err?.message || 'Unable to remove member.';
		} finally {
			isKicking = false;
		}
	}

	async function handleSave() {
		if (!canSave) {
			errorMessage =
				requiredRemovals > 0
					? `Remove ${requiredRemovals} player(s) or increase total spots before saving.`
					: 'Please fix the fields before saving.';
			return;
		}

		isSaving = true;
		errorMessage = '';
		successMessage = '';

		try {
			await updateMatch(match.id, {
				title: title.trim(),
				description: description.trim(),
				sport: Number(sport),
				locationID: Number(locationID),
				spotsTotal: Number(spotsTotal)
			});

			successMessage = 'Match updated successfully.';
			goto('/app/my-matches');
		} catch (err) {
			errorMessage = err?.message || 'Unable to save match changes.';
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="page-layout">
	<div class="control-container">
		<div>
			<h1 class="page-title">Edit Match</h1>
			<p class="page-subtitle">Update the match details, location, or remove players.</p>
		</div>
	</div>

	<div class="form-wrapper">
		{#if isLoading}
			<div class="loading-state">Loading match details…</div>
		{:else if !match}
			<div class="error-banner">{errorMessage || 'Match not found.'}</div>
		{:else}
			{#if errorMessage}
				<div class="error-banner">⚠️ {errorMessage}</div>
			{/if}

			{#if successMessage}
				<div class="success-banner">✅ {successMessage}</div>
			{/if}

			<form on:submit|preventDefault={handleSave} class="edit-form">
				<div class="form-section">
					<h2 class="section-title">Match Details</h2>

					<div class="input-group">
						<label for="title">Match Title</label>
						<input
							id="title"
							type="text"
							bind:value={title}
							placeholder="e.g., Weekend Soccer Scrimmage"
							disabled={!isOwner}
							required
						/>
					</div>

					<div class="input-group">
						<label for="description">Description</label>
						<textarea
							id="description"
							rows="4"
							bind:value={description}
							placeholder="Add details for players"
							disabled={!isOwner}></textarea>
					</div>

					<div class="form-row">
						<div class="input-group">
							<label for="sport">Sport</label>
							<select id="sport" bind:value={sport} disabled={!isOwner} required>
								{#each Object.entries(SportLabels) as [value, label]}
									<option {value}>{label}</option>
								{/each}
							</select>
						</div>

						<div class="input-group">
							<label for="spots">Total Spots</label>
							<input
								id="spots"
								type="number"
								min="2"
								max={MAX_MATCH_SPOTS}
								bind:value={spotsTotal}
								disabled={!isOwner}
								required
							/>
						</div>
					</div>
				</div>

				<div class="form-section">
					<h2 class="section-title">Location</h2>
					<div class="input-group">
						<label for="location">Location</label>
						<select id="location" bind:value={locationID} disabled={!isOwner} required>
							{#each Object.entries(LocationDetails) as [id, detail]}
								<option value={id}>{detail.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="meta-row">
					<div>
						<strong>Created At</strong>
						<p>{formatMatchDate(createdAt)}</p>
					</div>
					<div>
						<strong>Match ID</strong>
						<p>{match.id}</p>
					</div>
				</div>

				<div class="form-section">
					<h2 class="section-title">Current Players</h2>
					<p class="section-desc">
						Remove players to lower the total spots. You must remove {requiredRemovals} player(s) before
						saving if there are more joined players than spots.
					</p>

					<div class="players-list">
						{#each playerProfiles as player}
							<div class="player-row">
								<ProfilePic
									uid={player.uid}
									displayName={player.displayName}
									photoURL={player.photoURL}
									size={36}
								/>
								<div class="player-details">
									<span class="player-name">
										{player.displayName}{player.uid === currentUID ? ' (You)' : ''}
									</span>
									<span class="player-meta">
										{player.isCreator ? 'Host' : 'Joined player'}
									</span>
								</div>
								<button
									type="button"
									class="kick-button"
									disabled={player.uid === match.creatorID || !isOwner || isKicking}
									on:click={() => kickMember(player.uid)}
								>
									{player.uid === match.creatorID ? 'Host' : 'Kick'}
								</button>
							</div>
						{/each}
					</div>
				</div>

				<div class="actions-row">
					<a href="/app/my-matches" class="cancel-link">Cancel</a>
					<button type="submit" class="submit-button" disabled={!canSave}>
						{isSaving ? 'Saving...' : 'Save Match'}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<style>
	.page-layout {
		padding: 2rem;
		box-sizing: border-box;
		background-color: var(--bg-main);
		min-height: 100vh;
	}

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

	.form-wrapper {
		max-width: 760px;
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow);
		padding: 2rem;
	}

	.loading-state,
	.error-banner,
	.success-banner {
		padding: 1rem 1.25rem;
		border-radius: var(--radius-md);
		margin-bottom: 1.5rem;
		font-weight: 600;
	}

	.loading-state {
		background: var(--bg-main);
		color: var(--text-muted);
		border: 1px solid var(--border-color);
	}

	.error-banner {
		background: #fee2e2;
		color: #991b1b;
		border: 1px solid #fecaca;
	}

	.success-banner {
		background: #dcfce7;
		color: #166534;
		border: 1px solid #bbf7d0;
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.form-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-dark);
	}

	.section-desc {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin: 0;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.meta-row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	input,
	textarea,
	select {
		background: var(--bg-main);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 0.85rem 1rem;
		font-size: 1rem;
		color: var(--text-dark);
		outline: none;
		transition: var(--transition);
		width: 100%;
		box-sizing: border-box;
	}

	input:focus,
	textarea:focus,
	select:focus {
		border-color: var(--primary);
	}

	textarea {
		min-height: 120px;
		resize: vertical;
	}

	.players-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 0.75rem;
	}

	.player-row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 1rem;
		align-items: center;
		background: var(--bg-main);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 0.9rem 1rem;
	}

	.player-details {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.player-name {
		font-weight: 600;
		color: var(--text-dark);
	}

	.player-meta {
		color: var(--text-muted);
		font-size: 0.9rem;
	}

	.kick-button,
	.submit-button {
		background: var(--primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		padding: 0.75rem 1rem;
		font-weight: 700;
		cursor: pointer;
		transition: var(--transition);
	}

	.kick-button:disabled,
	.submit-button:disabled {
		background: var(--border-color);
		color: var(--text-muted);
		cursor: not-allowed;
	}

	.kick-button {
		min-width: 95px;
	}

	.cancel-link {
		color: var(--text-dark);
		text-decoration: none;
		font-weight: 600;
	}

	.actions-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.submit-button {
		min-width: 180px;
	}
</style>
