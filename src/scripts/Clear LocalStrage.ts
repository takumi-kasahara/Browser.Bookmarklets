(() => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
  if (window.localStorage.length === 0) return;
  console.debug('LocalStrage:', window.localStorage);
  if (!window.confirm('Clear LocalStrage?')) return;
  window.localStorage.clear();
})();
