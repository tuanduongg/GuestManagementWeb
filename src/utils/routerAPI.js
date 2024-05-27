export const RouterAPI = {
  login: 'auth/login',
  logout: 'user/logout',
  profile: 'auth/profile',
  notifi_subscribe: 'notification/subscription',

  addGuest: 'guest/add',
  updateGuest: 'guest/update',
  deleteGuest: 'guest/delete',
  findByIdGuest: 'guest/findById',
  cancelGuest: 'guest/cancel',
  allGuest: 'guest/all',

  exportGuest: '/guest/export',
  exportImageGuest: '/guest/export-image',

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
  addProduct: '/product/add',
  editProduct: '/product/edit',
  updateProduct: '/product/update',
  deleteProducts: '/product/delete',
  getAllProduct: '/product/all',
  changePublicProduct: '/product/changePublic',
  upLoadExcelProduct: '/product/uploadExcel',

  getAllOrder: '/order/all',
  detailOrder: '/order/detail',
  detailOrderWithAllStatus: '/order/detail-with-status',
  addNewOrder: '/order/add',
  cancelOrder: '/order/cancel',
  changeStatusOrder: '/order/change-status',

  findStatusByDepartment: '/status/findByDepartment',
  getAllUnit: '/unit/all',

  allDepartment: '/department/all',
  addDepartment: '/department/add',
  updateDepartment: '/department/update',

  getAllCategory: '/category/all',
  addCategory: '/category/add',
  updateCategory: '/category/update',
  findByTypeCategory: '/category/findByType',

  deleteImageByID: 'image/delete',

  addDevice: 'device/add',
  allDevice: 'device/all',
  changeStatusDevice: 'device/change-status',
  statisticDevice: 'device/statistic',
  detailDevice: 'device/detail',
};
