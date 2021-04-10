<script lang="ts">
    import { page } from "$app/stores";

    import Plus from '$lib/components/icons/Plus.svelte';
    import Timeline from '$lib/components/icons/Timeline.svelte';
    import Home from '$lib/components/icons/Home.svelte';

    $: isActive = (path) => {
        return $page.path === path;
    }
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@500;600&display=swap" rel="stylesheet">
</svelte:head>

<slot></slot>

<nav class="navbar">
    <a href="/" class:active={isActive("/")}><i><Home></Home></i>Home</a>
    <a href="/timeline" class:active={isActive("/timeline")}><i><Timeline></Timeline></i>Timeline</a>
    <a href="/track" class:active={isActive("/track")}><i><Plus></Plus></i>Track</a>
</nav>

<style>
    :root {
        --white: #FFF;
        --rich-black: #333;
        --light-gray: #f2f7ff;
        --middle-gray: #dadee4;
        --dark-gray: #686973;
        --green: #20c879;
        --blue: #6e91fb;
        --orange: #ff956a;
        --purple: #df6ddb;
        --yellow: #fcb855;
        --red: #d63031;

        --root-measure: 12px;
        --base-gutter: 16px;
        --roundy-bit-softness: 8px;

        --card-background: var(--white);
        --background: var(--light-gray);
        --text: var(--rich-black);
        --primary: var(--blue);
        --cta: var(--green);
        --soft-shadow: 0px 3px 5px rgb(152 152 152 / 12%);
        --heavy-shadow: 0px 3px 5px rgb(152 152 152 / 36%);
        --navbar-height: 64px;
    }

    :global(html, body, #svelte, .app-container) {
        height: 100%;
    }

    :global(html) {
        font-size: var(--root-measure);
        color: var(--text);
    }

    :global(body) {
        font-family: 'Lexend', sans-serif;
        background: var(--background);
        overflow: hidden;
    }

    .navbar {
        height: 64px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        background: var(--white);
        box-shadow: 0px -2px 4px rgb(152 152 152 / 12%);
        border-top: 1px solid var(--middle-gray);
        place-items: center;
        z-index: 10;
    }

    .navbar a {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        width: 100%;
        color: var(--dark-gray);
        font-size: 0.9rem;
    }

    .navbar a.active:before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        content: "";
        background: var(--cta);
    }

    .navbar a i {
        fill: var(--dark-gray);
        display: block;
        width: 1.2rem;
        height: 1.2rem;
        margin-bottom: 2px;
    }
</style>
