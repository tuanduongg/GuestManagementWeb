import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Tag, Popover } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import { message } from '../../node_modules/antd/es/index';

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
  NOT_IN: 'NOT_IN',
  COME_IN: 'COME_IN',
  COME_OUT: 'COME_OUT'
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
        case statusName.NOT_IN:
          message = 'Chưa vào';
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
      case statusName.NOT_IN:
        message = 'Chưa vào';
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
export const getColorChipStatus = (status, timeInExpected) => {
  // console.log('compareDateTime(timeInExpected)', compareDateTime(timeInExpected));
  let color = '';
  let message = '';
  switch (status) {
    case statusName.NOT_IN:
      color = 'geekblue';
      message = 'Chưa vào';
      break;
    case statusName.COME_IN:
      color = 'green';
      message = 'Đã vào';
      break;
    case statusName.COME_OUT:
      color = 'volcano';
      message = 'Đã ra';
      break;

    default:
      break;
  }
  if (status === statusName.NOT_IN) {
    let rs = compareDateTime(timeInExpected);
    if (rs) {
      return (
        <>
          <Popover
            placement="left"
            title={`Thời gian dự kiến sẽ đến: ${rs} nữa`}
            trigger={['click', 'hover']} // Trigger on both click and hover
          >
            <Tag color={color} key={status}>
              <FieldTimeOutlined style={{ marginRight: '5px' }} />
              {rs}
            </Tag>
          </Popover>
        </>
      );
    }
  }
  return (
    <Tag color={color} key={status}>
      {message}
    </Tag>
  );
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
