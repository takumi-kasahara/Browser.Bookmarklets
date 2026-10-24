(() => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
  if (!document.cookie) return;

  const cookies: Record<string, string> = {};
  for (const cookie of document.cookie.split(';')) {
    const trimmed = cookie.trim();
    const separatorIndex = trimmed.indexOf('=');
    const key
      = separatorIndex === -1 ? trimmed : trimmed.slice(0, separatorIndex);
    const value
      = separatorIndex === -1 ? '' : trimmed.slice(separatorIndex + 1);
    cookies[key] = value;
  }
  console.debug('Cookies:', cookies);
})();
