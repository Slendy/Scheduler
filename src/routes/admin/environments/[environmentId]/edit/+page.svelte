<script lang="ts">
    import Header from "$lib/components/Header.svelte";
	import type { PageData } from "./$types";

    export let data: PageData
</script>

<Header>Edit {data.environment.environmentName}</Header>

<form method="post">

    <div class="mb-3">
        <label for="envName" class="form-label">Environment name</label>
        <input type="text" value="{data.environment.environmentName}" id="envName" name="envName" class="form-control" maxlength="64">
    </div>

    <div class="mb-3">
        <label for="envDomain" class="form-label">Environment domain</label>
        <input type="text" value="{data.environment.environmentDomain}" id="envDomain" name="envDomain" class="form-control">
    </div>

    <button class="btn btn-secondary" type="submit">Save changes</button>
    <a href="/admin/environments/{data.environment._id}" class="btn btn-danger">Discard changes</a>
</form>