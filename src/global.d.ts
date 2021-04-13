/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

import type d3 from "d3";

declare global {
    const d3: typeof d3;
}
