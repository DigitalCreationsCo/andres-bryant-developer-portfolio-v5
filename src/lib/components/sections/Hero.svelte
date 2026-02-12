<script lang="ts">
	import Typewriter from 'svelte-typewriter';
	import { onMount } from 'svelte';
	import { fadeSequence, startFadeSequence } from '$lib/store/sequentialFade';
	import { page } from '$app/stores';

	let isFirstLoad = true;
	onMount(() => {
		const lastUrl = sessionStorage.getItem('lastUrl');
		const currentUrl = $page.url.pathname;
		if (lastUrl === currentUrl || !lastUrl) {
			// if navigated from a different site or a reload, start the intro sequence
			startFadeSequence();
		}
		sessionStorage.setItem('lastUrl', currentUrl);
		isFirstLoad = lastUrl === currentUrl || !lastUrl;
	});
</script>

<div class="h-full md:p-10">
	<div
		class="relative h-full w-fit m-auto md:border border-blue duration-[5900ms] scale-up-center transition-all"
		class:opacity-0={!$fadeSequence.hero}
		class:opacity-100={$fadeSequence.hero}
	>
		<h1
			class="absolute leading-relaxed text-center text-xl bottom-1/4 left-1/2 -translate-x-1/2 md:bottom-4 m-auto items-center font-medium md:m-10 transition-opacity duration-500"
			class:opacity-0={!$fadeSequence.text}
			class:opacity-100={$fadeSequence.text}
		>
			<span class="pb-20">Bryant Mejia</span>
			<Typewriter
				mode={'loop'}
				delay={isFirstLoad ? 10000 : 1000}
				interval={70}
				unwriteInterval={60}
				showCursorOnDelay={false}
				wordInterval={Math.random() * 4 * 1000}
			>
				<span>Software Developer </span>
				<span>Full Stack Engineer </span>
				<span>Graphic Interface </span>
				<span>TDD </span>
				<span>On a mission... </span>
				<span>To Transform Data. </span>
				<span>Let's Build the Future. </span>
			</Typewriter>
		</h1>
		<img class="h-full object-cover" src={'/orbit.gif'} alt="Bryant Mejia" />
	</div>
</div>
