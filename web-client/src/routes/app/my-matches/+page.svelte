<script>
	import { activePage } from '$lib/dashboard';

	// Tell your sidebar layout that "my-matches" is the active view
	activePage.set('my-matches');

	// Filtered mock data representing the user's personal schedule
	let hostingMatches = [
		{
			id: 1,
			title: 'Friday Night 5v5',
			sport: 'Basketball',
			location: 'Victoria Park',
			spots: '8/10',
			status: 'Upcoming'
		}
	];

	let joinedMatches = [
		{
			id: 2,
			title: 'Casual Lunch Run',
			sport: 'Soccer',
			location: 'South Park Field',
			spots: '11/14',
			status: 'Tomorrow'
		},
		{
			id: 3,
			title: 'Morning 3v3',
			sport: 'Basketball',
			location: 'Downtown YMCA',
			spots: '3/6',
			status: 'Next Week'
		}
	];
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
			{#if hostingMatches.length === 0}
				<div class="empty-state">
					<p>You aren't organizing any matches right now.</p>
				</div>
			{:else}
				<div class="matches-grid">
					{#each hostingMatches as match}
						<div class="match-card host-card">
							<div class="match-badge status-badge">{match.status}</div>
							<span class="sport-tag">{match.sport}</span>
							<h3 class="match-title">{match.title}</h3>
							<p class="match-location">📍 {match.location}</p>
							<div class="match-footer">
								<span class="match-spots">👥 {match.spots} filled</span>
								<button class="manage-button">Edit Match</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<section class="schedule-group">
			<h2 class="section-heading">Matches You've Joined</h2>
			{#if joinedMatches.length === 0}
				<div class="empty-state">
					<p>You haven't joined any upcoming matches yet.</p>
				</div>
			{:else}
				<div class="matches-grid">
					{#each joinedMatches as match}
						<div class="match-card">
							<div class="match-badge">{match.status}</div>
							<span class="sport-tag">{match.sport}</span>
							<h3 class="match-title">{match.title}</h3>
							<p class="match-location">📍 {match.location}</p>
							<div class="match-footer">
								<span class="match-spots">👥 {match.spots} players</span>
								<button class="leave-button">Leave Game</button>
							</div>
						</div>
					{/each}
				</div>
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
	}

	/* Structural Cards styling */
	.match-card {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow);
		display: flex;
		flex-direction: column;
		position: relative;
		transition: var(--transition);
	}

	/* Subtle border difference for hosted matches so they stand out */
	.match-card.host-card {
		border-left: 4px solid var(--primary);
	}

	.sport-tag {
		font-size: 0.75rem;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--primary);
		letter-spacing: 0.05em;
		margin-bottom: 0.25rem;
	}

	.match-badge {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		background-color: var(--bg-main);
		color: var(--text-muted);
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-lg);
		font-size: 0.75rem;
		font-weight: 600;
		border: 1px solid var(--border-color);
	}

	.status-badge {
		background-color: #fff5f2;
		color: var(--primary);
		border-color: #ffe4de;
	}

	.match-title {
		font-size: 1.25rem;
		color: var(--text-dark);
		margin-bottom: 0.5rem;
		padding-right: 5rem;
	}

	.match-location {
		color: var(--text-muted);
		font-size: 0.95rem;
		margin-bottom: 1.5rem;
	}

	/* Structural actions footer container */
	.match-footer {
		margin-top: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--border-color);
		padding-top: 1rem;
	}

	.match-spots {
		font-size: 0.9rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	.manage-button {
		background-color: var(--secondary);
		color: white;
		border: none;
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-md);
		font-weight: 600;
		cursor: pointer;
		transition: var(--transition);
	}

	.manage-button:hover {
		background-color: var(--secondary-hover);
	}

	.leave-button {
		background-color: transparent;
		color: #ef4444; /* Destructive action color */
		border: 1px solid #fee2e2;
		padding: 0.5rem 1.25rem;
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: var(--transition);
	}

	.leave-button:hover {
		background-color: #fef2f2;
		border-color: #ef4444;
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
