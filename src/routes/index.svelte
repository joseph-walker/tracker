<script lang="ts">
    import { db } from '$lib/db';
    import EmotionCard from "$lib/components/EmotionCard.svelte";

    function latestEntries() {
        return db.events.orderBy("date").reverse().toArray();
    }
</script>

{#await latestEntries() then entries}
    {#each entries as entry}
        <EmotionCard event={entry}></EmotionCard>
    {/each}
{/await}
