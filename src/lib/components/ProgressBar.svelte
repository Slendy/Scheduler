<script lang="ts">
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	beforeNavigate((_) => {
		NProgress.start();
	})

	afterNavigate((_) => {
		NProgress.done();
	})
</script>