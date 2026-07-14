<script>
	import { onMount } from 'svelte';
	import { activePage } from '$lib/dashboard';
	import { authState, db } from '$lib/firebase.svelte';
	import { setUserProfile } from '$lib/profile';
	import { changeUserPassword } from '$lib/user';
	import { doc, getDoc } from 'firebase/firestore';

	let displayName = $state('');
	let bio = $state('');

	// passwords do not need state
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let profileMessage = '';
	let passwordMessage = '';
	let profileError = '';
	let passwordError = '';
	let savingProfile = false;
	let changingPassword = false;
	let isDark = $state(false);

	async function loadUserProfile() {
		const user = authState.user;
		if (!user) return;

		displayName = user.displayName || '';

		const profileRef = doc(db, 'users', user.uid);
		const profileSnap = await getDoc(profileRef);

		if (profileSnap.exists()) {
			const data = profileSnap.data();
			bio = data.bio || '';
			displayName = data.displayName || displayName;
		}
	}

	onMount(() => {
		activePage.set('setting');
		loadUserProfile();
		try {
			isDark = document.documentElement.classList.contains('dark');
		} catch (e) {
			isDark = false;
		}
	});

	async function saveDisplayName() {
		profileMessage = '';
		profileError = '';
		savingProfile = true;

		try {
			await setUserProfile({ displayName, bio });
			profileMessage = 'Profile updated successfully.';
		} catch (err) {
			profileError = err?.message || 'Unable to update profile.';
		} finally {
			savingProfile = false;
		}
	}

	async function changePassword() {
		passwordMessage = '';
		passwordError = '';
		changingPassword = true;

		if (newPassword !== confirmPassword) {
			passwordError = 'New password and confirmation do not match.';
			changingPassword = false;
			return;
		}

		try {
			await changeUserPassword(currentPassword, newPassword);
			passwordMessage = 'Password updated successfully.';
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch (err) {
			passwordError = err?.message || 'Unable to change password.';
		} finally {
			changingPassword = false;
		}
	}

	function onThemeChange(e) {
		try {
			// checkbox change will have the new value bound to isDark already
			if (typeof e?.target?.checked === 'boolean') {
				isDark = e.target.checked;
			}

			if (isDark) {
				document.documentElement.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				document.documentElement.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
		} catch (e) {
			// ignore
		}
	}
</script>

<section class="page-shell">
	<div class="form-card">
		<h1>Account settings</h1>
		<p class="description">Update your display name, bio, and securely change your password.</p>

		<div class="section">
			<h2>Profile</h2>
			<div class="field-group">
				<label for="displayName">Display name</label>
				<input
					id="displayName"
					type="text"
					bind:value={displayName}
					placeholder="Enter display name"
				/>
			</div>
			<div class="field-group">
				<label for="bio">Bio</label>
				<textarea
					id="bio"
					rows="4"
					bind:value={bio}
					placeholder="Tell people a little about yourself."
				/>
			</div>
			<button on:click|preventDefault={saveDisplayName} disabled={savingProfile}>
				{savingProfile ? 'Saving...' : 'Save profile'}
			</button>
			{#if profileMessage}
				<p class="message success">{profileMessage}</p>
			{/if}
			{#if profileError}
				<p class="message error">{profileError}</p>
			{/if}
		</div>

		<div class="section">
			<h2>Appearance</h2>
			<p class="description small-text">Switch between light and dark themes.</p>
			<div class="field-group">
				<label for="themeToggle">Theme</label>

				<div class="theme-switch">
					<span class="ts-icon sun"><i class="ri-sun-line"></i></span>
					<label class="switch" aria-hidden="false">
						<input
							id="themeToggle"
							type="checkbox"
							bind:checked={isDark}
							on:change={onThemeChange}
						/>
						<span class="track" aria-hidden="true">
							<span class="thumb" />
						</span>
					</label>
					<span class="ts-icon moon"><i class="ri-moon-line"></i></span>
				</div>
			</div>
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
			<button on:click|preventDefault={changePassword} disabled={changingPassword}>
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
		color: var(--text-dark);
	}

	h2 {
		margin-top: 1.75rem;
		margin-bottom: 0.75rem;
		font-size: 1.2rem;
		color: var(--text-dark);
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
		background: var(--input-bg);
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

	textarea {
		width: 100%;
		resize: vertical;
		padding: 0.95rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--input-bg);
		color: var(--text-dark);
		transition: var(--transition);
		min-height: 110px;
	}
	textarea:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(255, 59, 43, 0.12);
	}

	/* Theme switch styles */
	.theme-switch {
		display: inline-flex;
		align-items: center;
		gap: 10px;
	}

	.ts-icon {
		color: var(--text-muted);
		font-size: 1.1rem;
	}

	.switch {
		display: inline-block;
		position: relative;
		width: 56px;
		height: 32px;
	}

	.switch input {
		appearance: none;
		-webkit-appearance: none;
		opacity: 0;
		position: absolute;
		width: 0;
		height: 0;
		left: -9999px;
	}

	.track {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--border-color);
		border-radius: 999px;
		position: relative;
		transition: background 0.18s ease;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
	}

	.thumb {
		display: block;
		width: 26px;
		height: 26px;
		background: white;
		border-radius: 50%;
		position: absolute;
		top: 3px;
		left: 3px;
		transition:
			transform 0.18s ease,
			background 0.18s ease;
		box-shadow: 0 2px 6px rgba(16, 24, 40, 0.12);
	}

	/* Checked state */
	.switch input:checked + .track {
		background: var(--primary);
	}

	.switch input:checked + .track .thumb {
		transform: translateX(24px);
		background: white;
	}
</style>
