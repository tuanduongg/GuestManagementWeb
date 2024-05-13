import { ConfigRouter } from 'config_router';

export const ConfigMenuAlias = [
  { path: ConfigRouter.listGuest.url, alias: 'LIST_GUEST' },
  { path: ConfigRouter.user.url, alias: 'USER' },
  { path: ConfigRouter.listProduct.url, alias: 'LIST_PRODUCT' },
  { path: ConfigRouter.listOrder.url, alias: 'LIST_ORDER' },
  { path: ConfigRouter.managementProduct.url, alias: 'MANAGE_PRODUCT' },
];
