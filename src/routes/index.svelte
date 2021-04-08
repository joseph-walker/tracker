<script lang="ts">
    import { goto } from '$app/navigation';

    import { db } from '$lib/db';
    import EmotionCard from "$lib/components/EmotionCard.svelte";
    import Plus from '$lib/components/icons/Plus.svelte';

    let latestEntries = getLatestEntries();

    function getLatestEntries() {
        return db.events.orderBy("date").reverse().toArray();
    }

    function newEvent() {
        goto("/track");
    }

    async function deleteEntry(entryId: number) {
        await db.events.delete(entryId);
        latestEntries = getLatestEntries();
    }
</script>

<div class="scrollable">
    {#await latestEntries then entries}
        {#each entries as entry}
            <EmotionCard onDelete={() => deleteEntry(entry.id)} event={entry}></EmotionCard>
        {/each}
    {/await}

    <button class="track" on:click={newEvent}>
        <i><Plus></Plus></i>
    </button>
</div>

<style>
    .scrollable {
        height: 100%;
        overflow-y: scroll;
    }

    .track {
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 64px;
        height: 64px;
        background: var(--cta);
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--white);
        border-radius: 100%;
        font-weight: bold;
        box-shadow: var(--heavy-shadow);
        transition: 0.1s transform ease-out;
    }

    .track:active {
        transform: scale3d(0.9, 0.9, 1) translateY(2px) translateX(2px);
        outline: none;
    }

    .track > i {
        width: 25%;
        fill: white;
    }
</style>
