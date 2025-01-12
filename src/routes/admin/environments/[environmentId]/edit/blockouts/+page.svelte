<script lang="ts">
	let { data } = $props();
</script>

<h3>Blockouts</h3>
<p class="text-body-secondary">Prevent schedules from occurring on certain days</p>
<hr />
<button
	class="btn btn-secondary"
	data-bs-toggle="modal"
	data-bs-target="#blockout"
	onclick={() => {
		document.dispatchEvent(new CustomEvent('modalChange'));
	}}
>
	Add new blockout
</button>
