<script lang="ts">
    import formatDistanceToNow from "date-fns/formatDistanceToNow/index.js";

    import type { EmotionEvent } from "$lib/db";
    import type { Emotion, EmotionLevel, EmotionGroup } from "$lib/emotions";
    import { emotionToColor, reconstructEmotionMap } from "$lib/emotions";
    import Chevron from '$lib/components/icons/Chevron.svelte';

    import GlanceBar from "./GlanceBar.svelte";
    import Trash from "./icons/Trash.svelte";

    export let onDelete: () => void;
    export let event: EmotionEvent;

    const NOTE_TIME_UPDATE_INTERVAL = 60000;

    const {
        date,
        emotions,
        note
    } = event;

    let deleteTimer: NodeJS.Timeout;
    let showDeleteWarning: boolean = false;
    let expanded: boolean = false;
    let noteTimeDelta = formatDistanceToNow(date);

    // Update the time delta every n seconds
    setInterval(function () {
        noteTimeDelta = formatDistanceToNow(date);
    }, NOTE_TIME_UPDATE_INTERVAL);

    const cardData = reconstructEmotionMap(emotions);
    const cardEntries = Object.entries(cardData) as [EmotionGroup, Record<EmotionLevel, Emotion[]>][];

    function toggleExpanded() {
        expanded = !expanded;
    }

    // TODO: Come up with a better delete mechanism than long-hold
    function startDeleteTimer() {
        deleteTimer = setTimeout(function () {
            showDeleteWarning = true;

            deleteTimer = setTimeout(function () {
                if (confirm("Are you sure you want to delete this entry?")) {
                    onDelete();
                }

                showDeleteWarning = false;
            }, 500);
        }, 500);
    }

    function resetDeleteTime() {
        if (deleteTimer) {
            showDeleteWarning = false;
            clearTimeout(deleteTimer);
        }
    }
</script>

<div class="emotion-card" class:expanded on:touchstart={startDeleteTimer} on:touchend={resetDeleteTime}>
    <div class="delete-warning" class:visible={showDeleteWarning}>
        <i><Trash></Trash></i>
    </div>
    <div class="header" on:click={toggleExpanded}>
        <GlanceBar emotions={emotions}></GlanceBar>
        <h3 class="timestamp">{noteTimeDelta} Ago</h3>
        <i class="chevron"><Chevron></Chevron></i>
    </div>
    {#if expanded}
        <dl>
            {#each cardEntries as emotionGroups}
                <div class="group-wrapper">
                    <dt class="emotion-group">
                        <span style={`background: ${emotionToColor(emotionGroups[0])}`} class="bullet filled"></span>{emotionGroups[0]}
                    </dt>
                    <dd class="breakdown">
                        <ul class="levels">
                            {#each Object.entries(emotionGroups[1]) as emotionLevels}
                                <li>
                                    <span style={`border-color: ${emotionToColor(emotionGroups[0])}`} class={`bullet ${emotionLevels[0]}`}></span>
                                    <span class="level">{emotionLevels[0]} Level</span>
                                    <span class="count">× {emotionLevels[1].length}</span>
                                    <span class="hack"></span>
                                    <ul class="emotions">
                                        {#each emotionLevels[1] as emotion}
                                            <li>{emotion}</li>
                                        {/each}
                                    </ul>
                                </li>
                            {/each}
                        </ul>
                    </dd>
                </div>
            {/each}
        </dl>
        {#if note}
            <p class="note">{note}</p>
        {/if}
    {/if}
</div>

<style>
    ul {
        list-style: none;
    }

    .emotion-card {
        margin-bottom: var(--base-gutter);
        padding: var(--base-gutter);
        border-radius: var(--roundy-bit-softness);
        background: var(--card-background);
        box-shadow: var(--soft-shadow);
        border: 1px solid var(--middle-gray);
        position: relative;
        overflow: hidden;
        z-index: 1;

        /** Must be odd */
        --bullet-size: 11px;
        --list-gutter: 4px;
    }

    .delete-warning {
        opacity: 0;
        pointer-events: none;
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgb(214 48 49 / 50%);
        z-index: 5;
        justify-content: center;
        align-items: center;
        transition: 0.25s opacity ease-in;
    }

    .delete-warning.visible {
        opacity: 1;
    }

    .delete-warning i {
        width: 32px;
        height: 32px;
        fill: var(--red);
    }

    .header {
        display: flex;
        align-items: center;
        padding-bottom: calc(var(--base-gutter) / 2);
        margin-bottom: calc(var(--base-gutter) / 2);
        border-bottom: 1px dashed var(--middle-gray);
    }

    .chevron {
        display: block;
        width: 8px;
        height: 8px;
        margin-left: 4px;
        fill: var(--dark-gray);
        position: relative;
        transition: transform 0.2s ease-in-out;
    }

    .emotion-card.expanded .chevron {
        transform: rotate(90deg);
    }

    .emotion-card:not(.expanded) .header {
        margin-bottom: 0;
        border-bottom: none;
        padding-bottom: 0;
    }


    .timestamp {
        font-weight: 600;
        text-align: right;
        margin-left: auto;
        color: var(--dark-gray);
        text-transform: capitalize;
    }

    .emotion-group {
        text-transform: capitalize;
        font-weight: 600;
        display: flex;
        align-items: center;
        margin-bottom: calc(var(--base-gutter) / 2);
    }

    .bullet {
        position: relative;
        display: block;
        content: "";
        width: var(--bullet-size);
        height: var(--bullet-size);
        border-radius: 100%;
        margin-right: calc(var(--base-gutter) / 2);
        z-index: 2;
        background: var(--white);
    }

    .bullet.low,
    .bullet.medium,
    .bullet.high {
        background: #FFF;
    }

    .bullet.filled {
        border: none;
    }

    .bullet.low {
        border: 1px solid;
    }

    .bullet.medium {
        border: 2px solid;
    }

    .bullet.high {
        border: 3px solid;
    }

    .levels > li {
        display: grid;
        grid-template-areas:
            "b l c"
            "h d d";
        grid-template-columns: min-content 1fr min-content;
        align-items: center;
        justify-items: start;
        gap: var(--list-gutter) 0px;
        margin-bottom: calc(var(--base-gutter) / 2);
    }

    .levels > li:last-child {
        margin-bottom: 0;
    }

    .levels > li:last-child .hack {
        display: block;
    }

    .levels .bullet {
        grid-area: b;
    }

    .levels .level {
        text-transform: capitalize;
        grid-area: l;
    }

    .hack {
        align-self: start;
        grid-area: h;
        display: none;
        position: relative;
        top: calc(var(--list-gutter) * -1 - 2px);
        content: "";
        width: 100%;
        height: calc(100% + var(--list-gutter) + 2px);
        background: var(--white);
        z-index: 2;
    }

    .count {
        grid-area: c;
        white-space: nowrap;
    }

    .emotions {
        grid-area: d;
        justify-self: end;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        margin-top: calc(var(--base-gutter) * -0.5);
    }

    .emotions > li {
        display: block;
        padding: 2px 8px;
        border-radius: 4px;
        background: var(--light-gray);
        border: 1px solid var(--middle-gray);
        font-size: 0.8rem;
        color: var(--dark-gray);
        margin-left: calc(var(--base-gutter) / 2);
        margin-top: calc(var(--base-gutter) / 2);
        text-transform: capitalize;
    }

    .note {
        margin-top: calc(var(--base-gutter) / 2);
        font-style: italic;
        color: var(--dark-gray);
        line-height: 1.4;
    }

    .group-wrapper {
        margin-bottom: var(--base-gutter);
        position: relative;
    }

    .group-wrapper:last-of-type {
        margin-bottom: 0;
    }

    .group-wrapper:before {
        z-index: 1;
        position: absolute;
        content: "";
        width: 0px;
        border-right: 1px dotted var(--middle-gray);
        height: calc(100% - calc(var(--bullet-size) / 2 - 1px));
        left: calc(var(--bullet-size) / 2 - 1px);
        top: calc(var(--bullet-size) / 2 - 1px);
    }
</style>
