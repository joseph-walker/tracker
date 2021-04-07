<script lang="ts">
    import { spring } from 'svelte/motion';

    import type { Emotion } from "$lib/emotions";
    import { db } from '$lib/db';
    import { emotionGroups, emotionsForGroup } from "$lib/emotions";

    import EmotionButton from '$lib/components/EmotionButton.svelte';
    import PanelSlider from '$lib/components/PanelSlider.svelte';
    import Panel from '$lib/components/Panel.svelte';

    let currentStep: number = 0;
    let selectedEmotions: Set<Emotion> = new Set();

    const containerOffset = spring(0, {
        stiffness: 0.12,
        damping: 0.9
    });

    $: $containerOffset = currentStep * -100;

    // TODO: Maybe invert this, let this component control button toggle state? Is that "Svelte"-ier?
    const handleToggleEmotion = (emotion: Emotion) => (toggleEvent: CustomEvent<boolean>) => {
        if (toggleEvent.detail === true) {
            selectedEmotions.add(emotion);
        } else {
            selectedEmotions.delete(emotion);
        }

        selectedEmotions = selectedEmotions;
    }

    function completeStep0() {
        currentStep = 1;
    }
</script>

<main class="wizard-viewport" style={`transform: translateY(${$containerOffset}vh)`}>
    <section class="step" class:active={currentStep === 0}>
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

            <button slot="additional-content" class="confirm-button" on:click={completeStep0}>Track {selectedEmotions.size} Emotions</button>
        </PanelSlider>
    </section>

    <section class="step" class:active={currentStep === 1}>
        <h1>Ohhai</h1>
    </section>
</main>

<style>
    .wizard-viewport {
        width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .step {
        width: 100%;
        height: 100vh;
    }

    .confirm-button {
        font-size: 1.2rem;
        background: var(--cta);
        color: #FFF;
        padding: 16px;
        margin: var(--base-gutter);
        text-align: center;
        border-radius: var(--roundy-bit-softness);
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
