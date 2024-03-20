export const RouterAPI = {
  login: 'auth/login',
  profile: 'auth/profile',
  notifi_subscribe: 'notification/subscription',

  addGuest: 'guest/add',
  updateGuest: 'guest/update',
  deleteGuest: 'guest/delete',
  findByIdGuest: 'guest/findById',
  allGuest: 'guest/all',
  updateGuestInfo: 'guest-info/update',
  deleteGuestInfo: 'guest-info/delete',

  checkRole: 'role/check',
  allRole: 'role/all',
<<<<<<< HEAD
  addRole: 'role/add',
=======
>>>>>>> da2b1c8d487c9204a3629d5adc764bae2a5428a9

  changeStatusGuest: 'guest/change-status',

  userAll: 'user/all',
  addUser: 'user/add',
  editUser: 'user/edit',
  changeBlockUser: 'user/change-block',

  getVapidKey: 'firebase/getKey',
  storeToken: 'firebase/store-token'
};
