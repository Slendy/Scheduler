<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import ProgressBarBar from '$lib/components/ProgressBar.svelte';
	let { children } = $props();
</script>

<ModeWatcher />
<ProgressBarBar />

{@render children()}
