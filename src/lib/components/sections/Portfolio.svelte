<script lang="ts">
	import {
		type ProjectService,
		getRecentGitHubReposAsProjects,
		initialProjects
	} from '$lib/api/projects';
	import { projectsStore, projects } from '$lib/store/projects';
	import ProjectCard from '$lib/components/cards/ProjectCard.svelte';
	import ProjectCardLoading from '$lib/components/cards/ProjectCardLoading.svelte';
	import ProjectCardError from '$lib/components/cards/ProjectCardError.svelte';
	import Saos from 'saos';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Project } from '$lib/types';

	export let fetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>;
	export let projectService: ProjectService;
	export let initialProjectsData: Project[] = [];

	/**
	 * Make a writable variable for the UI list
	 * Whenever the $projects store updates, this will update.
	 * Rely on the $projects array, which reflects the values of projectsStore.
	 * Force the $projects array to always update when the underlying Map changes.
	 */

	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			const currentUrl = $page.url.pathname;
			sessionStorage.setItem('lastUrl', currentUrl);
		});

		// Initialize with projects from the server, or static projects if none are provided
		const initialData = initialProjectsData.length > 0 ? initialProjectsData : initialProjects;
		projectsStore.set(new Map(initialData.map((project) => [project.id, project])));

		return () => {
			unsubscribe();
		};
	});

	let isIntersecting = false;

	// Utility to refresh the projectsStore so that the $projects array UI updates
	function forceProjectsArrayUpdate() {
		projectsStore.update((map) => new Map(map));
	}

	// Fetch projects when this section is appeared
	function checkIntersecting(node: Element) {
		const observer: IntersectionObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;

				setTimeout(async () => {
					console.log('Fetching 6 most recent GitHub repositories');

					try {
						// Fetch 6 most recent GitHub repos dynamically
						const githubProjects = await getRecentGitHubReposAsProjects(fetch, undefined, 6);
						console.log('githubProjects:', githubProjects);

						if (githubProjects && githubProjects.length > 0) {
							// Fetch details for each project and collect up-to-date Project objects
							const rawMap = new Map();
							for (const project of githubProjects) {
								try {
									const detailResult = await projectService.fetchProject({ project, fetch });

									// Accept detailResult as either a project or undefined (void)
									if (detailResult && detailResult.id) {
										rawMap.set(detailResult.id, detailResult);
									}
								} catch (_) {
									continue;
								}
							}

							// Force replace the projects store (to guarantee a new state and UI update)
							projectsStore.update((_prev) => {
								const merged = new Map(_prev);
								// Give fetched projects priority
								for (const [id, p] of rawMap) {
									merged.set(id, p);
								}
								return merged;
							});
							forceProjectsArrayUpdate(); // ensure $projects updates
						} else {
							console.warn('No GitHub repositories found or API request failed');
						}
					} catch (error) {
						console.error('Error fetching GitHub repos:', error);
					}

					isIntersecting = true;
					observer.disconnect();
				}, 500);
			});
		});

		if (!isIntersecting) {
			observer.observe(node);
		}
	}
</script>

<div use:checkIntersecting class="px-10 py-2 md:p-10 mx-auto border-t-[11px] border-blue">
	<div class="flex flex-col max-w-4xl mx-auto">
		{#if $projects.length === 0}
			<ProjectCardLoading />
		{:else if $projects.length === 1 && ($projects[0].name === 'error' || $projects[0].name === 'limit')}
			<ProjectCardError project={$projects[0]} />
		{:else}
			<!-- The key block below forces the #each block to refresh if array changes (esp. after Map replacement) -->
			{#key $projects}
				{#each $projects as project (project.id)}
					<ProjectCard {project} />
				{/each}
			{/key}
		{/if}
	</div>
</div>
