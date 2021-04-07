<script lang="ts">
    import { onMount } from 'svelte';
    import { spring } from 'svelte/motion';

    import SlideTracker from '$lib/components/SlideTracker.svelte';

    type Vector = [number, number];

    /** A touch gesture with a magnitude less than this will be considered a tap, not a pan */
    const TAP_PAN_THRESHOLD = 10;

    let touchVector: Vector;
    let clientInnerWidth: number;
    let currentIndex: number = 0;
    let touchStart: Vector = undefined;
    let touchEnd: Vector = undefined;

    export let sectionCount: number;

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

        if (currentIndex >= sectionCount - 1) {
            currentIndex = sectionCount - 1;
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
</script>

<svelte:window bind:innerWidth={clientInnerWidth}></svelte:window>

<section class="picker-viewport">
    <div
        on:touchstart|preventDefault|stopPropagation={handleStart}
        on:touchmove|preventDefault|stopPropagation={handleMove}
        on:touchend|preventDefault|stopPropagation={handleEnd}
        on:touchcancel|preventDefault|stopPropagation={handleEnd}
        class="container"
        style="transform: translateX({$containerOffset}px); width: {sectionCount * 100}vw;"
    >
        <slot name="panels"></slot>
    </div>

    <div class="tracker-container">
        <SlideTracker bulletCount={sectionCount} {currentIndex}></SlideTracker>
    </div>

    <slot name="additional-content"></slot>
</section>


<style>
    .picker-viewport {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        width: 100%;
        height: 100%;
    }

    .container {
        display: flex;
        height: 100%;
    }

    .tracker-container {
        display: flex;
        justify-content: center;
    }
</style>
