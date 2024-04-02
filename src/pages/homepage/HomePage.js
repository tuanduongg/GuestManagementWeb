import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Flex } from 'antd';
import './homepage.css';
import { isMobile } from 'utils/helper';
import { UsergroupAddOutlined, ShoppingCartOutlined, UnlockOutlined } from '@ant-design/icons';
// import LOGO from '../../assets/images/logo/favilogo.png';
import Logo from 'components/Logo/Logo';
import { ConfigRouter } from 'config_router';
import CardComponent from './component/card';
const cols = [
  { url: ConfigRouter.listGuest, icon: <UsergroupAddOutlined style={{ fontSize: '30px' }} />, content: 'ĐĂNG KÝ KHÁCH', id: '1' },
  { url: ConfigRouter.listGuest, icon: <ShoppingCartOutlined style={{ fontSize: '30px' }} />, content: 'ORDER VẬT TƯ ', id: '2' },
  { url: ConfigRouter.user, icon: <UnlockOutlined style={{ fontSize: '30px' }} />, content: 'TÀI KHOẢN & PHÂN QUYỀN', id: '3' },
  //   { url: ConfigRouter.listGuest, icon: <UsergroupAddOutlined style={{ fontSize: '30px' }} />, content: 'ĐĂNG KÝ KHÁCH', id: '4' }
];

const HomePage = () => {
  const [dataUser, setDataUser] = useState(null);
  useEffect(() => {
    const str = localStorage.getItem('DATA_USER');
    if (str) {
      const obj = JSON.parse(str);
      setDataUser(obj);
    }
  }, []);
  return (
    <>
      <div style={{ width: isMobile() ? '90%' : '70%', margin: 'auto', height: '100vh' }}>
        <Flex style={{ height: '100%' }} vertical justify={'center'}>
          <Row>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Logo styleText={{ fontSize: '25px', color: 'white' }} styleImage={{ width: '50px', height: '50px' }} />
            </div>
          </Row>
          <Row>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ fontSize: '20px', color: '#ffff' }}>Xin chào, {dataUser?.username}</div>
            </div>
          </Row>
          {/* <Row gutter={24}>{cols.map((item) => cardComponent({ content: item.content, icon: item.icon }))}</Row> */}
          <Row gutter={24}>
            {cols.map((item) => (
              <>
                <Col key={item.id} style={{ display: 'flex', justifyContent: 'center' }} xs={24} sm={12}>
                  <CardComponent key={item.id} content={item.content} url={item.url} icon={item.icon} />
                </Col>
              </>
            ))}
            {/*             
            {cols.map((item) => (
              <Col xs={24} sm={12}>
              <cardComponent>
              </Col>
            )} */}
          </Row>
        </Flex>
      </div>
    </>
  );
};

export default HomePage;
