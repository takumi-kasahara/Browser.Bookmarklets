(() => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
  const cookies = document.cookie;
  if (!cookies) return;

  for (const cookie of cookies.split(';')) {
    const trimmed = cookie.trim();
    const separatorIndex = trimmed.indexOf('=');
    const key
      = separatorIndex === -1 ? trimmed : trimmed.slice(0, separatorIndex);
    const value
      = separatorIndex === -1 ? '' : trimmed.slice(separatorIndex + 1);
    console.debug('Cookies:', key, value);
  }
})();
