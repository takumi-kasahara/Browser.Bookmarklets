(() => {
  if (!/https?:/.test(location.protocol)) return;
  if (location.hostname === 'web.archive.org') return;

  window.open(
    `https://web.archive.org/web/*/${location.href}`,
    '_blank',
    'noreferrer',
  );
})();
