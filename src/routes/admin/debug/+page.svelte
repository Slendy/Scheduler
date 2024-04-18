<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import type { PageData } from './$types';

    export let data: PageData
</script>

<Header>DEBUG</Header>

<div class="m-3">
    <h4>There are {data.environments.length} environments and {data.users.length} users</h4>
</div>


<div class="container-fluid">
    <div class="row">
        <div class="col">
            <div class="accordion" id="environment-accordion">
                {#each data.environments as environment}
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#envCollapse{environment._id}">
                                {environment.environmentName}
                            </button>
                        </h2>
                        <div id="envCollapse{environment._id}" class="accordion-collapse collapse" data-bs-parent="#environment-accordion">
                            <div class="accordion-body">
                                <p>Id: {environment._id}</p>
                                <p>Domain: {environment.environmentDomain}</p>
                                <p>Name: {environment.environmentName}</p>
                                <p># Schedules: {environment.schedules.length}</p>
                                <a class="link-secondary" href="/admin/debug/edit/environment/{environment._id}">Edit environment</a>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        <div class="col">
            <div class="accordion" id="user-accordion">
                {#each data.users as user}
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#userCollapse{user._id}">
                                {user.username}
                            </button>
                        </h2>
                        <div id="userCollapse{user._id}" class="accordion-collapse collapse" data-bs-parent="#user-accordion">
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
    </div>
</div>