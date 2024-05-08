<body>
	<div class="schedule-container">
		<div class="countdown-container">
			<div style="display: block">
				<h1 class="header" id="event-name">No schedules found</h1>
				<br class="event-break" />
				<div class="timer-wrapper">
					<span class="timer-label timer">Try checking back</span>
				</div>
				<br class="event-break" />
				<div class="timer-wrapper">
					<a class="link" href="/"><span class="timer-label">Back to homepage</span></a>
				</div>
			</div>
		</div>
	</div>
</body>

<style>
	.countdown-container {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;

		text-align: center;

		user-select: none;
		-moz-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-o-user-select: none;
	}
	.link {
		text-decoration: underline;
		font-size: 5vmin;
		font-family: 'Open Sans', "Helvetica", serif;
	}
	.event-break {
		display: block;
		content: '';
		margin-top: calc(1em + 5vh);
	}
</style>
