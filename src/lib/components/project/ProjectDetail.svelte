<script lang="ts">
	import type { ProjectDetail } from '$lib/types';
	import { marked } from 'marked';

	export let project: ProjectDetail;
	export let readmeContent: string | null = null;
	export let isLoadingReadme: boolean = false;

	const tags = project.tags.map((tag) => {
		return { key: tag, name: tag };
	});
</script>

<div class="w-full px-10 py-2 md:py-10 lg:pr-0 border-t-[11px] border-blue">
	<h1 class="text-[16px] mb-6 md:mb-8 lg:mb-12 xl:mb-16">{project.name}</h1>
	<!-- Hero section -->
	<div
		class="w-full flex flex-col lg:flex-row-reverse lg:justify-between gap-4 md:gap-8 lg:gap-12 mb-24 lg:mb-32"
	>
		<div class="w-full lg:mr-10">
			<!-- Image preview -->
			{#if project.imageUrl}
				<img class="w-full aspect-[2/1] object-cover" src={project.imageUrl} alt="Preview" />{/if}
		</div>

		<!-- Project description -->
		<div class="w-full">
			<p>{project.longDescription || project.description}</p>

			<!-- Stars, forks, downloads -->
			<!-- <div>
				<div class="flex gap-2 items-center">
					{project.starsCount}
					{(project.starsCount ?? 0) <= 1 ? 'Star' : 'Stars'}
				</div>
				<div class="flex gap-2 items-center">
					{project.forksCount}
					{(project.forksCount ?? 0) <= 1 ? 'Fork' : 'Forks'}
				</div>
				<div class="flex gap-2 items-center">
					{project.downloadsCount}
					{(project.downloadsCount ?? 0) <= 1 ? 'Download' : 'Downloads'}
				</div>
			</div> -->

			<!-- Tags -->
			<div class="flex flex-wrap w-full items-center gap-2 py-4 overflow-hidden">
				{#each tags as tag}
					<p
						class="dark:bg-slate-800 bg-slate-800 border-slate-800 dark:text-slate-300 dark:border-slate-300 px-2 sm:px-4 py-1 h-max border-2"
					>
						{tag.name}
					</p>
				{/each}
			</div>

			<!-- Buttons -->
			<div class="my-4 md:my-6 lg:my-8 flex w-full border justify-around md:gap-6 lg:gap-8">
				<a href={project.repositoryUrl} target="_blank" class="md:hover:text-blue">
					<button>Source code</button>
				</a>

				{#if project.hasLiveUrl && project.liveUrl}
					<a href={project.liveUrl} target="_blank" class="md:hover:text-blue">
						<button>Live preview</button>
					</a>
				{/if}
			</div>

			<div class="my-4 md:my-6 lg:my-8 flex w-full gap-4 md:gap-6 lg:gap-8">
				<a href="/projects">{`< Return`}</a>
			</div>
		</div>
	</div>
</div>

<!-- README.md -->
{#if readmeContent || isLoadingReadme}
	<hr class="mt-16 border border-slate-700 dark:border-slate-300" />
	<div class="w-full px-10 py-2 md:py-10 lg:pr-0">
		<h2 class="text-[16px] mb-6 md:mb-8 lg:mb-12">README</h2>
		{#if isLoadingReadme}
			<p class="text-slate-500">Loading README...</p>
		{:else if readmeContent}
			<div class="prose prose-slate dark:prose-invert max-w-none">
				{@html marked(readmeContent)}
			</div>
		{:else}
			<p class="text-slate-500">README not available for this project.</p>
		{/if}
	</div>
	<hr class="mb-16 md:mb-24 border border-slate-700 dark:border-slate-300" />
{/if}
