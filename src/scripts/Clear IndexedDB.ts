(async () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
  const databases = await window.indexedDB.databases();
  if (databases.length === 0) return;
  for (const info of databases) {
    const name = info.name;
    if (!name) continue;
    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(name);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      const storeNames = Array.from(db.objectStoreNames);
      const contents: Record<string, unknown[]> = {};
      for (const storeName of storeNames) {
        contents[storeName] = await new Promise<unknown[]>(
          (resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result as unknown[]);
            request.onerror = () => reject(request.error);
          },
        );
      }
      console.debug('IndexedDB:', name, contents);
      db.close();
    }
    catch (e) {
      console.debug('IndexedDB:', name, e);
    }
  }
  if (!window.confirm('Clear IndexedDB?')) return;
  for (const database of await window.indexedDB.databases())
    if (database.name) window.indexedDB.deleteDatabase(database.name);
})();
