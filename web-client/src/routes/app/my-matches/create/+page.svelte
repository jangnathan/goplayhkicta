<script>
	import { activePage } from '$lib/dashboard';
	import { SportLabels } from '$lib/sports';

	import { createMatch } from '$lib/matches'; // The JS function we built earlier
	import { goto } from '$app/navigation'; // SvelteKit router navigation

	// Keep the sidebar highlighting synced with the parent directory
	activePage.set('my-matches');

	// Form State bound directly to inputs
	let title = '';
    let description = '';
	let sport = 0;

	let spotsTotal = 10;

	// Grouped location structure
	let locationName = '';
	let latitude = '';
	let longitude = '';

	let isSubmitting = false;
	let errorMessage = '';

	async function handleSubmit() {
		isSubmitting = true;
		errorMessage = '';

		try {
			// Package the exact payload layout expected by our Firestore function
			const formData = {
				title,
                description,
				sport,
				spotsTotal,
				locationName,
				latitude,
				longitude
			};

			await createMatch(formData);

			// Redirect back to your schedule overview on success
			goto('/app/my-matches');
		} catch (err) {
			errorMessage = err.message;
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="page-layout">
	<div class="control-container">
		<div>
			<h1 class="page-title">Create a Match</h1>
			<p class="page-subtitle">Set up a new pickup game for players to join.</p>
		</div>
	</div>

	<div class="form-wrapper">
		{#if errorMessage}
			<div class="error-banner">
				⚠️ {errorMessage}
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="create-form">
			<div class="form-section">
				<h2 class="section-title">Game Details</h2>

				<div class="input-group">
					<label for="title">Match Title</label>
					<input
						type="text"
						id="title"
						bind:value={title}
						placeholder="e.g., Soccer 5v5"
						required
					/>
				</div>

				<div class="form-row">
					<div class="input-group">
						<label for="sport">Sport Type</label>
						<select id="sport" bind:value={sport}>
							{#each Object.entries(SportLabels) as [value, label]}
								<option value={Number(value)}>{label}</option>
							{/each}
						</select>
					</div>

					<div class="input-group">
						<label for="spots">Total Players Needed</label>
						<input type="number" id="spots" min="2" max="100" bind:value={spotsTotal} required />
					</div>
				</div>
			</div>

			<div class="form-section">
				<h2 class="section-title">Location</h2>
				<p class="section-desc">
                Set location so that it may be recommended to closer people
				</p>

				<div class="input-group">
					<label for="locName">Court / Venue Name</label>
					<input
						type="text"
						id="locName"
						bind:value={locationName}
						placeholder="e.g., Victoria Park Court #2"
						required
					/>
				</div>

				<div class="form-row">
					<div class="input-group">
						<label for="lat">Latitude (Optional math metric)</label>
						<input
							type="number"
							step="any"
							id="lat"
							bind:value={latitude}
							placeholder="e.g., 22.2822"
						/>
					</div>

					<div class="input-group">
						<label for="lng">Longitude (Optional math metric)</label>
						<input
							type="number"
							step="any"
							id="lng"
							bind:value={longitude}
							placeholder="e.g., 114.1895"
						/>
					</div>
				</div>
			</div>

			<div class="actions-row">
				<a href="/app/my-matches" class="cancel-link">Cancel</a>
				<button type="submit" class="submit-button" disabled={isSubmitting}>
					{isSubmitting ? 'Saving Match...' : 'Publish Match'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	/* Page Layout Wrapper matches padding context */
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

	/* Form Layout Box Container */
	.form-wrapper {
		max-width: 650px;
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow);
		padding: 2rem;
	}

	.create-form {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.form-section {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.section-title {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--text-dark);
	}

	.section-desc {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-top: -0.75rem;
	}

	/* Sub-element grid layouts */
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
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
		letter-spacing: 0.02em;
	}

	/* Universal Input / Form Field Styling */
	input,
	select {
		background-color: var(--bg-main);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		padding: 0.75rem 1rem;
		font-size: 1rem;
		color: var(--text-dark);
		transition: var(--transition);
		outline: none;
		box-sizing: border-box;
		width: 100%;
	}

	input:focus,
	select:focus {
		border-color: var(--primary);
		background-color: var(--card-bg);
		box-shadow: 0 0 0 3px rgba(255, 59, 43, 0.1);
	}

	/* Action Buttons Row */
	.actions-row {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 1.5rem;
		border-top: 1px solid var(--border-color);
		padding-top: 1.5rem;
	}

	.cancel-link {
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.95rem;
		transition: var(--transition);
	}

	.cancel-link:hover {
		color: var(--text-dark);
	}

	.submit-button {
		background-color: var(--primary);
		color: white;
		border: none;
		padding: 0.75rem 1.75rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: var(--transition);
	}

	.submit-button:hover:not(:disabled) {
		background-color: var(--primary-hover);
	}

	.submit-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error-banner {
		background-color: #fef2f2;
		border: 1px solid #fee2e2;
		color: #ef4444;
		padding: 1rem;
		border-radius: var(--radius-md);
		font-weight: 500;
		margin-bottom: 1.5rem;
		font-size: 0.95rem;
	}
</style>
