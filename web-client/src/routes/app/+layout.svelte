<script>
	import { signOut } from 'firebase/auth';
	import { authState, auth } from '$lib/firebase.svelte';
	import { activePage } from '$lib/dashboard';
	import { goto } from '$app/navigation';
	let { children } = $props();

	let showNotification = false;

	$effect(() => {
		if (!authState.isChecking && !authState.isLoggedIn) {
			goto('/login');
		}
	});

	async function logoutApp() {
		try {
			await signOut(auth);

			window.location.href = '/';
		} catch (error) {
			console.error('Error logging out:', error.message);
		}
	}
</script>

{#if authState.isChecking}
	<div class="loading-screen">
		<p>Verifying session...</p>
	</div>
{:else if authState.isLoggedIn}
	<div class="app-layout">
		<header class="top-bar">
			<div class="logo">
				<strong>GoplayHK</strong>
			</div>

			<div class="user-right">
				<p class="username">{authState.user?.email}</p>

				<button class="btn logout" on:click={logoutApp}>
					<i class="ri-logout-box-r-line"> </i>
				</button>
			</div>
		</header>

		<div class="container">
			<aside class="sidebar">
				<nav class="sidebar-menu">
					<a href="/app" class="menu-item" class:active={$activePage == 'home'}>
						<span class="icon"></span> <span class="label">Home</span>
					</a>
					<a href="/app/my-matches" class="menu-item" class:active={$activePage == 'my-matches'}>
						<i class="ri-calendar-fill"></i>
						<span class="label">Matches</span>
					</a>
					<a href="/app/chat" class="menu-item" class:active={$activePage == 'chat'}>
						<span class="icon"></span> <span class="label">Chat</span>
					</a>
					<a href="/app/profile" class="menu-item" class:active={$activePage == 'profile'}>
						<span class="icon"></span> <span class="label">Profile</span>
					</a>
					<a href="/app/setting" class="menu-item" class:active={$activePage == 'setting'}>
						<span class="icon"></span> <span class="label">Settings</span>
					</a>
				</nav>
			</aside>

			<main class="main-content">
				{@render children()}
			</main>
		</div>

		{#if showNotification}
			<div class="notification-toast">
				<div class="toast-content">
					<span class="toast-icon">⚡</span>
					<div class="toast-text">
						<p>Player matched with your Basketball game!</p>
						<span class="toast-time">2m ago</span>
					</div>
				</div>
				<button class="toast-close" on:click={() => (showNotification = false)}>&times;</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.app-layout {
		display: flex;
		flex-direction: column;
		grid-template-columns: 240px 1fr;
		height: 100%;
		width: 100%;
		background-color: var(--bg-main);
		color: var(--text-dark);
		overflow: hidden;
	}

	.container {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
	}
	.main-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.top-bar {
		width: 100%;
		height: 64px;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.top-bar .logo {
		padding: 1rem;
	}
	.top-bar strong {
		font-size: 2rem;
	}
	.top-bar .username {
		font-size: 1.2rem;
		margin-right: 1rem;
	}
	.user-right {
		display: flex;
		flex-direction: row;
		padding: 2px;
		margin-right: 16px;
	}
	.user-right .logout {
		background: none;
		border: none;
		font-size: 1.5rem;
		padding: 2px;
		cursor: pointer;
	}

	.container {
		display: flex;
		flex-direction: row;
	}

	.sidebar {
		background-color: var(--card-bg);
		border-right: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		padding: 24px 16px;
	}

	.sidebar-menu {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 600;
		border-radius: var(--radius-md);
		transition: var(--transition);
	}

	.menu-item:hover,
	.menu-item.active {
		background-color: var(--bg-main);
		color: var(--primary);
	}

	.main-content {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		padding: 40px;
	}

	.notification-toast {
		position: fixed;
		bottom: 24px;
		right: 24px;
		background-color: var(--secondary);
		color: white;
		padding: 16px 20px;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow);
		display: flex;
		align-items: flex-start;
		gap: 16px;
		z-index: 100;
		max-width: 360px;
	}

	.toast-content {
		display: flex;
		gap: 12px;
	}

	.toast-icon {
		font-size: 20px;
	}

	.toast-text p {
		margin: 0 0 4px 0;
		font-size: 13px;
		line-height: 1.4;
	}

	.toast-time {
		font-size: 11px;
		opacity: 0.6;
	}

	.toast-close {
		background: none;
		border: none;
		color: white;
		font-size: 20px;
		cursor: pointer;
		opacity: 0.7;
		padding: 0;
	}

	@media (max-width: 768px) {
		.app-layout {
			grid-template-columns: 1fr;
		}
		.sidebar {
			display: none;
		}
		.main-content {
			padding: 20px;
		}
	}
</style>
