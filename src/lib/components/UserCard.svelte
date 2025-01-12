<script lang="ts">
    interface Props {
        userId: string;
        username: string;
        isAdmin: boolean;
    }

    let { userId, username, isAdmin }: Props = $props();
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

            <a href="/admin/users/{userId}/edit" class="btn btn-secondary">Edit user</a>
        </ul>
    </div>
</div>