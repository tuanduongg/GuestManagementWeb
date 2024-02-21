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
export function compareDateTime(dateTimeString) {
  let result = '';
  // Hàm tính khoảng cách thời gian
  function calculate() {
    // Thời gian hiện tại
    const now = new Date();
    const targetDate = new Date(dateTimeString);

    // Tính khoảng cách thời gian
    const timeDiff = targetDate.getTime() - now.getTime();

    // Chuyển đổi thành đơn vị thích hợp (phút, giây, millisecond)
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    console.log('Khoảng cách thời gian:');
    result = days + ' ngày, ' + (hours % 24) + ' giờ, ' + (minutes % 60) + ' phút, ' + (seconds % 60) + ' giây.';
  }

  // Gọi hàm tính toán ban đầu
  calculate();

  // Gọi hàm tính toán sau mỗi giây
  setInterval(calculate, 59000);
  return result;
}
export function CountDownTimer(dt) {
  var end = new Date(dt);

  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var timer;

  function showRemaining() {
    var now = new Date();
    var distance = end - now;
    if (distance < 0) {
      clearInterval(timer);
      document.getElementById(id).innerHTML = 'EXPIRED!';
      console.log('test', test);
      return 'test  ';
    }
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    // var seconds = Math.floor((distance % _minute) / _second);

    let text = '';
    text = days + ' ' + hours + ':' + minutes;
    console.log('text', text);
    return text;
  }
  showRemaining();
  // timer = setInterval(showRemaining, 1000);
}
