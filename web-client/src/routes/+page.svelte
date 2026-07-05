<script>
</script>

<div class="landing-container">
	<header class="navbar">
		<div class="logo">GoPlayHK</div>
		<nav class="nav-links">
			<a href="#features">Features</a>
			<a href="#about">About</a>
		</nav>
		<a href="login" class="btn btn-secondary">Login</a>
	</header>

	<section class="hero">
		<div class="hero-content">
			<h1>GoPlay HK</h1>
			<p class="subtitle">
            Find pickup games, a badminton partner, and book pitches
			</p>
			<div class="cta-group">
				<a href="/register" class="btn btn-primary">Sign up</a>
			</div>
		</div>
		<div class="hero-visual">
			<div class="mock-app-screen">
				<div class="mock-header">Matches Near You</div>
				<div class="mock-card animate-float">
					<div class="mock-card-badge">Kowloon Tong 2 miles away</div>
					<h3>3v3 Basketball</h3>
					<p>4/6 Players Joined</p>
					<div class="mock-avatars">
						<span class="avatar">J</span>
						<span class="avatar">N</span>
						<span class="avatar">Z</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="features" class="features">
		<div class="section-header">
			<h2>Features</h2>
		</div>

		<div class="features-grid">
			<div class="feature-card">
				<div class="feature-icon"></div>
				<h3>Discover</h3>
				<p>
                Browse based on your favorite sport, preferences, and location
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon"></div>
				<h3>Match</h3>
				<p>
                A matchmaking system
				</p>
			</div>

			<div class="feature-card">
				<div class="feature-icon"></div>
				<h3>Chat & Play</h3>
				<p>
                    Get to know your opponent!
				</p>
			</div>
		</div>
	</section>

	<section class="cta-banner">
		<h2>Ready to play sport?</h2>
		<button class="btn btn-primary btn-large">Find a Match Now</button>
	</section>

	<footer>
		<p>© 2026 GoplayHK, all righgts reserved</p>
	</footer>
</div>

<style>

	/* Structural Base Layout Canvas */
	.landing-container {
		background-color: var(--bg-main);
		color: var(--text-dark);
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	/* Guarantee padding bounds sizing natively across sub-nodes */
	.landing-container * {
		box-sizing: border-box;
	}

	/* Navigation Bar Alignment */
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 5%;
		max-width: 1200px;
		margin: 0 auto;
		border-bottom: 1px solid var(--border-color);
	}

	.logo {
		font-size: 24px;
		font-weight: 800;
		letter-spacing: -0.5px;
		color: var(--text-dark);
	}

	.nav-links {
		display: flex;
		gap: 30px;
	}

	.nav-links a {
		text-decoration: none;
		color: var(--text-muted);
		font-weight: 500;
		transition: var(--transition);
	}

	.nav-links a:hover {
		color: var(--primary);
	}

	/* Shared Button States */
	.btn {
		padding: 10px 20px;
		font-size: 14px;
		font-weight: 600;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: var(--transition);
		border: none;
	}

	.btn-primary {
		background-color: var(--primary);
		color: white;
	}

	.btn-primary:hover {
		background-color: var(--primary-hover);
		transform: translateY(-1px);
	}

	.btn-secondary {
		background-color: var(--secondary);
		color: white;
	}

	.btn-secondary:hover {
		background-color: var(--secondary-hover);
	}

	.btn-outline {
		background-color: transparent;
		border: 2px solid var(--border-color);
		color: var(--text-dark);
	}

	.btn-outline:hover {
		background-color: var(--border-color);
	}

	.btn-large {
		padding: 16px 32px;
		font-size: 16px;
	}

	/* Split Layout Handling via Clearable Floats for Reliable Compiling */
	.hero {
		display: block;
		max-width: 1200px;
		margin: 0 auto;
		padding: 80px 5%;
		clear: both;
	}

	.hero-content {
		width: 50%;
		float: left;
		padding-right: 40px;
	}

	.hero-visual {
		width: 50%;
		float: right;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hero::after {
		content: '';
		display: table;
		clear: both;
	}

	.badge {
		display: inline-block;
		background-color: rgba(255, 75, 75, 0.1);
		color: var(--primary);
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		border-radius: 20px;
		margin-bottom: 20px;
	}

	.hero h1 {
		font-size: 48px;
		line-height: 1.1;
		font-weight: 800;
		margin: 0 0 20px 0;
		letter-spacing: -1px;
	}

	.subtitle {
		font-size: 18px;
		line-height: 1.6;
		color: var(--text-muted);
		margin-bottom: 40px;
	}

	.cta-group {
		display: flex;
		gap: 15px;
	}

	/* Pure CSS Mock App Presentation Graphics */
	.mock-app-screen {
		background-color: #1e293b;
		width: 320px;
		height: 400px;
		border-radius: 24px;
		padding: 20px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		position: relative;
		color: white;
	}

	.mock-header {
		font-size: 14px;
		font-weight: 600;
		opacity: 0.6;
		margin-bottom: 20px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.mock-card {
		background-color: var(--card-bg);
		border-radius: var(--radius-lg);
		padding: 20px;
		color: var(--text-dark);
		box-shadow: var(--shadow);
		position: absolute;
		top: 80px;
		left: -20px;
		right: -20px;
	}

	.mock-card-badge {
		font-size: 11px;
		background-color: #f1f5f9;
		padding: 4px 8px;
		border-radius: 4px;
		display: inline-block;
		color: var(--text-muted);
		font-weight: 600;
		margin-bottom: 10px;
	}

	.mock-card h3 {
		margin: 0 0 5px 0;
		font-size: 18px;
	}

	.mock-card p {
		margin: 0 0 15px 0;
		font-size: 13px;
		color: var(--text-muted);
	}

	.mock-avatars {
		display: flex;
		gap: 5px;
	}

	.avatar {
		width: 28px;
		height: 28px;
		background-color: var(--primary);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-size: 11px;
		font-weight: bold;
		border: 2px solid white;
	}

	.avatar:nth-child(2) {
		background-color: #3b82f6;
	}
	.avatar:nth-child(3) {
		background-color: #10b981;
	}

	/* Floating animation effects */
	@keyframes float {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	.animate-float {
		animation: float 4s ease-in-out infinite;
	}

	/* Auto-Fitting Features Section Layout Using CSS Grid */
	.features {
		max-width: 1200px;
		margin: 0 auto;
		padding: 100px 5%;
	}

	.section-header {
		text-align: center;
		max-width: 600px;
		margin: 0 auto 60px auto;
	}

	.section-header h2 {
		font-size: 36px;
		font-weight: 800;
		margin-bottom: 15px;
		letter-spacing: -0.5px;
	}

	.section-header p {
		color: var(--text-muted);
		font-size: 16px;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 30px;
	}

	.feature-card {
		background-color: var(--card-bg);
		border: 1px solid var(--border-color);
		padding: 40px 30px;
		border-radius: var(--radius-lg);
		transition: var(--transition);
	}

	.feature-card:hover {
		transform: translateY(-5px);
		box-shadow: var(--shadow);
		border-color: transparent;
	}

	.feature-icon {
		font-size: 32px;
		margin-bottom: 20px;
	}

	.feature-card h3 {
		font-size: 20px;
		margin: 0 0 10px 0;
		font-weight: 700;
	}

	.feature-card p {
		margin: 0;
		color: var(--text-muted);
		line-height: 1.6;
		font-size: 14px;
	}

	/* Closing Section Card Style Block */
	.cta-banner {
		background-color: var(--secondary);
		color: white;
		max-width: 1100px;
		margin: 60px auto;
		padding: 80px 40px;
		border-radius: 24px;
		text-align: center;
	}

	.cta-banner h2 {
		font-size: 40px;
		font-weight: 800;
		margin: 0 0 15px 0;
		letter-spacing: -1px;
	}

	.cta-banner p {
		font-size: 18px;
		opacity: 0.8;
		max-width: 500px;
		margin: 0 auto 40px auto;
		line-height: 1.5;
	}

	/* Footer Layout Styling */
	footer {
		text-align: center;
		padding: 40px 20px;
		border-top: 1px solid var(--border-color);
		color: var(--text-muted);
		font-size: 14px;
	}

	/* Viewport Media Breakpoints (Fluid Mobile Scalers) */
	@media (max-width: 768px) {
		.navbar {
			padding: 15px 20px;
		}

		.nav-links {
			display: none; /* Collapses navigation items for minimal mobile view footprints */
		}

		.hero {
			padding: 40px 20px;
		}

		.hero-content {
			width: 100%;
			float: none;
			padding-right: 0;
			text-align: center;
			margin-bottom: 50px;
		}

		.hero h1 {
			font-size: 36px;
		}

		.cta-group {
			justify-content: center;
		}

		.hero-visual {
			width: 100%;
			float: none;
		}

		.cta-banner h2 {
			font-size: 28px;
		}
	}
</style>
