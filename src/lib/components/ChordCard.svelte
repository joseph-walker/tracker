<script>
    // D3js has horrible Typescript support. Just turn it off for this file.
    // @ts-nocheck

    import { onMount } from "svelte";

    import { db } from '$lib/db';
    import { getGroupAndLevel, emotionToColorMap } from "$lib/emotions";

    // anger, distress, fear, happiness, love, sadness
    const emotionMask = {
        anger:      0b000001,
        distress:   0b000010,
        fear:       0b000100,
        happiness:  0b001000,
        love:       0b010000,
        sadness:    0b100000
    };

    const chordMask = [
        [0b000001, 0b000011, 0b000101, 0b001001, 0b010001, 0b100001],
        [0b000011, 0b000010, 0b000110, 0b001010, 0b010010, 0b100010],
        [0b000101, 0b000110, 0b000100, 0b001100, 0b010100, 0b100100],
        [0b001001, 0b001010, 0b001100, 0b001000, 0b011000, 0b101000],
        [0b010001, 0b010010, 0b010100, 0b011000, 0b010000, 0b110000],
        [0b100001, 0b100010, 0b100100, 0b101000, 0b110000, 0b100000],
    ].flat(1);

    const colors = Object.values(emotionToColorMap);

    let root;

    onMount(async function () {
        const events = await db.events.orderBy("date").reverse().toArray();

        const eventEmotions = events.map(
            e => [...new Set(
                    e.emotions
                        .map(getGroupAndLevel)
                        .map(gl => gl[0])
                )]
                    .map(e => emotionMask[e])
                    .reduce((a, b) => a + b, 0)
        );

        const appliedMask = eventEmotions.map(
            e => chordMask.map(m => (e & m) === m ? 1 : 0)
        );

        const sum = [...new Array(36)].map(_ => 0);

        for (let i = 0; i < 36; i++) {
            for (let j = 0; j < appliedMask.length; j++) {
                sum[i] += appliedMask[j][i];
            }
        }

        const chordMatrix = [
            sum.slice(0, 6),
            sum.slice(6, 12),
            sum.slice(12, 18),
            sum.slice(18, 24),
            sum.slice(24, 30),
            sum.slice(30, 36),
        ];

        console.log(chordMatrix);

        const resultant = d3.chord()
            .padAngle(0.02)
            .sortSubgroups(d3.descending)
            (chordMatrix);

        const svg = d3.create("svg");

        const canvas = svg
            .attr("viewBox", "0 0 100 100")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .append("g")
                .attr("transform", "translate(50, 50)");

        canvas
            .datum(resultant)
            .append("g")
            .attr("class", "groups")
            .selectAll("g")
            .data(d => d.groups)
            .enter()
            .append("path")
                .style("fill", d => colors[d.index])
                .attr("d", d3.arc().innerRadius(45).outerRadius(50));

        canvas
            .datum(resultant.filter(d => d.source.index !== d.target.index))
            .append("g")
            .attr("class", "ribbons")
            .selectAll("g")
            .data(d => d)
            .enter()
            .append("path")
                .attr("d", d3.ribbon().radius(44.5))
                .style("fill", d => colors[d.source.index]);

        root.append(svg.node());
    });
</script>

<section class="card">
    <div class="chord-diagram" bind:this={root}></div>
    <dl class="summary">
        <dt>Most Frequent Emotion</dt>
        <dd>• Happiness</dd>

        <dt>Most Common Pairing</dt>
        <dd>• Sadness × Fear</dd>

        <dt>Least Common Pairing</dt>
        <dd>• Happiness × Sadness</dd>
    </dl>
</section>

<style>
    .card {
        margin-bottom: var(--base-gutter);
        padding: var(--base-gutter);
        border-radius: var(--roundy-bit-softness);
        background: var(--card-background);
        box-shadow: var(--soft-shadow);
        border: 1px solid var(--middle-gray);
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    :global(.chord-diagram .ribbons) {
        stroke: var(--white);
        stroke-width: 0.5pt;
    }

    .summary {
        margin-left: var(--base-gutter);
    }

    .summary dt {
        font-weight: 600;
        color: var(--dark-gray);
    }

    .summary dd {
        margin-bottom: var(--base-gutter);
        margin-top: 2px;
        font-size: 1rem;
    }
</style>
