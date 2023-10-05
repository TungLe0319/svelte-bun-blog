const moduleCache : Record<string, string> = {}
async function loadModule(modulePath: string) {
    if (!moduleCache[modulePath]) {
      const module = await import(modulePath);
      moduleCache[modulePath] = module;
    }
    return moduleCache[modulePath];
  }

  async function updateModule(modulePath:string) {
    if (moduleCache[modulePath]) {
      // Remove the module from the cache to ensure a fresh import
      delete moduleCache[modulePath];
    }
  
    const module = await loadModule(modulePath);
    // Apply updates as needed
    // For example, you might update component props or re-render the UI
  }