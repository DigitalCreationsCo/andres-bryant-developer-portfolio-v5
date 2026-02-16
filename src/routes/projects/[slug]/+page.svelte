<script lang="ts">
	import type { PageData } from './$types';
	import ProjectDetail from '$lib/components/project/ProjectDetail.svelte';
	import ProjectDetailError from '$lib/components/project/ProjectDetailError.svelte';
	import ProjectDetailLoading from '$lib/components/project/ProjectDetailLoading.svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;
	
	const { projectDetail, readmeContent } = data;
	const isLoadingReadme = false; // Readme is now fetched server-side

</script>

<svelte:head>
	<title>{projectDetail.name}</title>
</svelte:head>

<section class="grow" in:fade|local={{ duration: 1000 }} out:fade|local={{ duration: 50 }}>
	{#if !projectDetail}
		<ProjectDetailLoading />
	{:else if projectDetail.name !== 'error' && projectDetail.name !== 'limit'}
		<ProjectDetail project={projectDetail} {readmeContent} {isLoadingReadme} />
	{:else}
		<ProjectDetailError project={projectDetail} />
	{/if}
</section>