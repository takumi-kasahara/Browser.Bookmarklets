import { select } from '../modules/WindowExtensions';

(() =>
  /^https?:$/.test(location.protocol) || location.protocol === 'file:'
    ? select()
    : void 0)();
