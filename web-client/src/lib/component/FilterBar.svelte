<script>
	import { createEventDispatcher } from 'svelte';
	import { SportEnum, SportLabels } from '$lib/sports';
	import { LocationEnum, LocationDetails } from '$lib/locations';
    import { LocationGroups } from '$lib/locations';

	let { filter } = $props();

	const dispatch = createEventDispatcher();

	const sportOptions = [
		{ value: null, label: 'All sports' },
		{ value: SportEnum.BASKETBALL, label: SportLabels[SportEnum.BASKETBALL] },
		{ value: SportEnum.SOCCER, label: SportLabels[SportEnum.SOCCER] },
		{ value: SportEnum.VOLLEYBALL, label: SportLabels[SportEnum.VOLLEYBALL] },
		{ value: SportEnum.TENNIS, label: SportLabels[SportEnum.TENNIS] }
	];

	const orderByOptions = [
        { value: 'relevance', label: 'Relevant' },
		{ value: 'recency', label: 'Recent' },
		{ value: 'spotsAvailable', label: 'Most available spots' }
	];

	function updateFilter(changes) {
		dispatch('change', {
			...filter,
			...changes
		});
	}

	function onSportChange(event) {
		updateFilter({ sport: event.target.value ? Number(event.target.value) : null });
	}

	function onIslandChange(event) {
		const island = event.target.value || null;
		updateFilter({ island, court: null });
	}

	function onCourtChange(event) {
		updateFilter({ court: event.target.value ? Number(event.target.value) : null });
	}

	function onOrderByChange(event) {
		updateFilter({ orderBy: event.target.value });
	}

	function clearFilters() {
		updateFilter({ sport: null, island: null, court: null, orderBy: 'recency' });
	}
</script>

<div class="filter-bar">
	<div class="filter-item">
		<label for="sport-select">Sport</label>
		<select id="sport-select" onchange={onSportChange} value={filter.sport ?? ''}>
			{#each sportOptions as option}
				<option value={option.value ?? ''} selected={option.value === filter.sport}
					>{option.label}</option
				>
			{/each}
		</select>
	</div>

	<div class="filter-item">
		<label for="island-select">Island</label>
		<select id="island-select" onchange={onIslandChange} value={filter.island ?? ''}>
			<option value="">All islands</option>
			{#each Object.keys(LocationGroups) as island}
				<option value={island} selected={island === filter.island}>
					{island}
				</option>
			{/each}
		</select>
	</div>

	<div class="filter-item">
		<label for="court-select">Court</label>
		<select
			id="court-select"
			onchange={onCourtChange}
			value={filter.court ?? ''}
			disabled={!filter.island}
		>
			<option value=""
				>{filter.island ? 'All courts in selected island' : 'Select island first'}</option
			>
			{#if filter.island}
                {#each LocationGroups[filter.island] as locationID}
                    <option value={locationID} selected={locationID === filter.court}>
                        {LocationDetails[locationID]?.name || 'Unknown Court'}
                    </option>
                {/each}
			{/if}
		</select>
	</div>

	<div class="filter-item">
		<label for="order-select">Order by</label>
		<select id="order-select" onchange={onOrderByChange} value={filter.orderBy}>
			{#each orderByOptions as option}
				<option value={option.value} selected={option.value === filter.orderBy}
					>{option.label}</option
				>
			{/each}
		</select>
	</div>

	<button type="button" class="clear-button" onclick={clearFilters}> Clear filters </button>
</div>

<style>
	.filter-bar {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		width: 100%;
		align-items: end;
        padding: 1rem;
	}

	.filter-item {
		display: grid;
		gap: 0.5rem;
	}

	label {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--text-dark);
	}

	select {
		width: 100%;
		padding: 0.8rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		background: var(--card-bg);
		color: var(--text-dark);
		font-size: 0.95rem;
		appearance: none;
	}

	.clear-button {
		background: none;
		border: 1px solid var(--border-color);
		color: var(--text-dark);
		border-radius: var(--radius-md);
		padding: 0.9rem 1.2rem;
		font-weight: 700;
		cursor: pointer;
		transition: var(--transition);
		justify-self: start;
	}

	.clear-button:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	@media (max-width: 720px) {
		.filter-bar {
			grid-template-columns: 1fr;
		}
	}
</style>
