<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import {
		PUBLIC_GIT_BRANCH,
		PUBLIC_GIT_SHA,
		PUBLIC_BUILD_DATE,
		PUBLIC_GIT_REMOTE
	} from '$env/static/public';
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
	<link href="/css/colors.css" rel="stylesheet" />
	<link href="/css/overrides.css" rel="stylesheet" />
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap"
		rel="stylesheet"
	/>
	<script
		src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
		crossorigin="anonymous"
	></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
	/>
	<link rel="shortcut icon" href="/favicon.ico" />
	<script>
		// set dark mode on page load
		const getPreferredScheme = () =>
			window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light';

		let storedTheme = localStorage.getItem('colorTheme') ?? getPreferredScheme();

		if (storedTheme === 'dark') {
			enableDarkMode();
		} else {
			disableDarkMode();
		}

		window.onload = function () {
			document.body.classList.add('transition');
		};

		function enableDarkMode() {
			document.querySelector(':root')?.setAttribute('data-bs-theme', 'dark');
			document.querySelector(':root')?.classList.add('darkMode');
		}
		function disableDarkMode() {
			document.querySelector(':root')?.setAttribute('data-bs-theme', 'light');
			document.querySelector(':root')?.classList.remove('darkMode');
		}
	</script>
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
	<footer class="footer transition">
		<div class="footer-container">
			<div class="container" style="height: 20px;">
				<span class="float-start transition-workaround">
					Scheduler
					<a href={PUBLIC_GIT_REMOTE + '/commit/' + PUBLIC_GIT_SHA}>
						{PUBLIC_GIT_SHA.slice(0, 7)}@{PUBLIC_GIT_BRANCH}
					</a>
				</span>
				<span class="transition-workaround float-end">
					Built on {new Date(PUBLIC_BUILD_DATE).toLocaleDateString()}
				</span>
			</div>
		</div>
	</footer>
</div>
