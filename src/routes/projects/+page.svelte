<script lang="ts">
	import type { PageData } from './$types';
	import Portfolio from '$lib/components/sections/Portfolio.svelte';
	import { fade } from 'svelte/transition';
	import { ProjectService } from '$lib/api/projects/service';

	export let data: PageData;
	const projectService = new ProjectService();
</script>

<section class="grow" in:fade|local={{ duration: 1000 }} out:fade|local={{ duration: 50 }}>
	<Portfolio {fetch} {projectService} initialProjectsData={data.projects} />
</section>
