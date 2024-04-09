import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, Card, Pagination, Input, Space, Dropdown, message, Button, FloatButton, Drawer } from 'antd';
const { Title, Link, Text } = Typography;
const { Meta } = Card;
import './list-product.css';
const { Search } = Input;

import { DownOutlined, FilterOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import MainCard from 'components/MainCard';
import CardProduct from 'components/cards/card-product/CardProduct';
import { isMobile, isTablet } from 'utils/helper';
import ModalCart from 'components/modal/modal-cart/ModalCart';
import ModalDetailProduct from 'components/modal/detail-product/ModalDetailProduct';

const ListProduct = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [openModalCart, setOpenModalCart] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  //   if (!role?.IS_READ) {
  //     return <ForbidenPage />;
  //   }
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onCloseModalDetail = () => {
    setOpenModalDetail(false);
  };
  const onClickProduct = () => {
    setOpenModalDetail(true);
  };
  return (
    <>
      {/* <Loading loading={loading} /> */}
      {contextHolder}
      <div style={{ margin: '25px 0px 0px 0px' }}></div>
      {/* <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'left' }}>Danh Sách Vật Tư Tiêu Hao</div> */}
      <div className="wrap-list">
        <Row style={{ margin: '0px 0px 15px 0px', justifyContent: 'space-between', alignItems: 'center' }}>
          <Col sm={10} md={18} xs={11}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button style={{}} type="link" icon={<FilterOutlined style={{ fontSize: '17px' }} />} />
              <div style={{ fontWeight: 'bold', marginRight: '5px' }}>Category:</div>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      label: 'Văn phòng phẩm'
                    },
                    {
                      key: '2',
                      label: 'Phục vụ sản xuất'
                    },
                    {
                      key: '3',
                      label: 'Đồ ăn uống'
                    }
                  ],
                  selectable: true,
                  defaultSelectedKeys: ['3']
                }}
              >
                <Typography.Link>
                  <Space>
                    All
                    <DownOutlined />
                  </Space>
                </Typography.Link>
              </Dropdown>
            </div>
          </Col>
          <Col sm={10} md={6} xs={13}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Search placeholder="Tên sản phẩm..." allowClear enterButton />
            </div>
          </Col>
        </Row>
        <div className="wrap_list_item">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item, index) => (
            <div
              key={index}
              style={{ width: isMobile() ? `${100 / 2}%` : isTablet() ? `${100 / 4}%` : `${100 / 5}%`, padding: '10px' }}
            >
              <CardProduct onClickProduct={onClickProduct} number={item} />
            </div>
          ))}
        </div>
        <div className="wrap-pagination">
          <Pagination defaultCurrent={1} total={50} />
        </div>
        <FloatButton
          onClick={() => {
            setOpenModalCart(true);
          }}
          tooltip={<div>Cart</div>}
          type="primary"
          badge={{
            count: 12
          }}
          icon={<ShoppingCartOutlined />}
        />
        <ModalCart
          open={openModalCart}
          handleClose={() => {
            setOpenModalCart(false);
          }}
        />
      </div>
      {/* <MainCard contentSX={{ p: 2, minHeight: '83vh' }}>

      </MainCard> */}
      <ModalDetailProduct open={openModalDetail} handleClose={onCloseModalDetail} />
    </>
  );
};

export default ListProduct;
