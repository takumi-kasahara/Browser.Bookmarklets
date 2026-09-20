import { select } from '../modules/WindowExtensions.js';

(() => (/https?:/.test(location.protocol) ? select() : void 0))();
