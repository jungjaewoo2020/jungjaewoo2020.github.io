'use strict';
// Optional compact mode for Google Sites and other iframe hosts.
if (new URLSearchParams(window.location.search).get('embed') === '1') {
  document.documentElement.classList.add('is-embedded');
}
