<script lang="ts">
    import { onMount } from 'svelte';

    import type { EmotionEvent } from "$lib/db";
    import { db } from '$lib/db';
    import EmotionCard from "$lib/components/EmotionCard.svelte";

    let latestEntries: Promise<EmotionEvent[]> = Promise.resolve([]);

    onMount(() => {
        latestEntries = getLatestEntries();
    });

    function getLatestEntries() {
        return db.events.orderBy("date").reverse().toArray();
    }

    async function deleteEntry(entryId: number) {
        await db.events.delete(entryId);
        latestEntries = getLatestEntries();
    }
</script>

<div class="scrollable">
    <h1>Timeline</h1>
    {#await latestEntries then entries}
        {#each entries as entry}
            <EmotionCard onDelete={() => deleteEntry(entry.id)} event={entry}></EmotionCard>
        {/each}
    {/await}
</div>

<style>
    .scrollable {
        height: 100%;
        overflow-y: scroll;
        padding: var(--base-gutter);
        padding-bottom: var(--navbar-height);
    }
</style>
