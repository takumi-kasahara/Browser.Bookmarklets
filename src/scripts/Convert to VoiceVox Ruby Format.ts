(async () => {
  if (!/https?:/.test(location.protocol)) return;

  const rubies = document.querySelectorAll('ruby');
  for (const ruby of rubies) {
    const rb = ruby.querySelector('rb');
    const rt = ruby.querySelector('rt');
    if (rb && rt) {
      const replacement = document.createElement('span');
      replacement.textContent = `｛${rb.textContent}｜${rt.textContent}｝`;
      ruby.replaceWith(replacement);
    }
  }
})();
