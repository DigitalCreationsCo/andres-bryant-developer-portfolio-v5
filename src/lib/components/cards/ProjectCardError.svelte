<script lang="ts">
	import type { Project } from '$lib/types';
	import Typewriter from 'svelte-typewriter';
	import { scale } from 'svelte/transition';

	export let project: Project;
</script>

<div in:scale>
	<div>
		<!-- Hero -->
		<div>
			<div>
				<div>
					<h2 class="text-red-500">Error!</h2>
				</div>
			</div>
		</div>

		<!-- Messages -->
		<div>
			<Typewriter mode={'cascade'} delay={600} interval={10} showCursorOnDelay={false}>
				<h2>
					{project.name === 'limit'
						? 'API rate limit exceeded'
						: 'An error occurred while fetching projects.'}
				</h2>
				<h2>
					{project.description}
				</h2>
			</Typewriter>
		</div>
	</div>
</div>
