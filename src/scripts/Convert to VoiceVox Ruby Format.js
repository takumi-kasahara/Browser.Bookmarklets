/**
 * Convert to VoiceVox Ruby Format
 * @see {@link https://voicevox.hiroshiba.jp/how_to_use/#%E3%83%AB%E3%83%93%E6%A9%9F%E8%83%BD}
 */
(() => {
  if (!/https?:/.test(location.protocol)) return;

  for (const ruby of document.querySelectorAll('ruby')) {
    const rb = ruby.querySelector('rb');
    const rt = ruby.querySelector('rt');
    if (!rb || !rt) continue;

    const text = `｛${rb.textContent}｜${rt.textContent}｝`;
    ruby.replaceWith(document.createTextNode(text));
  }
})();
