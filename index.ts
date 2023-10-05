import Elysia from "elysia";

import { port, serveDirectories, serveFromDir, serveFromRouter } from "./lib.ts";
import { build } from "./build.ts";
import { ElysiaWS } from "elysia/ws";
// import App from './pages/index.svelte'
// const appster = App
// await build()


const app = new Elysia()
    .get( '*', async ( ctx ) => {
        // console.log(ctx.request);
        const routerRes = await serveFromRouter(ctx.request)
        if (routerRes) { 
            return routerRes
        }

        let reqPath = new URL( ctx.request.url ).pathname;
              if ( reqPath === "/" )
              {
                reqPath = "/index.html";
              }
        const serveDirectory = serveFromDir( serveDirectories, reqPath );
      if ( serveDirectory )
      {
        return serveDirectory;
      }
    } ).listen(port)
console.log(`http://localhost:${port}`);

export type ElysiaApp = typeof app