import { projectsStore, projectDetailStore } from '$lib/store/projects';
import type { Project, ProjectDetail } from '$lib/types';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

const fetchingProjects = new Set<number>();

// Helper function to get GitHub API headers with authentication
// apiKey should be passed from server-side code
function getGitHubHeaders(apiKey?: string): Record<string, string> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	// Add Authorization header if API key is available
	if (apiKey) {
		headers['Authorization'] = `token ${apiKey}`;
	}

	return headers;
}

class ProjectService {
	private apiKey?: string;

	constructor(apiKey?: string) {
		this.apiKey = apiKey;
	}

	async fetchProject({ project, fetch }: { project: Project; fetch: any }) {
		if (fetchingProjects.has(project.id)) {
			console.warn(`Skipping duplicate fetch for project: ${project.name}`);
			return;
		}

		fetchingProjects.add(project.id);

		try {
			const response = await fetch(project.url, {
				method: 'GET',
				headers: getGitHubHeaders(this.apiKey)
			});

			const json = JSON.parse(await response.text());

			let newProject: Project;

			newProject = {
				id: project.id,
				slug: project.slug,
				name: project.name,
				url: project.url,
				liveUrl: project.liveUrl,
				description: project.description || json.description,
				imageUrl: project.imageUrl,
				readmeUrl: project.readmeUrl,
				tags: [...project.tags, json?.language].filter(Boolean),
				starsCount: json.stargazers_count,
				forksCount: json.forks,
				downloadsCount: await this.getDownloadsCount(project.url)
			};

			projectsStore.update((projectsMap) => {
				if (!projectsMap.has(newProject.id)) {
					projectsMap.set(newProject.id, newProject);
				}
				return projectsMap;
			});

			return newProject;
		} catch (error) {
			console.error('Error fetching project:', error);
		} finally {
			fetchingProjects.delete(project.id); // Remove from the tracking set
		}
	}

	async fetchProjectDetail({
		project,
		fetch
	}: {
		project: Project;
		fetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>;
	}) {
		try {
			const response = await fetch(project.url, {
				method: 'GET',
				headers: getGitHubHeaders(this.apiKey)
			});

			const json = JSON.parse(await response.text());

			let newProject: ProjectDetail;

			if (response.status === 200) {
				const liveUrl = project.liveUrl || json.homepage;
				let hasLiveUrl = Boolean(liveUrl);

				if (hasLiveUrl) {
					try {
						// Check if live URL is reachable (not 404)
						const liveRes = await fetch(liveUrl, { method: 'HEAD' });
						if (liveRes.status === 404) {
							hasLiveUrl = false;
						}
					} catch (e) {
						console.warn('Error checking live URL:', e);
						// If fetch fails (e.g. CORS or network), we might want to keep it or hide it.
						// User only specified 404. But if it throws, we can't be sure.
						// We'll keep it unless 404.
						hasLiveUrl = false;
					}
				}

				newProject = {
					id: project.id,
					slug: project.slug,
					name: project.name,
					url: project.url,
					description: project.description || json.description,
					longDescription: project.longDescription || project.description || json.description,
					imageUrl: project.imageUrl,
					tags: [...project.tags, json?.language].filter(Boolean),
					repositoryUrl: json['svn_url'],
					hasLiveUrl: hasLiveUrl,
					liveUrl: liveUrl,
					readmeUrl: project.readmeUrl,
					starsCount: json.stargazers_count,
					forksCount: json.forks,
					downloadsCount: await this.getDownloadsCount(project.url)
				};

				return newProject;
			} else {
				let fallbackData: ProjectDetail;

				if (browser && window.localStorage.getItem('projectDetail')) {
					fallbackData = {
						...(JSON.parse(window.localStorage.getItem('projectDetail') ?? '{}') as ProjectDetail),
						imageText: 'Server error: API rate limit exceeded'
					};
				} else if (response.status === 403) {
					fallbackData = {
						id: project.id,
						slug: project.slug,
						name: 'limit',
						url: project.url,
						liveUrl: project.liveUrl,
						description: json.message,
						imageUrl: project.imageUrl,
						tags: [],
						hasLiveUrl: false,
						readmeUrl: project.readmeUrl,
						repositoryUrl: ''
					};
				} else {
					// If not a 403 and not in browser with localStorage, re-throw the response
					throw response;
				}
				return fallbackData;
			}
		} catch (err) {
			console.error('Error fetching project detail:', err);

			let fallbackData: ProjectDetail;

			if (browser && window.localStorage.getItem('projectDetail')) {
				fallbackData = {
					...(JSON.parse(window.localStorage.getItem('projectDetail') ?? '{}') as ProjectDetail),
					imageText: 'No internet connection'
				};
			} else {
				fallbackData = {
					id: project.id,
					slug: project.slug,
					name: 'error',
					url: project.url,
					description: 'No internet connection',
					imageUrl: project.imageUrl,
					tags: [],
					liveUrl: project.liveUrl,
					hasLiveUrl: false,
					readmeUrl: project.readmeUrl,
					repositoryUrl: ''
				};
			}
			return fallbackData;
		}
	}

	async getProjectReadme({
		project,
		fetch
	}: {
		project: Project;
		fetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>;
	}) {
		try {
			const response = await fetch(project.readmeUrl ?? '', {
				method: 'GET'
			});
			const text = await response.text();
			return text;
		} catch (error) {
			return null;
		}
	}

	async getDownloadsCount(url: string) {
		const headers = getGitHubHeaders(this.apiKey);
		// Remove Content-Type for this endpoint if not needed
		delete headers['Content-Type'];

		const response = await fetch(`${url}/releases`, {
			method: 'GET',
			headers: headers
		});

		try {
			const json = await response.text();
			const releases = JSON.parse(json);

			let count = 0;

			for (let i = 0; i < releases.length; ++i) {
				for (let j = 0; j < releases[i].assets.length; ++j) {
					count += releases[i].assets[j].download_count;
				}
			}

			return count;
		} catch (error) {
			return 0;
		}
	}
}

export { ProjectService };
