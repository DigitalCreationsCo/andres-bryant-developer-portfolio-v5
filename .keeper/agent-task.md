# 🤖 Keeper Agent Task

## Task
Update the following documentation files to reflect recent code changes:
README.md

## Scope of Work
You are strictly limited to the following actions:
1. **Update Documentation**: Modify the documentation files to accurately reflect the code changes.
2. **Follow Commit Instructions**: Adhere to the commit instruction provided at the end of this task.

**IMPORTANT**: Do not perform any other actions. Do not diagnose issues, suggest other code changes, or try to fix anything that is not directly related to the documentation update. If no documentation updates are needed, simply complete the task without making any changes.

## Instructions
1. Analyze the code changes below
2. Update the documentation to reflect:
   - New features or functions added
   - Modified APIs or interfaces
   - Changed dependencies or requirements
   - Updated installation or usage instructions
3. Maintain the existing tone and structure
4. Be concise but complete
5. After completing this task, run: git add . {{COMMIT_INSTRUCTION}}{{COMMIT_INSTRUCTION}} git commit -m "docs: update documentation"

---

## Changed Files
```
'src/lib/api/projects/projects.tsn''src/lib/api/projects/service.tsn''src/lib/components/sections/Portfolio.svelten''src/lib/types/types.tsn'```

## Code Changes
```diff
diff --git a/src/lib/api/projects/projects.ts b/src/lib/api/projects/projects.ts
index 59ddea1..fe082a0 100644
--- a/src/lib/api/projects/projects.ts
+++ b/src/lib/api/projects/projects.ts
@@ -1,4 +1,5 @@
-import type { Project } from '$lib/types';
+import type { Project } from 
+'$lib/types';
 
 /**
  * WHY DO I GET 'error: fetch is not a function' IN SVELTE/SVELTEKIT?
@@ -134,7 +135,8 @@ function transformGitHubRepoToProject(repo: GitHubRepo): Project {
 		description: repo.description || '',
 		imageUrl,
 		readmeUrl,
-		tags: Array.from(new Set([...(repo.language ? [repo.language] : []), ...(repo.topics || [])])) // Include language and topics, remove duplicates
+		tags: Array.from(new Set([...(repo.language ? [repo.language] : []), ...(repo.topics || [])])),
+		updatedAt: repo.updated_at // Map GitHub's updated_at
 	};
 }
 
@@ -150,7 +152,8 @@ const staticProjects: Project[] = [
 		longDescription: 'This Angular application helps track and analyze costs and emissions for supply chain routes. It allows users to calculate total emissions based on geographic data and transportation segments.',
 		imageUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/Supply-Chain-Optimizer-Angular/refs/heads/main/supply-chain-optimizer-image-preview.png',
 		readmeUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/Supply-Chain-Optimizer-Angular/refs/heads/main/README.md',
-		tags: ['Angular', 'Analytics', 'Reactive']
+		tags: ['Angular', 'Analytics', 'Reactive'],
+		updatedAt: '2024-03-10T12:00:00Z' // Example date, adjust as needed
 	},
 	{
 		id: 0,
@@ -158,11 +161,12 @@ const staticProjects: Project[] = [
 		name: 'Tonestar',
 		url: `${githubApiLink}/tonestar`,
 		liveUrl: `https://tonestar-music.vercel.app`,
-		description: ``,
-		longDescription: ``,
+		description: `Tonestar is an AI music composition and generation platform, allowing users to create unique musical pieces and collaborate with other artists. It provides tools for exploring various genres, instruments, and compositional techniques, fostering creativity and musical innovation.`,
+		longDescription: `Tonestar is an AI music composition and generation platform, allowing users to create unique musical pieces and collaborate with other artists. It provides tools for exploring various genres, instruments, and compositional techniques, fostering creativity and musical innovation. The platform leverages advanced machine learning models to assist in generating melodies, harmonies, and rhythms, enabling users to effortlessly bring their musical ideas to life.`,
 		imageUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/tonestar/refs/heads/master/tonestar-image-preview.png',
 		readmeUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/tonestar/refs/heads/master/README.md',
-		tags: ['Artificial Intelligence', 'User-Generated Content', 'Audio Playblack']
+		tags: ['Artificial Intelligence', 'User-Generated Content', 'Audio Playblack'],
+		updatedAt: '2024-02-15T12:00:00Z'
 	},
 	{
 		id: 1,
@@ -176,7 +180,8 @@ const staticProjects: Project[] = [
 			'https://raw.githubusercontent.com/DigitalCreationsCo/TinyMail/refs/heads/main/public/tiny-mail-image-preview.png',
 		readmeUrl:
 			'https://raw.githubusercontent.com/DigitalCreationsCo/TinyMail/refs/heads/main/README.md',
-		tags: ['Email', 'Editor', 'UGC', 'React', 'Multi Tenant']
+		tags: ['Email', 'Editor', 'UGC', 'React', 'Multi Tenant'],
+		updatedAt: '2024-01-20T12:00:00Z'
 	},
 	{
 		id: 3,
@@ -194,7 +199,8 @@ Typescript is used throughout the application, providing static typing to improv
 			'https://raw.githubusercontent.com/DigitalCreationsCo/cannabis-platform-monorepo/refs/heads/production/static/assets/images/gras-image-preview.png',
 		readmeUrl:
 			'https://raw.githubusercontent.com/DigitalCreationsCo/cannabis-platform-monorepo/refs/heads/production/README.md?token=GHSAT0AAAAAAC24QLMWQKWAW7WEY66ISALSZ2JOQ4A',
-		tags: ['SaaS', 'React', 'Microservices']
+		tags: ['SaaS', 'React', 'Microservices'],
+		updatedAt: '2023-11-01T12:00:00Z'
 	},
 	{
 		id: 2,
@@ -208,7 +214,8 @@ Typescript is used throughout the application, providing static typing to improv
 			'https://raw.githubusercontent.com/DigitalCreationsCo/welcome-form/refs/heads/main/web-form-image-preview.png',
 		readmeUrl:
 			'https://raw.githubusercontent.com/DigitalCreationsCo/welcome-form/refs/heads/main/README.md',
-		tags: ['Form', 'Frontend', 'React']
+		tags: ['Form', 'Frontend', 'React'],
+		updatedAt: '2023-10-10T12:00:00Z'
 	},
 	{
 		id: 3,
@@ -221,7 +228,8 @@ Typescript is used throughout the application, providing static typing to improv
 			'https://raw.githubusercontent.com/DigitalCreationsCo/ml-concepts-explorer/refs/heads/main/ml-concepts-explorer-image-preview.png',
 		readmeUrl:
 			'https://raw.githubusercontent.com/DigitalCreationsCo/ml-concepts-explorer/refs/heads/main/README.md',
-		tags: ['Machine Learning', 'Artificial Intelligence', 'React']
+		tags: ['Machine Learning', 'Artificial Intelligence', 'React'],
+		updatedAt: '2023-09-05T12:00:00Z'
 	},
 	{
 		id: 4,
@@ -235,7 +243,8 @@ Typescript is used throughout the application, providing static typing to improv
 			'https://raw.githubusercontent.com/DigitalCreationsCo/motion-scroll/refs/heads/main/8.jpg',
 		readmeUrl:
 			'https://raw.githubusercontent.com/DigitalCreationsCo/motion-scroll/refs/heads/main/README.md',
-		tags: ['Html', 'Css', 'Motion', 'Animation']
+		tags: ['Html', 'Css', 'Motion', 'Animation'],
+		updatedAt: '2023-08-01T12:00:00Z'
 	},
 	{
 		id: 6,
@@ -247,7 +256,8 @@ Typescript is used throughout the application, providing static typing to improv
 		longDescription: 'This project is a **personal portfolio website** built using **SvelteKit**, a modern framework for building highly optimized web applications. It showcases my professional experience, projects, skills, and contact information in a responsive design. The goal of this portfolio is to effectively present my work and leave a lasting impression on visitors, including potential employers.',
 		imageUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/bryant-mejia-portfolio-svelte/refs/heads/main/static/bryant-mejia-portfolio-image-preview.png',
 		readmeUrl: 'https://raw.githubusercontent.com/DigitalCreationsCo/bryant-mejia-portfolio-svelte/refs/heads/main/README.md',
-		tags: ['Html', 'Svelte', 'SSR', 'Frontend']
+		tags: ['Html', 'Svelte', 'SSR', 'Frontend'],
+		updatedAt: '2023-07-25T12:00:00Z'
 	},
 ];
 
@@ -266,15 +276,39 @@ async function getInitialProjects(fetchParam?: typeof globalThis.fetch, apiKey?:
 }
 
 async function getRecentGitHubReposAsProjects(fetchParam?: typeof globalThis.fetch, apiKey?: string, limit: number = 6): Promise<Project[]> {
+	let githubProjects: Project[] = [];
+
 	try {
 		const repos = await fetchGitHubRepos(fetchParam, apiKey);
 		if (repos && repos.length > 0) {
-			return repos.slice(0, limit).map(repo => transformGitHubRepoToProject(repo));
+			githubProjects = repos.slice(0, limit).map(repo => transformGitHubRepoToProject(repo));
 		}
 	} catch (error) {
 		console.error('Error in getRecentGitHubReposAsProjects:', error);
 	}
-	return [];
+
+	// Create a map to store unique projects, prioritizing GitHub projects
+	const combinedProjectsMap = new Map<number, Project>();
+
+	// Add GitHub projects first
+	githubProjects.forEach(p => combinedProjectsMap.set(p.id, p));
+
+	// Fill remaining slots with static projects, avoiding duplicates already present from GitHub
+	// And ensure that we don't add more projects than the limit
+	for (const staticProject of staticProjects) {
+		if (combinedProjectsMap.size < limit && !combinedProjectsMap.has(staticProject.id)) {
+			combinedProjectsMap.set(staticProject.id, staticProject);
+		}
+	}
+
+	// Convert map back to array and sort by updatedAt in descending order (most recent first)
+	const finalProjects = Array.from(combinedProjectsMap.values()).sort((a, b) => {
+		const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
+		const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
+		return dateB - dateA; // Descending order
+	});
+
+	return finalProjects.slice(0, limit);
 }
 
 // Get all GitHub repos as projects (kept for backward compatibility)
@@ -292,4 +326,4 @@ export {
 	getInitialProjects,
 	getAllGitHubReposAsProjects,
 	getRecentGitHubReposAsProjects
-};
\ No newline at end of file
+};
diff --git a/src/lib/api/projects/service.ts b/src/lib/api/projects/service.ts
index 6004d49..b89da7b 100644
--- a/src/lib/api/projects/service.ts
+++ b/src/lib/api/projects/service.ts
@@ -1,7 +1,11 @@
-import { projectsStore, projectDetailStore } from '$lib/store/projects';
-import type { Project, ProjectDetail } from '$lib/types';
-import { browser } from '$app/environment';
-import { error } from '@sveltejs/kit';
+import { projectsStore, projectDetailStore } from 
+'$lib/store/projects';
+import type { Project, ProjectDetail } from 
+'$lib/types';
+import { browser } from 
+'$app/environment';
+import { error } from 
+'@sveltejs/kit';
 
 const fetchingProjects = new Set<number>();
 
@@ -27,7 +31,10 @@ class ProjectService {
 		this.apiKey = apiKey;
 	}
 
-	async fetchProject({ project, fetch }: {
+	async fetchProject({
+		project,
+		fetch
+	}: {
 		project: Project;
 		fetch: any
 	}) {
@@ -64,13 +71,15 @@ class ProjectService {
 			};
 
 
-			return projectsStore.update((projectsMap) => {
+			projectsStore.update((projectsMap) => {
 				if (!projectsMap.has(newProject.id)) {
 					projectsMap.set(newProject.id, newProject);
 				}
 				return projectsMap;
 			});
 
+			return newProject;
+
 		} catch (error) {
 			console.error('Error fetching project:', error);
 		} finally {
diff --git a/src/lib/components/sections/Portfolio.svelte b/src/lib/components/sections/Portfolio.svelte
index ef1712f..9b558a1 100644
--- a/src/lib/components/sections/Portfolio.svelte
+++ b/src/lib/components/sections/Portfolio.svelte
@@ -17,8 +17,6 @@
 	export let projectService: ProjectService;
 	export let initialProjectsData: Project[] = [];
 
-	const staticProjectsToShow = initialProjects.slice(0, 3);
-
 	/**
 	 * Make a writable variable for the UI list
 	 * Whenever the $projects store updates, this will update.
@@ -33,7 +31,7 @@
 		});
 
 		// Initialize with projects from the server, or static projects if none are provided
-		const initialData = initialProjectsData.length > 0 ? initialProjectsData : staticProjectsToShow;
+		const initialData = initialProjectsData.length > 0 ? initialProjectsData : initialProjects;
 		projectsStore.set(new Map(initialData.map((project) => [project.id, project])));
 
 		return () => {
diff --git a/src/lib/types/types.ts b/src/lib/types/types.ts
index 11ba50b..1305b26 100644
--- a/src/lib/types/types.ts
+++ b/src/lib/types/types.ts
@@ -13,6 +13,7 @@ interface Project {
 	starsCount?: number;
 	forksCount?: number;
 	downloadsCount?: number;
+	updatedAt?: string;
 }
 
 interface ProjectDetail extends Project {
```
