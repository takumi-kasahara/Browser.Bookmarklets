import { select } from '../modules/WindowExtensions';

(() => (/^https?:$/.test(location.protocol) ? select() : void 0))();
