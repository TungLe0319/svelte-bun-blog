
// @ts-ignore

// const moduleCache: Record<string, string> = {}

// async function loadModule(modulePath: string) {
//     try {
//       if (!moduleCache[modulePath]) {
//         const module = await import(modulePath);
//         moduleCache[modulePath] = module;
//       }
//       return moduleCache[modulePath];
//     } catch (error) {
//       console.error('Error loading module:', error);
//       throw error;
//     }
//   }

//   async function updateModule(modulePath:string) {
//     if (moduleCache[modulePath]) {
//       // Remove the module from the cache to ensure a fresh import
//       delete moduleCache[modulePath];
//     }
  
//     const module = await loadModule(modulePath);
//     return module
//     // Apply updates as needed
//     // For example, you might update component props or re-render the UI
//   }
// @ts-ignore
const App = (await import(globalThis.PATH_TO_PAGE))
new App.default({ target:  document.getElementById('root'), hydrate: true })

if (process.env.NODE_ENV !== 'production') {
    const ws = new WebSocket('ws://localhost:8080/ws');
    ws.addEventListener('message', async(data) => {
        const message = data.data
        if (message === 'reload' || message === window.location.pathname) {
            window.location.reload()
        }
    })
    ws.addEventListener('open', () => {
        // Send current pathname to server
        ws.send(window.location.pathname);
    });
}


