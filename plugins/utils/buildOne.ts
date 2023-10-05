import { sveltePlugin } from "../svelte.ts";

export const clientBuild = async ( entries: string[] ) => {
    return await Bun.build( {
        entrypoints: entries,
        splitting: false,
        target: 'browser',
        minify: true,
        plugins: [ sveltePlugin( { ssr: true } ) ],
    } );
};