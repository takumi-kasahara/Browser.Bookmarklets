import { copyToClipboard } from '../modules/NavigatorExtensions.js';
import { is } from '../modules/WindowExtensions.js';

(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const host = location.host;
  const sub = getSubDomain();
  await copyToClipboard(`Copy ${sub ? 'subdomain' : 'host'}:`, sub || host);

  function getSubDomain(): string {
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
    const labels = host.split('.');
    const eTLD = eTLDs.find(e => host.endsWith(e));
    const offset = eTLD ? eTLD.split('.').length : 1;
    const domain = labels.slice(-offset - 1).join('.');
    if (is(domain)) return host.slice(0, host.length - domain.length - 1);
    return '';
  }
})();
