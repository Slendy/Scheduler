<script lang="ts">
    export let environmentId: any;
    export let environmentName: string;
    export let environmentDomain: string;
    export let totalSchedules: number;
</script>

<div class="col">
    <div class="card transition">
        <div class="card-header">
            {environmentId}
        </div>
        <ul class="card-body mb-0">
            <p class="card-text">
                <span class="card-text fw-bold">Environment Name:</span>
                <span class="card-text">{environmentName}</span>
            </p>
            <p class="card-text">
                <span class="card-text fw-bold">Domain:</span>
                <span class="card-text">{environmentDomain}</span>
            </p>
            <p class="card-text">
                <span class="card-text fw-bold">Schedules:</span>
                <span class="card-text">{totalSchedules}</span>
            </p>
            <a href="/admin/environments/{environmentId}" class="btn btn-secondary">View Environment</a>
        </ul>
    </div>
</div>