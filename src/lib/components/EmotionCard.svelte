<script lang="ts">
    import type { Emotion, EmotionLevel, EmotionGroup } from "$lib/emotions";
    import { reconstructEmotionMap } from "$lib/emotions";

    export let emotions: Emotion[];

    function emotionToColor(group: EmotionGroup): string {
        const emotionToColorMap: Record<EmotionGroup, string> = {
            "anger": "var(--red)",
            "distress": "var(--yellow)",
            "fear": "var(--orange)",
            "happiness": "var(--green)",
            "love": "var(--purple)",
            "sadness": "var(--blue)"
        }

        return emotionToColorMap[group];
    }

    const cardData = reconstructEmotionMap(emotions);
    const cardEntries = Object.entries(cardData) as [EmotionGroup, Record<EmotionLevel, Emotion[]>][];

    const gradientData = cardEntries.map(function ([emotionGroup, levels]) {
        const colorData = Object.entries(levels) as [EmotionLevel, Emotion[]][];
        const groupScore = colorData.reduce(function (sum, [level, emotions]) {
            let multiplier;

            switch (level) {
                case "high": multiplier = 3; break;
                case "medium": multiplier = 2; break;
                case "low": multiplier = 1; break;
            }

            return sum + emotions.length * multiplier;
        }, 0);

        return [emotionToColor(emotionGroup), groupScore] as const;
    });

    const gradientSum = gradientData.reduce(function (sum, [_, colorSum]) {
        return sum + colorSum;
    }, 0);

    const gradient = gradientData.reduce(function ([idx, partialGradient], [color, colorSum]) {
        const start = idx;
        const stop = idx + (colorSum / gradientSum * 100);

        return [stop, `${partialGradient}, ${color} ${Math.round(start)}%, ${color} ${Math.round(stop)}%`] as [number, string];
    }, [0, "linear-gradient(90deg"] as [number, string])[1];
</script>

<div class="emotion-card">
    <div class="header">
        <div class="glance-bar" style={`background: ${gradient}`}></div>
        <h3 class="timestamp">About 2 Hours Ago</h3>
    </div>
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
</div>

<style>
    ul {
        list-style: none;
    }

    .emotion-card {
        margin: var(--base-gutter);
        padding: var(--base-gutter);
        border-radius: var(--roundy-bit-softness);
        background: var(--card-background);
        box-shadow: var(--soft-shadow);
        border: 1px solid var(--middle-gray);

        /** Must be odd */
        --bullet-size: 11px;
        --list-gutter: 4px;
    }

    .header {
        display: flex;
        align-items: center;
        padding-bottom: calc(var(--base-gutter) / 2);
        margin-bottom: calc(var(--base-gutter) / 2);
        border-bottom: 1px dashed var(--middle-gray);
    }

    .glance-bar {
        height: 0.75rem;
        border-radius: 4px;
        flex: 1;
        margin-right: 32px;
        max-width: 64px;
    }

    .timestamp {
        font-weight: 600;
        text-align: right;
        margin-left: auto;
        color: var(--dark-gray);
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
