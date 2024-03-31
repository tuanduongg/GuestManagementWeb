import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, Card, Pagination, Input, Space, Dropdown, message, Button, Badge } from 'antd';
const { Title, Link, Text } = Typography;
const { Meta } = Card;
import './list-product.css';
const { Search } = Input;

import { DownOutlined, FilterOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import MainCard from 'components/MainCard';
import CardProduct from 'components/cards/card-product/CardProduct';
import { isMobile, isTablet } from 'utils/helper';

const ListProduct = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  //   if (!role?.IS_READ) {
  //     return <ForbidenPage />;
  //   }
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      {/* <Loading loading={loading} /> */}
      {contextHolder}
      <div style={{ margin: '40px 0px 0px 0px' }}></div>
      <div className="wrap-list">
        <Row style={{ margin: '0px 0px 15px 0px', justifyContent: 'space-between', alignItems: 'center' }}>
          <Col sm={4} md={4} xs={9}>
            <Button style={{}} type="link" icon={<FilterOutlined style={{ fontSize: '17px' }} />} />
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    label: 'Item 1'
                  },
                  {
                    key: '2',
                    label: 'Item 2'
                  },
                  {
                    key: '3',
                    label: 'Item 3'
                  }
                ],
                selectable: true,
                defaultSelectedKeys: ['3']
              }}
            >
              <Typography.Link>
                <Space>
                  Danh Mục
                  <DownOutlined />
                </Space>
              </Typography.Link>
            </Dropdown>
          </Col>
          <Col sm={10} md={8} xs={15}>
            <div style={{ display: 'flex',alignItems:'center' }}>
              <Search  placeholder="Tên sản phẩm..." allowClear enterButton size="large" />
            </div>
          </Col>
        </Row>
        <div className="wrap_list_item">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item, index) => (
            <div key={index} style={{ width: isMobile() ? `${100 / 2}%` : isTablet() ? `${100 / 4}%` : `${100 / 5}%`, padding: '5px' }}>
              <CardProduct number={item} />
            </div>
          ))}
        </div>
        <div className="wrap-pagination">
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </div>
      {/* <MainCard contentSX={{ p: 2, minHeight: '83vh' }}>

      </MainCard> */}
    </>
  );
};

export default ListProduct;
