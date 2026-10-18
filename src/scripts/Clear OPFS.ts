(async () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
  const directory = await navigator.storage.getDirectory();
  if (!directory) return;
  const entryNames: string[] = [];
  for await (const [name] of directory.entries()) entryNames.push(name);
  if (entryNames.length === 0) return;
  console.debug('OPFS:', entryNames);
  if (!window.confirm('Clear OPFS?')) return;
  await Promise.all(
    entryNames.map(name => directory.removeEntry(name, { recursive: true })),
  );
})();
