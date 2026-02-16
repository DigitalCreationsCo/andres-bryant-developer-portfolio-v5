import { error } from '@sveltejs/kit';
import { ProjectService, getInitialProjects, initialProjects } from '$lib/api/projects';
import { type Project, type ProjectDetail } from '$lib/types';
import { dev } from '$app/environment';
import type { EntryGenerator, PageServerLoad } from './$types';
import { GITHUB_API_KEY } from '$env/static/private';

/** @type {PageServerLoad} */
export async function load({ params, fetch }) {
	try {
		const apiKey = GITHUB_API_KEY;
		// Always fallback to static projects during prerender to avoid 404s
		let allProjects = initialProjects;

		// Try to get initial projects (with GitHub repos) if fetch is available
		if (fetch) {
			try {
				allProjects = await getInitialProjects(fetch, apiKey);
			} catch (fetchError) {
				console.warn('Failed to fetch GitHub repos, using static projects:', fetchError);
				// Use static projects as fallback
				allProjects = initialProjects;
			}
		}

		const project: Project | undefined = allProjects.find(
			(project) => project.slug === params.slug
		);

		if (project === undefined) throw error(404, 'Project not found');

		const projectService: ProjectService = new ProjectService(apiKey);
		const projectDetail: ProjectDetail = await projectService.fetchProjectDetail({
			project,
			fetch
		});
		const readmeContent: string | null = project.readmeUrl
			? await projectService.getProjectReadme({ project, fetch })
			: null;

		return { projectDetail: projectDetail, readmeContent: readmeContent };
	} catch (err) {
		console.error('Error in load function:', err);
		// If it's already a SvelteKit error, re-throw it
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Failed to load project');
	}
}

export const entries: EntryGenerator = async () => {
	// Fetch all projects (static and dynamic) for entries generation to ensure all routes are prerendered
	const apiKey = GITHUB_API_KEY; // Access API key for fetching
	const allProjects = await getInitialProjects(fetch, apiKey); // Use global fetch for prerendering
	return allProjects.map(({ slug }) => ({ slug }));
};
