(() => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
  if (window.sessionStorage.length === 0) return;
  console.debug('SessionStorage:', window.sessionStorage);
  if (!window.confirm('Clear SessionStorage?')) return;
  window.sessionStorage.clear();
})();
