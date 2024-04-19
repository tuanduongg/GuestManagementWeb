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
  getAllProduct: '/product/all',
  addProduct: '/product/add',
  editProduct: '/product/edit',
  updateProduct: '/product/update',
  deleteProducts: '/product/delete',
  changePublicProduct: '/product/changePublic',
  upLoadExcelProduct: '/product/uploadExcel',

  getAllUnit: '/unit/all',


  allDepartment: '/department/all',
  addDepartment: '/department/add',
  updateDepartment: '/department/update',

  getAllCategory: '/category/all',
  addCategory: '/category/add',
  updateCategory: '/category/update',

  deleteImageByID: 'image/delete'
};
