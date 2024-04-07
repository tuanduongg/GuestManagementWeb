import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Tag, Popover, Modal, Badge } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import { ConfigRouter } from 'config_router';
import dayjs from 'dayjs';
import config from 'config';
import { ConfigMenuAlias } from 'ConfigMenuAlias';
import restApi from './restAPI';
import { RouterAPI } from './routerAPI';
import i18next from 'i18next';

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
  CANCEL: 'CANCEL',
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
        case statusName.CANCEL:
          message = 'status_cancel';
          break;
        case statusName.NEW:
          message = 'status_new';
          break;
        case statusName.ACCEPT:
          message = 'status_accepted';
          break;
        case statusName.COME_IN:
          message = 'status_comein';
          break;
        case statusName.COME_OUT:
          message = 'Come out';
          break;

        default:
          break;
      }
    }
    arr.push({
      text: i18next.t(message),
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
      case statusName.CANCEL:
        message = 'Đã hủy';
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
export const getColorChipStatus = (status, deleteAt) => {
  // console.log('compareDateTime(timeInExpected)', compareDateTime(timeInExpected));
  let color = '';
  let message = '';
  if (deleteAt) {
    return <Badge color={'#f5222d'} count={'Đã hủy'} />;
  }
  switch (status) {
    case statusName.NEW:
      color = '#16a34a'; //success color
      message = 'status_new';
      break;
    case statusName.ACCEPT:
      color = '#0ea5e9';
      message = 'status_accepted';
      break;
    case statusName.COME_IN:
      color = '#1e3a8a';
      message = 'status_comein';
      break;
    case statusName.COME_OUT:
      color = '#44403c';
      message = 'Come out';
      break;
    case statusName.CANCEL:
      color = '#f5222d';
      message = 'status_cancel';
      break;

    default:
      break;
  }

  return <Badge color={color} count={i18next.t(message)} />;
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
export function isTablet() {
  if (window) {
    return window.matchMedia('(min-width: 768px) and (max-width: 1359px)').matches;
  }
  return false;
}

export function isMdScreen() {
  if (window) {
    return window.matchMedia(`(max-width: 1366px)`).matches;
  }
  return false;
}
export const formattingVND = (num) => {
  if (isString(num) && num?.includes('.')) {
    const rs = num + ' vnđ';
    return rs.replace(',', '.');
  }
  const number = parseFloat(num);
  if (isNaN(number)) {
    return 0 + ' vnđ';
  }
  let result = number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  return isMobile() ? result.replace('VND', 'đ') : result.replace('VND', 'vnđ');
};

export const ROLE_ACC = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  SECURITY: 'SECURITY'
};
export const STATUS_ACC = {
  ACTIVE: true,
  BLOCK: false
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
      text = 'Block';
      color = 'volcano';
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

export const delete_cookie = (name) => {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const logout = () => {
  Modal.confirm({
    okText: i18next.t('logout'),
    cancelText: i18next.t('close'),
    centered: true,
    title: i18next.t('msg_notification'),
    content: i18next.t('msg_logout'),
    onOk: () => {
      handleLogout();
    }
  });
};
export const handleLogout = () => {
  delete_cookie('ASSET_TOKEN');
  setCookie('ASSET_TOKEN', '', 1);
  location.href = ConfigRouter.login;
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
export const truncateString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + '...';
  }
};
export function createDateWithCurrentDate(hourMinute) {
  const currentDate = new Date(); // Lấy ngày tháng năm hiện tại
  const [hour, minute] = hourMinute.split(':').map((num) => parseInt(num)); // Tách giờ và phút từ chuỗi 'hourMinute'

  // Thiết lập giờ và phút cho ngày tháng năm hiện tại
  currentDate.setHours(hour);
  currentDate.setMinutes(minute);

  return currentDate; // Trả về đối tượng Date đã tạo
}
export function formatDate(input) {
  // Chia chuỗi thành các phần tử ngày, tháng, năm bằng cách tách chuỗi bằng dấu gạch, dấu gạch chéo hoặc dấu gạch ngang
  var parts = input.split(/\/|-/);

  // Kiểm tra xem phần tử có phù hợp không
  if (parts.length === 3) {
    // Lấy ngày, tháng, năm từ phần tử
    var day = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var year = parseInt(parts[2]);

    // Kiểm tra xem ngày và tháng có hợp lệ không
    if (month >= 1 && month <= 12 && day >= 1 && day <= new Date(year, month, 0).getDate()) {
      // Tạo đối tượng Date từ ngày, tháng, năm
      var date = new Date(year, month - 1, day); // Lưu ý: Tháng trong Date bắt đầu từ 0

      // Kiểm tra nếu đối tượng Date hợp lệ
      if (!isNaN(date.getTime())) {
        // Format lại ngày thành "DD/MM/YYYY"
        var formattedDate = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year;
        return formattedDate;
      }
    }
  }
  return null; // Trả về null nếu không thành công
}
export function getAllDatesInRange(startDate, endDate) {
  let startDateFormatted = dayjs(startDate, 'DD/MM/YYYY');
  let endDateFormatted = dayjs(endDate, 'DD/MM/YYYY');

  // Kiểm tra nếu ngày bắt đầu lớn hơn ngày kết thúc, đổi chỗ hai ngày
  if (startDateFormatted.isAfter(endDateFormatted)) {
    const temp = startDateFormatted;
    startDateFormatted = endDateFormatted;
    endDateFormatted = temp;
  }

  let dates = [];
  let currentDate = startDateFormatted;

  while (currentDate.isBefore(endDateFormatted) || currentDate.isSame(endDateFormatted)) {
    dates.push(currentDate.format('DD/MM/YYYY'));
    currentDate = currentDate.add(1, 'day');
  }

  return dates;
}
