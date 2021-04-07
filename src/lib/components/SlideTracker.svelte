<script lang="ts">
    import { spring } from 'svelte/motion';

    export let bulletCount: number;
    export let currentIndex: number;

    const highlightOffset = spring(0, {
        stiffness: 0.4,
        damping: 0.9
    });

    $: $highlightOffset = currentIndex * 20;
</script>

<ul class="slide-tracker">
    <span class="bullet-active" style="transform: translateX({$highlightOffset}px);"></span>
    {#each [...Array(bulletCount)] as _, idx}
        <li class="bullet-block" class:active={currentIndex === idx}>
            <span class="bullet"></span>
        </li>
    {/each}
</ul>

<style>
    .slide-tracker {
        position: relative;
        display: flex;

        --bullet-outer-size: 20px;
        --bullet-inner-size: 12px;
    }

    .bullet-block {
        position: relative;
        display: grid;
        place-items: center;
        width: var(--bullet-outer-size);
        height: var(--bullet-outer-size);
    }

    .bullet {
        width: var(--bullet-inner-size);
        height: var(--bullet-inner-size);
        background: #d5dff1;
        border-radius: 100%;
    }

    .bullet-active {
        position: absolute;
        top: 0;
        left: 0;
        width: var(--bullet-outer-size);
        height: var(--bullet-outer-size);
        background: var(--green);
        border-radius: 100%;
    }
</style>
