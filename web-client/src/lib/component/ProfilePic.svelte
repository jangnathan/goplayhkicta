<script>
	let { uid, displayName, photoURL, size } = $props();

	const initial = displayName?.trim()?.charAt(0)?.toUpperCase() || '';

	function uidToColor(value) {
		const chars = (value || '').slice(0, 3).padEnd(3, '0').split('');
		const nibbles = chars.map((c) => {
			const hex = parseInt(c, 16);
			return Number.isNaN(hex) ? c.charCodeAt(0) % 16 : hex;
		});
		return `rgb(${nibbles[0] * 17}, ${nibbles[1] * 17}, ${nibbles[2] * 17})`;
	}

	const backgroundColor = uidToColor(uid);
	const inlineSize = `width: ${size}px; height: ${size}px; min-width: ${size}px;`;
</script>

<div
	class="profile-pic"
	style={`${inlineSize} background: ${photoURL ? 'transparent' : backgroundColor};`}
>
	{#if photoURL != '' && photoURL != undefined}
		<img src={photoURL} alt={displayName ? `${displayName} profile` : 'Profile picture'} />
	{:else}
		<span class="initial">{initial}</span>
	{/if}
</div>

<style>
	.profile-pic {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 18px;
		overflow: hidden;
		background-color: var(--border-color);
		color: white;
		font-weight: 700;
		font-size: 1.05rem;
		text-transform: uppercase;
	}

	.profile-pic img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.initial {
		user-select: none;
	}
</style>
