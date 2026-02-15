import type { Project } from '$lib/types';

/**
 * WHY DO I GET 'error: fetch is not a function' IN SVELTE/SVELTEKIT?
 *
 * This error happens if you try to use a variable named `fetch`
 * that is `undefined`, or not a function, when running code in
 * Node or the browser. In SvelteKit, there are usually two
 * kinds of situations:
 *
 *   1. On the server, in +page.server.ts or +layout.server.ts "load" functions,
 *      SvelteKit provides a `fetch` function as an argument to your load function.
 *      If you pass that fetch along, you must pass it everywhere that needs it.
 *      If you forget, you'll pass `undefined` as fetch, and calling it fails.
 *
 *   2. On the client (browser), the global `window.fetch` is always available.
 *      So if you call your API code from the browser and don't pass `fetch`, you should
 *      default to `window.fetch` (or just `fetch`), otherwise you get the error.
 *
 * To fix this, use this pattern in your API code:
 *   - Accept `fetch?: typeof window.fetch`, mark it as optional in your function signature.
 *   - When it's not passed, default to the global `fetch`.
 *   - When calling from server code, always pass the provided fetch.
 *   - When calling from browser code, it's ok to leave it out.
 */

const githubApiLink = 'https://api.github.com/repos/digitalcreationsco';
const githubUserApiLink = 'https://api.github.com/users/digitalcreationsco';
const githubUsername = 'digitalcreationsco';

// Helper function to get GitHub API headers with authentication
function getGitHubHeaders(apiKey?: string): Record<string, string> {
	const headers: Record<string, string> = {
		Accept: 'application/vnd.github.v3+json, application/vnd.github.mercy-preview+json' // Add topics preview media type
	};
	if (apiKey) {
		headers['Authorization'] = `token ${apiKey}`;
	}
	return headers;
}

interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	language: string | null;
	stargazers_count: number;
	forks: number;
	updated_at: string;
	default_branch: string;
	topics: string[] | null; // Add topics to the interface
}

// Accepts an optional fetch param; falls back to global fetch for browser or node >=18
async function fetchGitHubRepos(
	fetchParam?: typeof globalThis.fetch,
	apiKey?: string
): Promise<GitHubRepo[]> {
	const fetchFn: typeof globalThis.fetch =
		fetchParam ||
		(typeof window !== 'undefined' && window.fetch) ||
		(typeof globalThis !== 'undefined' && (globalThis as any).fetch);

	if (!fetchFn) {
		console.error(
			'fetch is not available: provide fetch as argument, or ensure global fetch (Node >=18 or browser runtime)'
		);
		return [];
	}

	try {
		const response = await fetchFn(
			`${githubUserApiLink}/repos?sort=pushed&direction=desc&per_page=100`,
			{
				method: 'GET',
				headers: getGitHubHeaders(apiKey)
			}
		);

		if (!response.ok) {
			const error = new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
			if (response.status === 403) {
				console.warn('GitHub API rate limit may have been exceeded');
			}
			throw error;
		}

		const text = await response.text();
		if (!text) {
			return [];
		}

		try {
			const reposNotAllowed = [
				githubUsername.toLocaleLowerCase(),
				'food-delivery-app-react-native'.toLocaleLowerCase(),
				'mcp-directory'.toLocaleLowerCase()
			];
			const repos: GitHubRepo[] = JSON.parse(text);
			const filteredRepos = Array.isArray(repos)
				? repos.filter((repo) => !reposNotAllowed.includes(repo.name.toLowerCase()))
				: [];
			return filteredRepos;
		} catch (parseError) {
			console.error('Failed to parse GitHub API response:', parseError);
			return [];
		}
	} catch (error) {
		console.warn('Error fetching GitHub repos:', error);
		throw error;
	}
}

function transformGitHubRepoToProject(repo: GitHubRepo): Project {
	const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
	const branch = repo.default_branch || 'main';
	const possibleImagePaths = [
		`preview.png`,
		`${repo.name}-preview.png`,
		`${repo.name.toLowerCase()}-preview.png`,
		`preview.jpg`,
		`screenshot.png`,
		`image-preview.png`
	];
	const imageUrl = `https://raw.githubusercontent.com/${repo.full_name}/${branch}/${possibleImagePaths[0]}`;
	const readmeUrl = `https://raw.githubusercontent.com/${repo.full_name}/${branch}/README.md`;

	return {
		id: repo.id,
		slug,
		name: repo.name,
		url: `${githubApiLink}/${repo.name}`,
		liveUrl: repo.homepage || '',
		description: repo.description || '',
		imageUrl,
		readmeUrl,
		tags: Array.from(new Set([...(repo.language ? [repo.language] : []), ...(repo.topics || [])])),
		updatedAt: repo.updated_at // Map GitHub's updated_at
	};
}

// Static projects list for fallback/compat
const staticProjects: Project[] = [];

// This function now supports optional fetch param
async function getInitialProjects(
	fetchParam?: typeof globalThis.fetch,
	apiKey?: string
): Promise<Project[]> {
	try {
		const repos = await fetchGitHubRepos(fetchParam, apiKey);
		if (repos && repos.length > 0) {
			const recentRepos = repos.map((repo) => transformGitHubRepoToProject(repo));
			return recentRepos;
		}
	} catch (error) {
		console.warn('Error in getInitialProjects:', error);
	}
	return [];
}

async function getRecentGitHubReposAsProjects(
	fetchParam?: typeof globalThis.fetch,
	apiKey?: string,
	limit: number = 100
): Promise<Project[]> {
	let githubProjects: Project[] = [];

	try {
		const repos = await fetchGitHubRepos(fetchParam, apiKey);
		if (repos && repos.length > 0) {
			githubProjects = repos.slice(0, limit).map((repo) => transformGitHubRepoToProject(repo));
		}
	} catch (error) {
		console.warn('Error in getRecentGitHubReposAsProjects:', error);
		return [
			{
				id: 0,
				name: 'error',
				description: 'Could not fetch projects. Please try again later.',
				slug: '',
				url: '',
				liveUrl: '',
				imageUrl: '',
				readmeUrl: '',
				tags: [],
				updatedAt: ''
			}
		];
	}

	// Create a map to store unique projects, prioritizing GitHub projects
	const combinedProjectsMap = new Map<number, Project>();

	// Add GitHub projects first
	githubProjects.forEach((p) => combinedProjectsMap.set(p.id, p));

	// Convert map back to array and sort by updatedAt in descending order (most recent first)
	const finalProjects = Array.from(combinedProjectsMap.values()).sort((a, b) => {
		const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
		const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
		return dateB - dateA; // Descending order
	});

	return finalProjects.slice(0, limit);
}

// Get all GitHub repos as projects (kept for backward compatibility)
async function getAllGitHubReposAsProjects(
	fetchParam?: typeof globalThis.fetch,
	apiKey?: string
): Promise<Project[]> {
	return getRecentGitHubReposAsProjects(fetchParam, apiKey, 100);
}

// For backward compatibility
const initialProjects: Project[] = [];

export {
	initialProjects,
	fetchGitHubRepos,
	transformGitHubRepoToProject,
	getInitialProjects,
	getAllGitHubReposAsProjects,
	getRecentGitHubReposAsProjects
};
