<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { Emotion } from "$lib/emotions";

    export let emotion: Emotion;

    const dispatch = createEventDispatcher();

    let active = false;

    function onClick(_event: MouseEvent) {
        active = !active;
        dispatch('toggle', active);
    }
</script>

<button
    on:mouseup={onClick}
    class="emotion-button"
    class:active
>
    <div class="layer-1">
        {emotion}
    </div>
    <div class="layer-2">
        {emotion}
    </div>
</button>

<style>
    .emotion-button {
        display: block;
        height: 100%;
        font-weight: 500;
        font-size: 1rem;
        text-transform: capitalize;
        position: relative;
        border-radius: var(--roundy-bit-softness);
        box-shadow: 0px 3px 5px rgb(152 152 152 / 12%);
    }

    .layer-1,
    .layer-2 {
        display: grid;
        place-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: var(--roundy-bit-softness);
        border: 1px solid #e8ecf3;
        transition: clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1);
    }

    .layer-1 {
        z-index: 1;
        background: #FFF;
    }

    .layer-2 {
        z-index: 2;
        clip-path: circle(0%);
        background: var(--blue);
        color: #FFF;
    }

    .emotion-button.active {
        animation-duration: 0.75s;
        animation-name: click;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
    }

    .emotion-button.active .layer-2 {
        clip-path: circle(100%);
    }

    @keyframes click {
        0% {
            transform: scale3d(1, 1, 1);
        }

        20% {
            transform: scale3d(0.9, 0.9, 1);
        }

        100% {
            transform: scale3d(1, 1, 1);
        }
    }
</style>
