import { copyToClipboard } from '../modules/NavigatorExtensions.js';
(async () => await copyToClipboard('Copy Title:', document.title.trim()))();
