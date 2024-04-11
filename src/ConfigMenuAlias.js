import { ConfigRouter } from 'config_router';

export const ConfigMenuAlias = [
  { path: ConfigRouter.listGuest.url, alias: 'LIST_GUEST' },
  { path: ConfigRouter.user.url, alias: 'USER' }
];
