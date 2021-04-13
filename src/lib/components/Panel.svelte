<script lang="ts">
    export let title: string;
</script>

<section class="panel">
    <h1 class="panel-header">{title}</h1>
    <slot></slot>
</section>

<style>
    :global(.picker-viewport .panel) {
        /* TODO: Restructure this so it's not horrible */
        padding-bottom: var(--base-gutter) !important;
    }

    .panel {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100vw;
        flex-grow: 0;
        flex-shrink: 0;
        color: #333;
        min-height: 100%;
        padding: var(--base-gutter);
        padding-bottom: calc(var(--navbar-height) + var(--base-gutter));
    }
</style>
