<script lang="ts">
    export let userId: string;
    export let username: string;
    export let isAdmin: boolean;
    export let permissionMap: any;
</script>

<div class="col">
    <div class="card transition">
        <div class="card-header">{userId}</div>
        <ul class="card-body mb-0">
            <p>
                <span class="card-text fw-bold">Username:</span>
                <span class="card-text">{username}</span>
            </p>

            <p class="card-text">
                <span class="card-text fw-bold">Is Admin:</span>
                <span class="card-text">{isAdmin}</span>
            </p>
            <p class="card-text">
                <span class="card-text fw-bold">Permissions:</span>
                {#if permissionMap.size || 0 > 0}
                    <span class="card-text">{JSON.stringify(permissionMap, null, 2)}</span>
                {:else}
                    <span class="card-text">None</span>
                {/if}
            </p>

            <a href="/admin/users/{userId}/edit" class="btn btn-secondary">Edit user</a>
        </ul>
    </div>
</div>