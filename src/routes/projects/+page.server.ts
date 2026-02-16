import type { PageServerLoad } from './$types';
import { getRecentGitHubReposAsProjects } from '$lib/api/projects/projects';
import { GITHUB_API_KEY } from '$env/static/private'; // Import static API key for prerendering

export const load: PageServerLoad = async ({ fetch }) => {
	let apiKey: string | undefined = undefined;

	// Use static API key for prerendering
	apiKey = GITHUB_API_KEY;

	const projects = await getRecentGitHubReposAsProjects(fetch, apiKey, 7);

	return {
		projects: projects
	};
};
