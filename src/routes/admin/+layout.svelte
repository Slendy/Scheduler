<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import {
		PUBLIC_GIT_BRANCH,
		PUBLIC_GIT_SHA,
		PUBLIC_BUILD_DATE,
		PUBLIC_GIT_REMOTE,
		PUBLIC_VERSION
	} from '$env/static/public';
	const { MODE } = import.meta.env;
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';

	let navBarItems = [
		['/admin', 'Home'],
		['/admin/users', 'Users'],
		['/admin/environments', 'Environments'],
		['/logout', 'Logout']
	];

	if (dev) {
		navBarItems[navBarItems.length] = ['/admin/debug', 'DEBUG'];
	}

	// this makes the navbar highlight subpages like /admin/environments/create
	// I don't like it, but I also don't like frontend yet here we are
	function trimUrl(currentUrl: string) {
		let secondSlash = currentUrl.indexOf('/', 1);
		let thirdSlash = currentUrl.indexOf('/', secondSlash + 1);
		if (secondSlash == -1 || thirdSlash == -1) thirdSlash = currentUrl.length;
		return currentUrl.substring(0, thirdSlash);
	}

	// NProgress css
	import 'nprogress/nprogress.css';

	$: {
		if ($navigating) {
			NProgress.start();
		}
		if (!$navigating) {
			NProgress.done();
		}
	}
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
	/>
	<meta name="description" content="Admin panel" />
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
		rel="stylesheet"
		crossorigin="anonymous"
	/>
	<link href="/css/overrides.css" rel="stylesheet" />
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
		crossorigin="anonymous"
	></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
	/>
	<link rel="shortcut icon" href="/favicon.ico" />
</svelte:head>

<div class="main-container">
	<nav class="navbar navbar-expand-lg h5 text-center transition">
		<div class="navbar-brand">
			<DarkModeToggle />
		</div>
		<div class="d-flex justify-content-center align-content-center container">
			{#each navBarItems as navbar}
				<ul class="navbar-nav me-4">
					<li class="nav-item">
						<a
							class="nav-link"
							class:active={trimUrl($page.url.pathname) === navbar[0]}
							href={navbar[0]}
							data-sveltekit-preload-data={navbar[0] === '/logout' ? 'false' : undefined}
						>
							{navbar[1]}
						</a>
					</li>
				</ul>
			{/each}
		</div>
	</nav>
	<div class="main-content container mb-3">
		<slot></slot>
	</div>
	<footer class="footer transition d-flex">
		<div class="container mt-3 mb-3">
			<div class="row row-cols-md-2 row-cols-1">
				<div class="col">
					<span class="float-start transition-workaround">
						<div>
							<span class="fw-bold">
								<a href="https://github.com/Slendy">@slendy</a>
								/scheduler/{PUBLIC_GIT_BRANCH}
							</span>
						</div>
						<div>
							Version: {PUBLIC_VERSION}, Commit:
							<a href={PUBLIC_GIT_REMOTE + '/commit/' + PUBLIC_GIT_SHA}>
								{PUBLIC_GIT_SHA.slice(0, 7)}
							</a>
						</div>
					</span>
				</div>
				<div class="col">
					<span class="transition-workaround float-start float-md-end text-start text-md-end">
						<div title={PUBLIC_BUILD_DATE}>
							Build date: {new Date(PUBLIC_BUILD_DATE).toLocaleDateString()}
						</div>
						<div>
							Deployment: {MODE.charAt(0).toUpperCase() + MODE.slice(1)}
						</div>
					</span>
				</div>
			</div>
		</div>
	</footer>
</div>
