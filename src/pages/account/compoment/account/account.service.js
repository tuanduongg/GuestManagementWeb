import { TeamOutlined, SafetyOutlined } from '@ant-design/icons';

export const checkDisableBtn = (arrID = [], arrData = []) => {
  let countActive = 0;
  let countBlock = 0;
  if (arrData?.length > 0) {
    arrData.map((item) => {
      if (arrID.includes(item?.USER_ID)) {
        if (item?.ACTIVE) {
          countActive++;
        } else {
          countBlock++;
        }
      }
    });
    if (countActive > countBlock) {
      return 'BLOCK';
    }
    return 'ACTIVE';
  }
  return 'BLOCK';
};

export const initArrayTab = [
  { name: 'Tài khoản', icon: <TeamOutlined /> },
  { name: 'Phân quyền', icon: <SafetyOutlined /> }
];
