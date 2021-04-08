<svelte:head>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@500;600&display=swap" rel="stylesheet">
</svelte:head>

<slot></slot>

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
</style>
