<script lang="ts">
    import { onMount } from 'svelte';

    import type { EmotionEvent } from "$lib/db";
    import { db } from '$lib/db';
    import EmotionCard from "$lib/components/EmotionCard.svelte";
    import ChordCard from '$lib/components/ChordCard.svelte';

    let latestEntries: Promise<EmotionEvent[]> = Promise.resolve([]);
    let totalEntries: Promise<number> = Promise.resolve(0);

    onMount(() => {
        latestEntries = getLatestEntries();
        totalEntries = db.events.count();
    });

    function getLatestEntries() {
        return db.events.orderBy("date").reverse().limit(5).toArray();
    }

    async function deleteEntry(entryId: number) {
        await db.events.delete(entryId);
        latestEntries = getLatestEntries();
    }
</script>

<div class="scrollable">
    <h1>Latest Entries</h1>
    {#await latestEntries then entries}
        {#each entries as entry}
            <EmotionCard onDelete={() => deleteEntry(entry.id)} event={entry}></EmotionCard>
        {/each}
    {/await}
    {#await totalEntries then count}
        {#if count > 5}
            <a class="timeline-link" href="/timeline">See More...</a>
        {/if}
    {/await}
    <h1>At a Glance</h1>
    <ChordCard></ChordCard>
</div>

<style>
    .scrollable {
        height: 100%;
        overflow-y: scroll;
        padding: var(--base-gutter);
        padding-bottom: var(--navbar-height);
    }

    .timeline-link {
        text-align: center;
        display: block;
        padding: var(--base-gutter) 0;
        color: var(--dark-gray);
        margin-top: calc(var(--base-gutter) * -1);
    }
</style>
