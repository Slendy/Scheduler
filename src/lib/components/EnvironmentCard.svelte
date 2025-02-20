<script lang="ts">
    interface Props {
        id: any;
        name: string;
        domain: string;
        totalSchedules: number;
    }

    let {
        id,
        name,
        domain,
        totalSchedules
    }: Props = $props();
</script>

<div class="col">
    <div class="card transition">
        <div class="card-header">
            {id}
        </div>
        <ul class="card-body mb-0">
            <p class="card-text">
                <span class="card-text fw-bold">Environment Name:</span>
                <span class="card-text">{name}</span>
            </p>
            <p class="card-text">
                <span class="card-text fw-bold">Domain:</span>
                <span class="card-text">{domain}</span>
            </p>
            <p class="card-text">
                <span class="card-text fw-bold">Schedules:</span>
                <span class="card-text">{totalSchedules}</span>
            </p>
            <a href="/admin/environments/{id}" class="btn btn-secondary">View Environment</a>
        </ul>
    </div>
</div>