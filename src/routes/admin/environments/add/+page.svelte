<script>
	import Header from "$lib/components/Header.svelte";
</script>

<Header>Create new environment</Header>

<form method="post">

    <div class="mb-3">
        <label for="envName" class="form-label">Environment name</label>
        <input type="text" id="envName" name="envName" class="form-control" maxlength="64" required>
    </div>


    <div class="mb-3">
        <label for="envDomain" class="form-label">Environment domain</label>
        <input type="text" id="envDomain" name="envDomain" class="form-control" required>
    </div>

    <button class="btn btn-secondary" type="submit">Create environment</button>
    <a href="/admin/environments" class="btn btn-danger">Discard changes</a>
</form>