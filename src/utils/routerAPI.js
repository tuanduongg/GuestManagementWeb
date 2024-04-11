export const RouterAPI = {
  login: 'auth/login',
  profile: 'auth/profile',
  notifi_subscribe: 'notification/subscription',

  addGuest: 'guest/add',
  updateGuest: 'guest/update',
  deleteGuest: 'guest/delete',
  findByIdGuest: 'guest/findById',
  cancelGuest: 'guest/cancel',
  allGuest: 'guest/all',

  exportGuest: '/guest/export',

  updateGuestInfo: 'guest-info/update',
  deleteGuestInfo: 'guest-info/delete',

  checkRole: 'role/check',
  allRole: 'role/all',
  addRole: 'role/add',
  updateRole: 'role/update',

  changeStatusGuest: 'guest/change-status',

  userAll: 'user/all',
  addUser: 'user/add',
  editUser: 'user/edit',
  changeBlockUser: 'user/change-block',
  changePassword: 'user/change-password',

  getHistoryGuest: 'history-guest/findByGuest',

  getVapidKey: 'firebase/getKey',
  storeToken: 'firebase/store-token',

  getProductPubic: '/product/public',
  getAllProduct: '/product/all',
  addProduct: '/product/add',
  editProduct: '/product/edit',
  updateProduct: '/product/update',
  deleteProduct: '/product/delete',
  changePublicProduct: '/product/changePublic',
  upLoadExcel: '/product/uploadExcel',

  getAllUnit: '/unit/all',

  getAllCategory: 'category/all',

  deleteImageByID: 'image/delete'
};
