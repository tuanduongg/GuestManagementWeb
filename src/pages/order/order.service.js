import { Badge } from 'antd';

export const getBadgeStatus = (status) => {
  if (!status) {
    return <Badge color={'#f5222d'} count={'Cancel'} />;
  }
  let color = '';
  switch (status?.statusName.toLowerCase()) {
    case 'done':
      color = '#16a34a'; //success color
      break;
    case 'cancel':
      color = '#f5222d'; //cancel
      break;
    case 'wait':
      color = '#d97706'; //wait
      break;
    case 'new':
      color = '#6d28d9'; //done
      break;

    default: //Wait
      color = '#0ea5e9';
      break;
  }

  return <Badge color={color} count={status?.statusName} />;
};

export const TABS_ORDER = {
  NEW_TAB: { title: 'status_new', ID: 'NEW_TAB' },
  CANCEL_TAB: { title: 'Đã hủy', ID: 'CANCEL_TAB' },
  ALL_TAB: { title: 'all', ID: 'ALL_TAB' },
  ACCEPT_TAB: { title: 'Đã duyệt', ID: 'ACCEPT_TAB' }
};
