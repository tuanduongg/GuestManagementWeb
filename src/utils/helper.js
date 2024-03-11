import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Tag, Popover, Modal, Badge } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import { ConfigRouter } from 'config_router';
import dayjs from 'dayjs';
import config from 'config';
import { ConfigMenuAlias } from 'ConfigMenuAlias';
import restApi from './restAPI';
import { RouterAPI } from './routerAPI';

export function generateRandomVNLicensePlate() {
  // Mã tỉnh/thành phố
  const provinceCodes = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79',
    '80',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99'
  ];

  // Loại xe
  const vehicleTypes = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Số seri đăng ký xe
  const randomNumber = Math.floor(Math.random() * 9999) + 1;

  // Tạo biển số xe
  const licensePlate =
    provinceCodes[Math.floor(Math.random() * provinceCodes.length)] +
    vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)] +
    '-' +
    randomNumber.toString().padStart(5, '0');

  return licensePlate;
}
export const statusName = {
  NEW: 'NEW',
  ACCEPT: 'ACCEPT',
  COME_IN: 'COME_IN'
};
export function addZero(num) {
  return (num < 10 ? '0' : '') + num;
}
export const formatDateFromDB = (dateString) => {
  // Tạo một đối tượng Date từ chuỗi
  var date = new Date(dateString);

  // Lấy các thành phần thời gian
  var hours = date.getHours();
  var minutes = date.getMinutes();

  // Lấy các thành phần ngày
  var day = date.getDate();
  var month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0 nên cần cộng thêm 1
  var year = date.getFullYear();

  // Hàm để thêm số 0 trước các giá trị nhỏ hơn 10

  // Tạo chuỗi định dạng
  return addZero(hours) + ':' + addZero(minutes) + ' ' + addZero(day) + '/' + addZero(month) + '/' + year;
};
const shortStringNum = (num) => {
  if (num < 1) return '';
  return num;
};
export function compareDateTime(dateTimeString) {
  if (!dateTimeString) return null;
  const now = new Date();
  const targetDate = new Date(dateTimeString);
  const diffInDays = differenceInDays(targetDate, now);
  const diffHours = differenceInHours(targetDate, now);
  const diffMinus = differenceInMinutes(targetDate, now);
  if (diffInDays < 1) {
    if (diffHours < 1) {
      if (diffMinus < 1) {
        return null;
      } else {
        return `${diffMinus}p`;
      }
    } else {
      return `${diffHours}h`;
    }
  } else {
    return `${diffInDays} ngày`;
  }
}
export const listNameStatus = () => {
  let arr = [];
  Object.values(statusName).map((item) => {
    let message = '';
    if (item) {
      switch (item) {
        case statusName.NEW:
          message = 'Mới';
          break;
        case statusName.ACCEPT:
          message = 'Đã duyệt';
          break;
        case statusName.COME_IN:
          message = 'Đã vào';
          break;
        case statusName.COME_OUT:
          message = 'Đã ra';
          break;

        default:
          break;
      }
    }
    arr.push({
      text: message,
      value: item
    });
  });
  return arr;
};
export const getNameStatus = (status) => {
  let message = '';
  if (status) {
    switch (status) {
      case statusName.NEW:
        message = 'Mới';
        break;
      case statusName.ACCEPT:
        message = 'Đã duyệt';
        break;
      case statusName.COME_IN:
        message = 'Đã vào';
        break;
      case statusName.COME_OUT:
        message = 'Đã ra';
        break;

      default:
        break;
    }
  }
  return message;
};
function tinhKhoangCachDenThoiGian(chuoiThoiGian) {
  // Lấy thời gian hiện tại
  var thoiGianHienTai = new Date();

  // Chuyển đổi chuỗi thời gian đầu vào thành một đối tượng Date
  var thoiGianCanTinh = new Date();
  var gioPhut = chuoiThoiGian.split(':');
  thoiGianCanTinh.setHours(parseInt(gioPhut[0], 10));
  thoiGianCanTinh.setMinutes(parseInt(gioPhut[1], 10));
  thoiGianCanTinh.setSeconds(0); // Đặt giây là 0 để tránh sai số

  // Tính khoảng cách thời gian
  var khoangCach = thoiGianCanTinh.getTime() - thoiGianHienTai.getTime();

  var gio = Math.floor(khoangCach / (1000 * 60 * 60));

  // Tính số phút còn lại sau khi đã tính số giờ
  var phut = Math.floor((khoangCach % (1000 * 60 * 60)) / (1000 * 60));
  if (gio <= 0 && phut <= 0) {
    return null;
  }
  if (gio > 0) {
    return `${gio}h`;
  } else {
    return `${phut}p`;
  }
}
export const getColorChipStatus = (status, timeInExpected) => {
  // console.log('compareDateTime(timeInExpected)', compareDateTime(timeInExpected));
  let color = '';
  let message = '';
  switch (status) {
    case statusName.NEW:
      color = '#16a34a';
      message = 'Mới';
      break;
    case statusName.ACCEPT:
      color = '#0ea5e9';
      message = 'Đã duyệt';
      break;
    case statusName.COME_IN:
      color = '#1e3a8a';
      // color = 'geekblue';
      message = 'Đã vào';
      break;
    case statusName.COME_OUT:
      color = '#44403c';
      message = 'Đã ra';
      break;

    default:
      break;
  }
  return <Badge color={color} count={message} />;
  // return (
  //   <Tag color={color} key={status}>
  //     {message}
  //   </Tag>
  // );
};

export function isMobile() {
  if (window) {
    return window.matchMedia(`(max-width: 767px)`).matches;
  }
  return false;
}

export function isMdScreen() {
  if (window) {
    return window.matchMedia(`(max-width: 1366px)`).matches;
  }
  return false;
}

export const ROLE_ACC = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  SECURITY: 'SECURITY'
};
export const STATUS_ACC = {
  ACTIVE: 'ACTIVE',
  BLOCK: 'BLOCK'
};
export const getChipStatusAcc = (status) => {
  let color = '';
  let text = '';
  switch (status) {
    case true:
      text = 'Active';
      color = 'green';
      break;
    case false:
      text = 'Block';
      color = 'volcano';
      break;
    default:
      break;
  }
  return (
    <Tag color={color} key={text}>
      {text}
    </Tag>
  );
};

export function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
export function eraseCookie(name) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const delete_cookie = (name) => {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const logout = () => {
  Modal.confirm({
    okText: 'Đăng xuất',
    cancelText: 'Đóng',
    centered: true,
    title: 'Thông báo',
    content: 'Bạn chắc chắn muốn đăng xuất?',
    onOk: () => {
      delete_cookie('ASSET_TOKEN');
      setCookie('ASSET_TOKEN', '', 1);
      location.href = ConfigRouter.login;
    }
  });
};

export function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
export const formatDateDayjs = (date) => {
  if (date) {
    return dayjs(date).format(config?.dateFormat);
  }
  return '';
};

export const formatArrDate = (arr = []) => {
  if (arr && arr?.length > 0) {
    const result = arr.map((item, index) => {
      return formatDateDayjs(item);
    });
    return result;
  }
  return [];
};

export const formatHourMinus = (date) => {
  if (date) {
    return dayjs(date).format(config?.hourFormat);
  }
  return '';
};
export const getMenuAlias = () => {
  const currentPath = window.location.pathname;
  const menu = ConfigMenuAlias.find((item) => {
    if (currentPath.length > item.path.length) {
      let path = currentPath.slice(0, -1);
      return path === item.path;
    } else {
      return currentPath === item.path;
    }
  });
  return menu?.alias ?? '';
};

export const getDataUserFromLocal = () => {
  let dataString = localStorage.getItem('DATA_USER');
  if (dataString) {
    return JSON.parse(dataString);
  }
  return {};
};
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
export const registerPushNotification = async () => {
  const swRegistration = await navigator?.serviceWorker?.ready;
  if (swRegistration) {
    const subscription = await swRegistration?.pushManager?.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
    });
    console.log('subscription', subscription);
    const rest = await restApi.post(RouterAPI.notifi_subscribe, { data: JSON.stringify(subscription) });
    console.log('resst', rest);
  }
};
export const requestPermisstionNoti = () => {
  if (!('Notification' in window)) {
    // Check if the browser supports notifications
    console.log('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    console.log('this browser accepted notification!');
  } else if (Notification.permission !== 'denied') {
    console.log('vao requestPermission');
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        registerPushNotification();
      }
    });
  }
};
