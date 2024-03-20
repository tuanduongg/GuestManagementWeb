import { ConfigMenuAlias } from 'ConfigMenuAlias';

export const INITIAL_PERMISSTION = ConfigMenuAlias.map((item, index) => {
  return {
    screen: item.alias,
    isRead: false,
    isCreate: false,
    isUpdate: false,
    isDelete: false,
    isAccept: false
  };
});
