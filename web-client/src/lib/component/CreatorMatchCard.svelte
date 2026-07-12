<script>
	import { createEventDispatcher } from 'svelte';
	import { LocationDetails } from '$lib/locations';
	import { SportLabels } from '$lib/sports';
	import { formatMatchDate, deleteMatch } from '$lib/matches';

	const dispatch = createEventDispatcher();
	let { match } = $props();

	let showConfirm = $state(false);
	let isDeleting = $state(false);

	async function handleDelete() {
		isDeleting = true;
		try {
			await deleteMatch(match.id);
			dispatch('deleted', { id: match.id });
		} catch (err) {
			console.error('Delete failed', err);
			isDeleting = false;
			showConfirm = false;
		} finally {
			isDeleting = false;
		}
	}
	const matchDate = formatMatchDate(match.date || match.createdAt);
</script>

<div class="match-card">
	<div class="actions-menu">
		{#if !showConfirm}
			<a href="/app/my-matches/edit/{match.id}/" class="action-btn edit-btn" title="Edit Match">
				<i class="ri-edit-line"></i>
			</a>
			<button
				onclick={() => (showConfirm = true)}
				class="action-btn delete-btn"
				title="Delete Match"
			>
				<i class="ri-delete-bin-line"></i>
			</button>
		{:else}
			<div class="confirm-overlay">
				<span>Are you sure?</span>
				<button onclick={handleDelete} disabled={isDeleting} class="confirm-btn yes">
					{isDeleting ? '...' : 'Yes'}
				</button>
				<button onclick={() => (showConfirm = false)} disabled={isDeleting} class="confirm-btn no">
					No
				</button>
			</div>
		{/if}
	</div>

	<div class="card-body">
		<span class="badge">{SportLabels[match.sport]}</span>
		<h3 class="title">{match.title || 'Untitled Match'}</h3>

		<div class="details">
			<p class="detail-item">
				<i class="ri-calendar-event-line icon"></i>
				{matchDate}
			</p>
			<p class="detail-item">
				<i class="ri-map-pin-line icon"></i>
				{LocationDetails[match.locationID].name || 'No Location Set'}
			</p>
			<p class="detail-item">
				<i class="ri-team-line icon"></i>
				{match.joinedPlayers.length || 0} Joined
			</p>
		</div>
	</div>
</div>

<style>
	.match-card {
		position: relative;
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow);
		max-width: 400px;
		transition: var(--transition);
		box-sizing: border-box;
	}

	.actions-menu {
		position: absolute;
		top: 1rem;
		right: 1rem;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		z-index: 10;
	}

	.action-btn {
		background: var(--bg-main);
		color: var(--text-muted);
		border: none;
		border-radius: var(--radius-md);
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		text-decoration: none;
		font-size: 1.1rem;
		transition: var(--transition);
	}

	.action-btn:hover {
		background: var(--border-color);
		color: var(--text-dark);
	}

	.delete-btn:hover {
		background: #fee2e2;
		color: var(--primary);
	}

	.confirm-overlay {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #fee2e2;
		padding: 0.35rem 0.75rem;
		border-radius: var(--radius-md);
		font-size: 0.8rem;
		font-weight: 600;
		color: #991b1b;
		box-shadow: var(--shadow);
	}

	.confirm-btn {
		border: none;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-weight: bold;
		font-size: 0.75rem;
		transition: var(--transition);
	}

	.confirm-btn.yes {
		background: var(--primary);
		color: white;
	}

	.confirm-btn.yes:hover {
		background: var(--primary-hover);
	}

	.confirm-btn.no {
		background: var(--border-color);
		color: var(--text-muted);
	}

	.confirm-btn.no:hover {
		background: #cbd5e1;
		color: var(--text-dark);
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.badge {
		align-self: flex-start;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		background: var(--bg-main);
		color: var(--text-muted);
		border: 1px solid var(--border-color);
	}

	/* Theme overrides for dynamic sport classes */
	.badge.basketball {
		background: #ffedd5;
		color: #ea580c;
		border-color: #fed7aa;
	}
	.badge.soccer {
		background: #dcfce7;
		color: #16a34a;
		border-color: #bbf7d0;
	}

	.title {
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--text-dark);
		padding-right: 5rem;
		line-height: 1.3;
		margin: 0;
	}

	.details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.detail-item {
		font-size: 0.9rem;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin: 0;
	}

	.detail-item .icon {
		font-size: 1.1rem;
		color: var(--text-muted);
	}
</style>
