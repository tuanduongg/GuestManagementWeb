import { listNameStatus, statusName } from 'utils/helper';

// export const optionsSelect = listNameStatus().map((item, index) => {
//   return {
//     value: item?.value,
//     label: item?.text
//   };
// });

export const concatGuestInfo = (arr) => {
  if (arr) {
    let result = '';
    let lengthArr = arr?.length;
    if (lengthArr > 2) {
      result += arr[0]?.FULL_NAME + ',' + arr[1]?.FULL_NAME + '...';
    } else if (lengthArr === 2) {
      result += arr[0]?.FULL_NAME + ',' + arr[1]?.FULL_NAME;
    } else if (lengthArr === 1) {
      result += arr[0]?.FULL_NAME;
    }
    return result;
  }
  return '';
};
export const filterName = (tableData) => {
  if (tableData && tableData?.length > 0) {
    const arrName = [];
    const arr = tableData.map((item) => {
      if (item?.guest_info && item?.guest_info.length > 0) {
        item?.guest_info.map((row) => {
          arrName.push({
            text: row?.FULL_NAME,
            value: row?.FULL_NAME
          });
        });
      }
    });
    return arrName.filter((v, i, a) => v.value !== '' && a.findIndex((v2) => v2.value === v.value) === i);
  }
  return [];
};
export const initialFilterStatus = (role) => {
  if (role) {
    switch (role) {
      case 'ADMIN':
        return [statusName.NEW];
      case 'SECURITY':
        return [statusName.ACCEPT];

      default:
        return [];
    }
  }
  return [];
};
export const NEW_TAB = 'NEW_TAB';
export const HISTORY_TAB = 'HISTORY_TAB';
