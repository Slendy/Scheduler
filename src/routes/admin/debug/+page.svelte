<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	export let data;

	let environments = JSON.parse(data.serializedEnvironments);
	let users = JSON.parse(data.serializedUsers);
</script>

<Header>DEBUG</Header>

<div class="m-3">
	<h4>
		There are {environments?.length || 'undefined'} environments and {users?.length || 'undefined'} users
	</h4>
</div>

<div class="container-fluid">
	<div class="row">
		{#if environments != null}
			<div class="col">
				<div class="accordion" id="environment-accordion">
					{#each environments as environment}
						<div class="accordion-item">
							<h2 class="accordion-header">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#envCollapse{environment._id}"
								>
									{environment.environmentName}
								</button>
							</h2>
							<div
								id="envCollapse{environment._id}"
								class="accordion-collapse collapse"
								data-bs-parent="#environment-accordion"
							>
								<div class="accordion-body">
									<p>Id: {environment._id}</p>
									<p>Domain: {environment.environmentDomain}</p>
									<p>Name: {environment.environmentName}</p>
									<p># Schedules: {environment.schedules.length}</p>
									<a class="link-secondary" href="/admin/debug/edit/environment/{environment._id}"
										>Edit environment</a
									>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<hr class="mt-3" />
			<h4>Failed to load environments</h4>
		{/if}
		{#if users != null}
			<div class="col">
				<div class="accordion" id="user-accordion">
					{#each users as user}
						<div class="accordion-item">
							<h2 class="accordion-header">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#userCollapse{user._id}"
								>
									{user.username}
								</button>
							</h2>
							<div
								id="userCollapse{user._id}"
								class="accordion-collapse collapse"
								data-bs-parent="#user-accordion"
							>
								<div class="accordion-body">
									<p>Id: {user._id}</p>
									<p>Username: {user.username}</p>
									<p>IsAdmin: {user.isAdmin}</p>
									<a class="link-secondary" href="/admin/debug/edit/user/{user._id}">Edit user</a>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<hr class="mt-3" />
			<h4>Failed to load users</h4>
		{/if}
	</div>
</div>
