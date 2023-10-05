import { Subprocess, spawn, spawnSync } from "bun";
import { WatchEventType, watch } from "fs";

import Elysia from "elysia";
import { Server } from 'bun'
import { BUILD_DIR } from "./lib.ts";
import { clientBuild } from "./plugins/utils/buildOne.ts";
import { build } from "./build.ts";

// const start = Bun.nanoseconds()
await build(false)

let serverProcess: Subprocess | null = null;
let isRestarting = false;

const server: { instance: null | Server } = { instance: null }

// we need a seperate server instance because the main one will turn off while reloading
const app = new Elysia()
.ws('/ws', {
  message(ws, message) {
      ws.send('hello world!')
  },
  open ( ws ) {
    ws.subscribe('refreshEvent')
    console.log("LiveReload listening on ws://localhost:8080/ws");
  }
}).listen(8080, (serv) =>{
    server.instance = serv
})


function startServer() {
    isRestarting = true;
    // console.log( 'Starting server...' );
    serverProcess = spawn( {
        cmd: [ 'bun', 'index.ts' ],
        env: Bun.env,
        stdio: [ 'inherit', 'inherit', 'inherit' ]
    } );
    const exitCode = serverProcess.exitCode;
    if ( exitCode )
    {
        process.exit( exitCode );
    }
    return serverProcess;
}

// Start the server initially
startServer();




const fileWatch = async ( event: WatchEventType, filename: string | Error | undefined ) => {
    // const start = Bun.nanoseconds()
    console.log(filename);
    
    if ( filename instanceof Error )
    {
        process.exit( 1 );
    }


    
    if (filename?.includes('build' || 'node_modules') || event !== 'change') {
        
        return false
    }
        console.log( `Detected ${ event } in ${ filename }` );
        const start = Bun.nanoseconds()
    if ( serverProcess )
    {

        const filePath = BUILD_DIR + '/client/pages/' + filename?.split('.')[0] + '.js'
        console.log(filePath);
        
        const sourcePath = process.cwd() + '/pages/' +  filename
       const outputs = (await clientBuild([sourcePath])).outputs
        await Bun.write(filePath, outputs)

        isRestarting = false;

        const end = Bun.nanoseconds()
        console.log('refreshed in ', (end - start) / 1000000);
        
        server.instance?.publish('refreshEvent', 'reload')
            
    }

};

const watcher = watch(
    import.meta.dir + '/pages',
    { recursive: true },
    fileWatch
);
// const watcher2 = watch(
//     import.meta.dir + '/components',
//     { recursive: true },
//     fileWatch
// );

