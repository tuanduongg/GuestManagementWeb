import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { Table, Row, Col, Typography } from 'antd';
import { isMobile } from 'utils/helper';
import ForbidenPage from 'components/403/ForbidenPage';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import { TeamOutlined, SafetyOutlined } from '@ant-design/icons';
import Account from './compoment/account/Account';
import Permisstion from './compoment/permisstion/permisstion';

const { Title } = Typography;

const AccountPage = () => {
  const [role, setRole] = useState(null);
  const [listRole, setListRole] = useState(null);

  const checkRole = async () => {
    const rest = await restApi.get(RouterAPI.checkRole);
    if (rest?.status === 200) {
      setRole(rest?.data);
      getAllRole();
    }
  };
  const getAllRole = async () => {
    const rest = await restApi.get(RouterAPI.allRole);
    if (rest?.status === 200) {
      setListRole(rest?.data);
    }
  };
  useEffect(() => {
    checkRole();
  }, []);
  if (!role) {
    return <ForbidenPage />;
  }
  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={5}>Tài khoản & Phân quyền</Title>
        </Col>
      </Row>
      <Tabs
        size="middle"
        items={[
          { key: 1, label: 'Tài khoản', icon: <TeamOutlined />, children: <Account role={role} listRole={listRole} /> },
          {
            key: 2,
            label: 'Phân quyền',
            icon: <SafetyOutlined />,
            children: <Permisstion role={role} listRole={listRole} getAllRole={getAllRole} />
          }
        ]}
      />
    </>
  );
};
export default AccountPage;
