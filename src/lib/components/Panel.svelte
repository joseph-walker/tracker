<script lang="ts">
    export let title: string;
</script>

<section class="panel">
    <h1 class="panel-header">{title}</h1>
    <slot></slot>
</section>

<style>
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
</style>
