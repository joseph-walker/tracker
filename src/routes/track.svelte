<script lang="ts">
    import { spring } from 'svelte/motion';
    import { goto } from '$app/navigation';

    import type { Emotion } from "$lib/emotions";
    import { db } from '$lib/db';
    import { emotionGroups, emotionsForGroup } from "$lib/emotions";

    import EmotionButton from '$lib/components/EmotionButton.svelte';
    import PanelSlider from '$lib/components/PanelSlider.svelte';
    import Panel from '$lib/components/Panel.svelte';

    let note: string = "";
    let currentStep: number = 0;
    let selectedEmotions: Set<Emotion> = new Set();

    const containerOffset = spring(0, {
        stiffness: 0.05,
        damping: 0.5
    });

    $: $containerOffset = currentStep * -50;

    let notePlaceholder;
    $: {
        const emotionArray = [...selectedEmotions];

        switch (emotionArray.length) {
            case 0: notePlaceholder = "Today I felt..."; break;
            case 1: notePlaceholder = `Today I felt ${emotionArray[0]} beacause...`; break;
            case 2: notePlaceholder = `Today I felt ${emotionArray[0]} and ${emotionArray[1]} because...`; break;
            default: {
                const init = emotionArray.slice(0, -1);
                const last = emotionArray.slice(-1)[0];

                notePlaceholder = `Today I felt ${init.join(", ")}, and ${last} because...`;
            }
        }
    }

    // TODO: Maybe invert this, let this component control button toggle state? Is that "Svelte"-ier?
    const handleToggleEmotion = (emotion: Emotion) => (toggleEvent: CustomEvent<boolean>) => {
        if (toggleEvent.detail === true) {
            selectedEmotions.add(emotion);
        } else {
            selectedEmotions.delete(emotion);
        }

        selectedEmotions = selectedEmotions;
    }

    function trackEmotion() {
        db.events.add({
            emotions: [...selectedEmotions],
            date: new Date(),
            note
        });

        goto("/");
    }
</script>

<main class="wizard-viewport" style={`transform: translateY(${$containerOffset}%)`}>
    <section class="step step-1" class:active={currentStep === 0}>
        <PanelSlider sectionCount={emotionGroups.length}>
            <svelte:fragment slot="panels">
                {#each emotionGroups as emotionGroup}
                    <Panel title={emotionGroup}>
                        <div class="panel-buttons">
                            {#each emotionsForGroup(emotionGroup) as emotion}
                                <EmotionButton {emotion} on:toggle={handleToggleEmotion(emotion)}></EmotionButton>
                            {/each}
                        </div>
                    </Panel>
                {/each}
            </svelte:fragment>

            <button slot="additional-content" class="confirm-button" on:click={_ => currentStep = 1}>Track {selectedEmotions.size} Emotions</button>
        </PanelSlider>
    </section>

    <section class="step step-2" class:active={currentStep === 1}>
        <Panel title="Include a Note?">
            <svelte:fragment>
                <textarea class="notes" bind:value={note} placeholder={notePlaceholder}></textarea>
                <div class="buttons">
                    <button class="confirm-button" on:click={trackEmotion}>Confirm {selectedEmotions.size} Emotions</button>
                    <button class="back-button" on:click={_ => currentStep = 0}>Back</button>
                </div>
            </svelte:fragment>
        </Panel>
    </section>
</main>

<style>
    .wizard-viewport {
        width: 100%;
        /* This is hard coded! 100% * numSections - This is a hack */
        height: 200%;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .step {
        width: 100%;
        height: 100%;
    }

    .confirm-button {
        font-size: 1.2rem;
        background: var(--cta);
        color: #FFF;
        padding: 16px;
        text-align: center;
        border-radius: var(--roundy-bit-softness);
    }

    .back-button {
        font-size: 1.2rem;
        background: var(--middle-gray);
        color: var(--dark-gray);
        padding: 16px;
        text-align: center;
        border-radius: var(--roundy-bit-softness);
    }

    .step-1 .confirm-button {
        margin: var(--base-gutter);
    }

    .step-2 .confirm-button {
        flex: 1;
    }

    .buttons {
        width: 100%;
        display: flex;
        margin: auto 0 0 0;
    }

    .buttons .back-button {
        margin-left: var(--base-gutter)
    }

    .panel-buttons {
        flex-grow: 1;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: var(--base-gutter);
        grid-column-gap: var(--base-gutter);
    }

    .notes {
        padding: var(--base-gutter);
        background: var(--white);
        width: 100%;
        max-height: 200px;
        flex-grow: 1;
        border-radius: var(--roundy-bit-softness);
        border: 1px solid var(--middle-gray);
    }
</style>
