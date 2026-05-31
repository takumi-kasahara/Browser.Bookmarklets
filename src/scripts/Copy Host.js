import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { is } from '../modules/WindowExtensions.js';
(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const subDomain = getSubDomain();
  const hostname = !subDomain
    ? location.hostname.replace(/^www\./, '')
    : subDomain === 'www'
      ? location.hostname.replace(/^www\./, '')
      : location.hostname.replace(RegExp(`^${subDomain}\\.`), '*.');
  await copyToClipboard('Copy Host:', `${hostname}/*`);

  function getSubDomain() {
    const eTLDs = [
      'ac.jp',
      'co.jp',
      'ed.jp',
      'go.jp',
      'gr.jp',
      'lg.jp',
      'ne.jp',
      'or.jp',
    ];
    for (const eTLD of eTLDs)
      if (is(eTLD))
        return location.hostname.split('.').slice(0, -(eTLD.split('.').length + 1)).join('.');
    return location.hostname.split('.').slice(0, -2).join('.');
  }
})();
