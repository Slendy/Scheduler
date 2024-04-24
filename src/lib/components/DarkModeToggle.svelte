<script>
	
	export function setInitialScheme() {	
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
	}

	function enableDarkMode() {
		document.querySelector(':root')?.setAttribute('data-bs-theme', 'dark');
		document.querySelector(':root')?.classList.add('darkMode');
		document.querySelector(':root')?.classList.remove('lightMode');
	}
	function disableDarkMode() {
		document.querySelector(':root')?.setAttribute('data-bs-theme', 'light');
		document.querySelector(':root')?.classList.remove('darkMode');
		document.querySelector(':root')?.classList.add('lightMode');
	}

	// update theme on button press
	// side effect: if a user manually toggles their theme it will be forever saved
	function toggleDarkMode() {
		let isDarkMode = document.querySelector(':root')?.classList.contains('darkMode');
		isDarkMode ? disableDarkMode() : enableDarkMode();
		isDarkMode = !isDarkMode;
		let theme = isDarkMode ? 'dark' : 'light';
		localStorage.setItem('colorTheme', theme);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg
	width="30"
	height="30"
	viewBox="0, 0, 48, 48"
	on:click={() => toggleDarkMode()}
	on:keydown={() => toggleDarkMode()}
	class="toggle ms-2 mt-1"
>
	<path
		d="M22 41C32.4934 41 41 32.4934 41 22C41 11.5066 32.4934 3 22
                                            3C11.5066 3 3 11.5066 3 22C3 32.4934 11.5066 41 22 41ZM7 22C7
                                            13.7157 13.7157 7 22 7V37C13.7157 37 7 30.2843 7 22Z"
	></path>
</svg>
