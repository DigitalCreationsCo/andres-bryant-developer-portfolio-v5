<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { scale } from 'svelte/transition';
	// import TwinklingStars from '$lib/components/stars.svelte'; // Dynamically imported

	let TwinklingStars: any; // Declare a variable to hold the dynamically imported component

	onMount(async () => {
		if (browser) {
			const currentUrl = $page.url.pathname;
			sessionStorage.setItem('lastUrl', currentUrl);
			// Dynamically import TwinklingStars only on the client
			TwinklingStars = (await import('$lib/components/stars.svelte')).default;
		}
	});

	// function fadeAndScale(...) - Temporarily removed
</script>

{#if TwinklingStars}
	<svelte:component this={TwinklingStars} starCount={10000}>
		<div class="relative h-full md:max-w-3xl p-10 m-auto md:content-center bg-black md:bg-inherit">
			<div class="absolute top-0 left-0 h-1/2 mb-10 overflow-clip">
				<img
					src={'/stars.png'}
					alt="Starfield, James Webb Telescope"
					class="absolute h-full object-cover opacity-50 mix-blend-lighten scale-105"
				/>
				<img
					src={'/stars.png'}
					alt="Starfield, James Webb Telescope"
					class="absolute h-full object-cover top-3 left-5 rotate-8 opacity-50 mix-blend-lighten scale-110"
				/>
				<img
					src={'/stars.png'}
					alt="Starfield, James Webb Telescope"
					class="absolute h-full object-cover top-0 left-0 rotate-12 opacity-50 mix-blend-lighten scale-150"
				/>
				<div
					class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black md:from-dark md:via-transparent md:to-dark"
				></div>
				<div
					class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-transparent to-black md:from-dark md:via-transparent md:to-dark"
				></div>
			</div>
			<h3 in:scale={{ duration: 1500, start: 0.95, opacity: 0 }} class="w-fit mx-auto">
				{`I’m Bryant Mejia. 
I'm a full-stack software engineer with 5+ years of experience designing and delivering scalable software, data infrastructure, and AI systems for startups and modern enterprises. My work sits at the intersection of data, infrastructure, and user experience—helping businesses unlock value and people make better decisions in the flow of work and life.`}
			</h3>
		</div>
	</svelte:component>
{/if}
