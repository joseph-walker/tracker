<script lang="ts">
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';

    import type { Emotion } from "$lib/emotions";
    import { db } from '$lib/db';
    import { emotionGroups, emotionsForGroup, emotions } from "$lib/emotions";

    import EmotionButton from '$lib/components/EmotionButton.svelte';
    import SlideTracker from '$lib/components/SlideTracker.svelte';

    type Vector = [number, number];

    /** A touch gesture with a magnitude less than this will be considered a tap, not a pan */
    const TAP_PAN_THRESHOLD = 10;

    const sectionsCount = Object.keys(emotions).length;

    let touchVector: Vector;
    let clientInnerWidth: number;
    let currentIndex: number = 0;
    let touchStart: Vector = undefined;
    let touchEnd: Vector = undefined;
    let selectedEmotions: Set<Emotion> = new Set();

    onMount(() => clientInnerWidth = window.innerWidth);

    const containerOffset = spring(0, {
        stiffness: 0.1,
        damping: 0.9
    });

    /** Maintain a vector for the movement of a touch/panning motion */
    $: touchVector = (touchStart && touchEnd)
        ? [(touchEnd[0] - touchStart[0]), (touchEnd[1] - touchStart[1])]
        : [0, 0]

    /** The x-component of the touchVector */
    $: touchOffsetX = touchVector[0];

    /** The touch offset vector clamped to within the pan/tap threshold */
    $: clampedTouchOffsetX = Math.abs(touchOffsetX) > TAP_PAN_THRESHOLD
        ? touchOffsetX
        : 0;

    /** Calculate the offset for the slider - springs to the current slide index */
    $: $containerOffset = clampedTouchOffsetX - (clientInnerWidth * currentIndex);

    /** Maintain the bounds of the current index within the displayable area */
    $: {
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        if (currentIndex >= sectionsCount - 1) {
            currentIndex = sectionsCount - 1;
        }
    };

    function reset() {
        touchStart = undefined;
        touchEnd = undefined;
    }

    function handleStart(event: TouchEvent) {
        reset();

        touchStart = [event.touches[0].clientX, event.touches[0].clientY];
    }

    function handleEnd(event: TouchEvent) {
        if (touchOffsetX < -100)
            currentIndex += 1;

        if (touchOffsetX > 100)
            currentIndex -= 1;

        // If this isn't a pan, it's a tap - dispatch a mouseup event
        if (clampedTouchOffsetX === 0) {
            const mouseEvent = document.createEvent("MouseEvents");

            mouseEvent.initMouseEvent(
                "mouseup",
                true,
                true,
                // @ts-ignore
                event.target.ownerDocument.defaultView,
                0,
                event.changedTouches[0].screenX,
                event.changedTouches[0].screenY,
                event.changedTouches[0].clientX,
                event.changedTouches[0].clientY,
                event.ctrlKey,
                event.altKey,
                event.shiftKey,
                event.metaKey,
                0,
                null
            );

            event.target.dispatchEvent(mouseEvent);
        }

        reset();
    }

    function handleMove(event: TouchEvent) {
        touchEnd = [event.touches[0].clientX, event.touches[0].clientY];
    }

    const handleToggleEmotion = (emotion: Emotion) => (toggleEvent: CustomEvent<boolean>) => {
        if (toggleEvent.detail === true) {
            selectedEmotions.add(emotion);
        } else {
            selectedEmotions.delete(emotion);
        }

        selectedEmotions = selectedEmotions;
    }

    function trackEmotions() {
        db.events.add({
            emotions: [...selectedEmotions],
            date: new Date()
        });

        selectedEmotions.clear();

        selectedEmotions = selectedEmotions;
    }

    let step1 = true;
    let step2 = false;

    setTimeout(_ => { step1 = false; step2 = true; }, 500);
</script>

<svelte:window bind:innerWidth={clientInnerWidth}></svelte:window>

<section class="picker-viewport" class:step1={step1}>
    <div
        on:touchstart|preventDefault|stopPropagation={handleStart}
        on:touchmove|preventDefault|stopPropagation={handleMove}
        on:touchend|preventDefault|stopPropagation={handleEnd}
        on:touchcancel|preventDefault|stopPropagation={handleEnd}
        class="container"
        style="transform: translateX({$containerOffset}px); width: {sectionsCount * 100}vw;"
    >
        {#each emotionGroups as emotionGroup}
            <section class="panel">
                <h1 class="panel-header">{emotionGroup}</h1>
                <div class="panel-buttons">
                    {#each emotionsForGroup(emotionGroup) as emotion}
                        <EmotionButton {emotion} on:toggle={handleToggleEmotion(emotion)}></EmotionButton>
                    {/each}
                </div>
            </section>
        {/each}
    </div>

    <div class="tracker-container">
        <SlideTracker bulletCount={sectionsCount} {currentIndex}></SlideTracker>
    </div>

    <button class="confirm-button" on:click={trackEmotions}>Track {selectedEmotions.size} Emotions</button>
</section>

<section class="note-viewport" class:step2={step2}>
    <h1>Hello</h1>
</section>

<style>
    .picker-viewport {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 100%;
        transition: bottom 0.5s ease-in-out;
    }

    .picker-viewport.step1 {
        bottom: 0;
    }

    .note-viewport {
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: -100%;
        transition: bottom 0.5s ease-in-out;
    }

    .note-viewport.step2 {
        bottom: 0;
    }

    .confirm-button {
        font-size: 1.2rem;
        background: var(--cta);
        color: #FFF;
        padding: 24px;
        margin: var(--base-gutter);
        text-align: center;
        border-radius: var(--roundy-bit-softness);
    }

    .container {
        display: flex;
        height: 100%;
    }

    .tracker-container {
        display: flex;
        justify-content: center;
    }

    .panel {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-basis: 100vw;
        flex-grow: 0;
        flex-shrink: 0;
        color: #333;
        min-height: 100%;
        padding: var(--base-gutter);
    }

    .panel-header {
        display: block;
        margin-bottom: var(--base-gutter);
        font-size: 1.5rem;
        font-weight: 600;
        text-transform: capitalize;
        text-align: left;
    }

    .panel-buttons {
        flex-grow: 1;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: var(--base-gutter);
        grid-column-gap: var(--base-gutter);
    }
</style>
