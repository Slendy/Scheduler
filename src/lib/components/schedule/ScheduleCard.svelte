<script lang="ts">
    export let environmentId: any;
    export let scheduleId: any;
    export let name: string;
    export let isPublished: boolean;
    export let events: [any];
</script>

<div class="col">
    <div class="card" style="width: 18rem;">
        <div class="card-header">
            {scheduleId}
        </div>
        <ul class="card-body mb-0">
            <p class="card-text">
                <span class="card-text fw-bold">Schedule Name:</span>
                <span class="card-text">{name}</span>
            </p>
            <p class="card-text">
                <span class="card-text fw-bold">Published?:</span>
                <span class="card-text">{isPublished || false}</span>
            </p>
            <p class="card-text">
                <span class="card-text fw-bold"># Events:</span>
                <span class="card-text">{events.length}</span>
            </p>
            <a href="/admin/environments/{environmentId}/schedule/{scheduleId}" class="btn btn-secondary">View Schedule</a>
        </ul>
    </div>
</div>