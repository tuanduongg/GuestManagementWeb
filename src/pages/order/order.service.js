import { Badge } from 'antd';

export const getBadgeStatus = (status) => {
  if (!status) {
    return <Badge color={'#f5222d'} count={'Cancel'} />;
  }
  let color = '';
  switch (status?.statusName.toLowerCase()) {
    case 'new':
      color = '#16a34a'; //success color
      break;
    case 'cancel':
      color = '#f5222d'; //cancel
      break;

    default: //process
      color = '#0ea5e9';
      break;
  }

  return <Badge color={color} count={status?.statusName} />;
};

export const TABS_ORDER = {
  NEW_TAB: { title: 'Mới', ID: 'NEW_TAB' },
  CANCEL_TAB: { title: 'Đã hủy', ID: 'CANCEL_TAB' },
  ALL_TAB: { title: 'Tất cả', ID: 'ALL_TAB' },
  ACCEPT_TAB: { title: 'Đã duyệt', ID: 'ACCEPT_TAB' }
};
