<script>
	import { onMount } from 'svelte';
	import { activePage } from '$lib/dashboard';
	import { authState } from '$lib/firebase.svelte';
	import { setUserProfile, changeUserPassword } from '$lib/profile';

	let displayName = '';
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let profileMessage = '';
	let passwordMessage = '';
	let profileError = '';
	let passwordError = '';
	let savingProfile = false;
	let changingPassword = false;

	onMount(() => {
		activePage.set('setting');
		if (authState.user?.displayName) {
			displayName = authState.user.displayName;
		}
	});

	async function saveDisplayName() {
		profileMessage = '';
		profileError = '';
		savingProfile = true;

		try {
			await setUserProfile({ displayName });
			profileMessage = 'Display name updated successfully.';
		} catch (err) {
			profileError = err?.message || 'Unable to update display name.';
		} finally {
			savingProfile = false;
		}
	}

	async function updatePassword() {
		passwordMessage = '';
		passwordError = '';

		if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
			passwordError = 'Please fill all fields and make sure passwords match.';
			return;
		}

		changingPassword = true;

		try {
			await changeUserPassword(currentPassword, newPassword);
			passwordMessage = 'Password changed successfully.';
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch (err) {
			passwordError = err?.message || 'Unable to change password.';
		} finally {
			changingPassword = false;
		}
	}
</script>

<section class="page-shell">
	<div class="form-card">
		<h1>Account settings</h1>
		<p class="description">Update your display name and securely change your password.</p>

		<div class="section">
			<h2>Display name</h2>
			<div class="field-group">
				<label for="displayName">Display name</label>
				<input
					id="displayName"
					type="text"
					bind:value={displayName}
					placeholder="Enter display name"
				/>
			</div>
			<button on:click|preventDefault={saveDisplayName} disabled={savingProfile}>
				{savingProfile ? 'Saving...' : 'Save display name'}
			</button>
			{#if profileMessage}
				<p class="message success">{profileMessage}</p>
			{/if}
			{#if profileError}
				<p class="message error">{profileError}</p>
			{/if}
		</div>

		<div class="section">
			<h2>Change password</h2>
			<p class="description small-text">
				For security, enter your current password before choosing a new one.
			</p>

			<div class="field-group">
				<label for="currentPassword">Current password</label>
				<input id="currentPassword" type="password" bind:value={currentPassword} />
			</div>
			<div class="field-group">
				<label for="newPassword">New password</label>
				<input id="newPassword" type="password" bind:value={newPassword} />
			</div>
			<div class="field-group">
				<label for="confirmPassword">Confirm new password</label>
				<input id="confirmPassword" type="password" bind:value={confirmPassword} />
			</div>
			<button on:click|preventDefault={updatePassword} disabled={changingPassword}>
				{changingPassword ? 'Updating...' : 'Update password'}
			</button>
			{#if passwordMessage}
				<p class="message success">{passwordMessage}</p>
			{/if}
			{#if passwordError}
				<p class="message error">{passwordError}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.page-shell {
		padding: 2rem 1rem;
		min-height: 100vh;
		background: var(--bg-main);
		color: var(--text-dark);
	}

	.form-card {
		max-width: 720px;
		margin: 0 auto;
		padding: 2rem;
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow);
	}

	h1 {
		margin-bottom: 0.5rem;
		font-size: 1.9rem;
	}

	h2 {
		margin-top: 1.75rem;
		margin-bottom: 0.75rem;
		font-size: 1.2rem;
		color: var(--secondary);
	}

	.description {
		color: var(--text-muted);
		margin-bottom: 1.5rem;
	}

	.section + .section {
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	.field-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	input {
		width: 100%;
		padding: 0.95rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: #f8fafc;
		color: var(--text-dark);
		transition: var(--transition);
	}

	input:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(255, 59, 43, 0.12);
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.95rem 1.4rem;
		background: var(--primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: var(--transition);
	}

	button:hover:not(:disabled) {
		background: var(--primary-hover);
	}

	button:disabled {
		opacity: 0.65;
		cursor: not-allowed;
	}

	.small-text {
		font-size: 0.95rem;
		color: var(--text-muted);
	}

	.message {
		margin-top: 0.9rem;
		font-size: 0.95rem;
	}

	.message.success {
		color: #16a34a;
	}

	.message.error {
		color: #dc2626;
	}
</style>
