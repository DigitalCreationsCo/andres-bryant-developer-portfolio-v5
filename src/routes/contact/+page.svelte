<script lang="ts">
	import Contact from '$lib/components/sections/Contact.svelte';
	import { fade } from 'svelte/transition';
</script>

<section
	id="contact"
	class="grow"
	in:fade|local={{ duration: 1000 }}
	out:fade|local={{ duration: 50 }}
>
	<Contact />
</section>