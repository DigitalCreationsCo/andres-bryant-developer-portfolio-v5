<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let isFirstLoad = true;
	onMount(() => {
		isFirstLoad = false;
	});
</script>

<svelte:head>
	<title>{`Bryant Mejia | Software Developer`}</title>
	<meta
		name="description"
		content="Bryant Mejia is a software developer building the data-driven user experiences of the future."
	/>
</svelte:head>

<section
	id="hero"
	class="grow"
	class:no-transition={isFirstLoad}
	in:fade|local={{ duration: 1000 }}
	out:fade|local={{ duration: 50 }}
>
	<Hero />
</section>

<style>
	.no-transition {
		animation: none !important;
	}
</style>