<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap"
		rel="stylesheet"
	/>
	<link href="/css/schedule.css" rel="stylesheet" />
</svelte:head>

<body class="schedule-body">
	<div class="schedule-container center">
		<div class="countdown-container">
			<div style="display: block">
				<h1 class="header" id="event-name">No schedules found</h1>
				<br class="event-break" />
				<div class="timer-wrapper">
					<span class="timer-label timer">Try checking back later</span>
				</div>
				<br class="event-break" />
				<div class="timer-wrapper">
					<a class="schedule-link link" href="/"><span class="timer-label">Back to homepage</span></a>
				</div>
			</div>
		</div>
	</div>
</body>

<style>
	.link {
		text-decoration: underline;
		font-size: 5vmin;
		font-family: 'Open Sans', 'Helvetica', serif;
	}
	.center {
		text-align: center;
	}
	.header {
		color: var(--schedule-text-color);
		text-align: center;
		font-size: 700%;
		font-size: 9.5vmin;
		font-family: 'Open Sans', 'Helvetica', serif;
		display: inherit;
		margin: 0;
		line-height: 1em;
	}
	.event-break {
		display: block;
		content: '';
		margin-top: calc(1em + 4.85vh);
	}
	.timer-wrapper {
		display: inline-block;
		touch-action: manipulation;
	}

	.timer-label {
		display: inherit;
		font-weight: 100;
		margin-right: 0.5em;
	}
	.timer {
		color: var(--schedule-text-color);
		text-align: center;
		font-size: 700%;
		font-size: 9.5vmin;
		font-family: 'Open Sans', 'Helvetica', serif;
	}
</style>
