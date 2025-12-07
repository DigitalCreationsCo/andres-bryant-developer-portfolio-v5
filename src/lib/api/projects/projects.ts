import type { Project } from 
'$lib/types';

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
		'Accept': 'application/vnd.github.v3+json, application/vnd.github.mercy-preview+json' // Add topics preview media type
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
			console.warn(
				`GitHub API returned ${response.status}: ${response.statusText}`
			);
			if (response.status === 403) {
				console.warn('GitHub API rate limit may have been exceeded');
			}
			return [];
		}

		const text = await response.text();
		if (!text) {
			return [];
		}

		try {
			const reposNotAllowed = [
				githubUsername.toLocaleLowerCase(),
				"food-delivery-app-react-native".toLocaleLowerCase(),
				"mcp-directory".toLocaleLowerCase(),
			]
			const repos: GitHubRepo[] = JSON.parse(text);
			const filteredRepos = Array.isArray(repos)
				? repos.filter(repo => !reposNotAllowed.includes(repo.name.toLowerCase()))
				: [];
			return filteredRepos;
		} catch (parseError) {
			console.error('Failed to parse GitHub API response:', parseError);
			return [];
		}
	} catch (error) {
		console.error('Error fetching GitHub repos:', error);
		return [];
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
const staticProjects: Project[] = [
	{
		id: 5,
		slug: 'supply-chain-optimizer',
		name: 'Supply Chain Optimizer Application',
		url: `${githubApiLink}/Supply-Chain-Optimizer-Angular`,
		liveUrl: 'https://optimize-supply-chain.netlify.app/',
		description: 'Costs and emissions analysis for supply chain built using Angular 19.',
		longDescription: 'This Angular application helps track and analyze costs and emissions for supply chain routes. It allows users to calculate total emissions based on geographic data and transportation segments.',
		imageUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/Supply-Chain-Optimizer-Angular/refs/heads/main/supply-chain-optimizer-image-preview.png',
		readmeUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/Supply-Chain-Optimizer-Angular/refs/heads/main/README.md',
		tags: ['Angular', 'Analytics', 'Reactive'],
		updatedAt: '2024-03-10T12:00:00Z' // Example date, adjust as needed
	},
	{
		id: 0,
		slug: 'tonestar',
		name: 'Tonestar',
		url: `${githubApiLink}/tonestar`,
		liveUrl: `https://tonestar-music.vercel.app`,
		description: `Tonestar is an AI music composition and generation platform, allowing users to create unique musical pieces and collaborate with other artists. It provides tools for exploring various genres, instruments, and compositional techniques, fostering creativity and musical innovation.`,
		longDescription: `Tonestar is an AI music composition and generation platform, allowing users to create unique musical pieces and collaborate with other artists. It provides tools for exploring various genres, instruments, and compositional techniques, fostering creativity and musical innovation. The platform leverages advanced machine learning models to assist in generating melodies, harmonies, and rhythms, enabling users to effortlessly bring their musical ideas to life.`,
		imageUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/tonestar/refs/heads/master/tonestar-image-preview.png',
		readmeUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/tonestar/refs/heads/master/README.md',
		tags: ['Artificial Intelligence', 'User-Generated Content', 'Audio Playblack'],
		updatedAt: '2024-02-15T12:00:00Z'
	},
	{
		id: 1,
		slug: 'tiny-mail',
		name: 'Tiny Mail',
		url: `${githubApiLink}/TinyMail`,
		liveUrl: `https://tiny-mail.vercel.app`,
		description: 'Tiny Mail is an application designed to streamline email creation and customization using user-created templates',
		longDescription: `Tiny Mail is an application designed to streamline email creation and customization using user-created templates. With integrations for Google Sheets and OAuth2-powered authentication, Tiny Mail enables users to automate their outgoing email workflows efficiently. Whether you're managing newsletters, email series, or one-off communications, Tiny Mail provides the tools you need to produce hassle-free email content.`,
		imageUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/TinyMail/refs/heads/main/public/tiny-mail-image-preview.png',
		readmeUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/TinyMail/refs/heads/main/README.md',
		tags: ['Email', 'Editor', 'UGC', 'React', 'Multi Tenant'],
		updatedAt: '2024-01-20T12:00:00Z'
	},
	{
		id: 3,
		slug: 'gras-retail-saas',
		name: 'Gras Retail Business Application',
		url: `${githubApiLink}/cannabis-platform-monorepo`,
		liveUrl: 'https://app.gras.live',
		description: 'Retail marketing SaaS platform. The architecture is distributed microservices hosted in a Google Cloud container cluster. Scalable services feature Load Balancing, Ingress Controller, and feature-rich edge API Gateway for efficiently routing high traffic load.',
		longDescription: `Retail marketing SaaS platform. The architecture is distributed microservices hosted in a Google Cloud container cluster. Scalable services feature Load Balancing, Ingress Controller, and feature-rich edge API Gateway for efficiently routing high traffic load. 
The platform is designed for scalability, utilizing load balancing, an ingress controller, and a feature-rich edge API Gateway to efficiently manage high traffic volumes and ensure seamless routing between services. 
The project implements Terraform modules to automate provisioning and management of cloud resources.  
The codebase follows a monorepo structure, promoting consistency and simplifying dependency management across microservices, while reusable code modules ensure maintainability and reduce duplication.  
Typescript is used throughout the application, providing static typing to improve code quality, reduce runtime errors, and enhance developer productivity through better tooling and IDE support.`,
		imageUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/cannabis-platform-monorepo/refs/heads/production/static/assets/images/gras-image-preview.png',
		readmeUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/cannabis-platform-monorepo/refs/heads/production/README.md?token=GHSAT0AAAAAAC24QLMWQKWAW7WEY66ISALSZ2JOQ4A',
		tags: ['SaaS', 'React', 'Microservices'],
		updatedAt: '2023-11-01T12:00:00Z'
	},
	{
		id: 2,
		slug: 'web-form',
		name: 'Web Form Showcase',
		url: `${githubApiLink}/welcome-form`,
		liveUrl: 'https://welcomeform.netlify.app',
		description: 'A simple and effective web form solution using modern web technologies, built with React and Next.js.',
		longDescription: `This project demonstrates a simple and effective web form solution using modern web technologies, built with React and Next.js. It showcases advanced form handling techniques, including validation, dynamic rendering, and user interactions. The form state is persisted using React Context API.`,
		imageUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/welcome-form/refs/heads/main/web-form-image-preview.png',
		readmeUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/welcome-form/refs/heads/main/README.md',
		tags: ['Form', 'Frontend', 'React'],
		updatedAt: '2023-10-10T12:00:00Z'
	},
	{
		id: 3,
		slug: 'ml-concepts-explorer',
		name: 'Machine Learning Concepts Explorer',
		url: `${githubApiLink}/ml-concepts-explorer`,
		liveUrl: 'https://ml-concepts-explorer-sff2.vercel.app',
		description: 'Machine Learning Concepts Explorer is a React application that provides explanations of various ML/DL concepts using animations and interactive elements.',
		imageUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/ml-concepts-explorer/refs/heads/main/ml-concepts-explorer-image-preview.png',
		readmeUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/ml-concepts-explorer/refs/heads/main/README.md',
		tags: ['Machine Learning', 'Artificial Intelligence', 'React'],
		updatedAt: '2023-09-05T12:00:00Z'
	},
	{
		id: 4,
		slug: 'parallax-scroll',
		name: 'Parallax Scroll Demo',
		url: `${githubApiLink}/motion-scroll`,
		liveUrl: 'https://parallaxscrolldemonstration.netlify.app',
		description: 'This project is a Parallax Scrolling and Snap Scroll Animation Demo, showcasing modern web design and animation techniques.',
		longDescription: `This project is a Parallax Scrolling and Snap Scroll Animation Demo, showcasing modern web design and animation techniques. It presents a visually engaging futuristic theme centered around "Metal" concepts, portraying innovation, technology, and digital transformation. The user experience is emphasized by the parallax scrolling effects, creating an intuitive and dynamic storytelling format`,
		imageUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/motion-scroll/refs/heads/main/8.jpg',
		readmeUrl:
			'https://raw.githubusercontent.com/DigitalCreationsCo/motion-scroll/refs/heads/main/README.md',
		tags: ['Html', 'Css', 'Motion', 'Animation'],
		updatedAt: '2023-08-01T12:00:00Z'
	},
	{
		id: 6,
		slug: 'portfolio-v5',
		name: 'Bryant Mejia Portfolio',
		url: `${githubApiLink}/bryant-mejia-portfolio-svelte`,
		liveUrl: 'https://bryantmejia.com',
		description: 'Bryant Mejia developer portfolio website built using SvelteKit.',
		longDescription: 'This project is a **personal portfolio website** built using **SvelteKit**, a modern framework for building highly optimized web applications. It showcases my professional experience, projects, skills, and contact information in a responsive design. The goal of this portfolio is to effectively present my work and leave a lasting impression on visitors, including potential employers.',
		imageUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/bryant-mejia-portfolio-svelte/refs/heads/main/static/bryant-mejia-portfolio-image-preview.png',
		readmeUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/bryant-mejia-portfolio-svelte/refs/heads/main/README.md',
		tags: ['Html', 'Svelte', 'SSR', 'Frontend'],
		updatedAt: '2023-07-25T12:00:00Z'
	},
];

// This function now supports optional fetch param
async function getInitialProjects(fetchParam?: typeof globalThis.fetch, apiKey?: string): Promise<Project[]> {
	try {
		const repos = await fetchGitHubRepos(fetchParam, apiKey);
		if (repos && repos.length > 0) {
			const recentRepos = repos.map(repo => transformGitHubRepoToProject(repo));
			return [...recentRepos, ...staticProjects];
		}
	} catch (error) {
		console.error('Error in getInitialProjects, falling back to static projects:', error);
	}
	return staticProjects;
}

async function getRecentGitHubReposAsProjects(fetchParam?: typeof globalThis.fetch, apiKey?: string, limit: number = 6): Promise<Project[]> {
	let githubProjects: Project[] = [];

	try {
		const repos = await fetchGitHubRepos(fetchParam, apiKey);
		if (repos && repos.length > 0) {
			githubProjects = repos.slice(0, limit).map(repo => transformGitHubRepoToProject(repo));
		}
	} catch (error) {
		console.error('Error in getRecentGitHubReposAsProjects:', error);
	}

	// Create a map to store unique projects, prioritizing GitHub projects
	const combinedProjectsMap = new Map<number, Project>();

	// Add GitHub projects first
	githubProjects.forEach(p => combinedProjectsMap.set(p.id, p));

	// Fill remaining slots with static projects, avoiding duplicates already present from GitHub
	// And ensure that we don't add more projects than the limit
	for (const staticProject of staticProjects) {
		if (combinedProjectsMap.size < limit && !combinedProjectsMap.has(staticProject.id)) {
			combinedProjectsMap.set(staticProject.id, staticProject);
		}
	}

	// Convert map back to array and sort by updatedAt in descending order (most recent first)
	const finalProjects = Array.from(combinedProjectsMap.values()).sort((a, b) => {
		const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
		const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
		return dateB - dateA; // Descending order
	});

	return finalProjects.slice(0, limit);
}

// Get all GitHub repos as projects (kept for backward compatibility)
async function getAllGitHubReposAsProjects(fetchParam?: typeof globalThis.fetch, apiKey?: string): Promise<Project[]> {
	return getRecentGitHubReposAsProjects(fetchParam, apiKey, 100);
}

// For backward compatibility
const initialProjects = staticProjects;

export {
	initialProjects,
	fetchGitHubRepos,
	transformGitHubRepoToProject,
	getInitialProjects,
	getAllGitHubReposAsProjects,
	getRecentGitHubReposAsProjects
};
