
<script lang="ts">
    import type { Emotion, EmotionLevel, EmotionGroup } from "$lib/emotions";
    import { emotionToColor, reconstructEmotionMap } from "$lib/emotions";

    export let emotions: Emotion[];

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

<div class="glance-bar" style={`background: ${gradient}`}></div>

<style>
    .glance-bar {
        height: 0.75rem;
        border-radius: 4px;
        flex: 1;
        margin-right: 32px;
        max-width: 64px;
    }
</style>
