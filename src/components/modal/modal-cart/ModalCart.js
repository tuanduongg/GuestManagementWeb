import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, Card, Button, Flex, Avatar, Typography } from 'antd';
const { TextArea } = Input;
const { Text, Title } = Typography;

// assets
import { PlusOutlined, MinusOutlined, DeleteOutlined, DoubleRightOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'utils/helper';
import './modalcart.css';

const ModalCart = ({ open, handleClose }) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const draggleRef = useRef(null);

  const { t } = useTranslation();
  const handleCancel = (e) => {
    handleClose();
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    });
  };

  const products = [
    {
      image:
        'https://www.baohoxanh.com/pub/media/catalog/product/cache/6777b4a684641b0f3702baec659d116f/g/a/gang-tay-cao-su-nitrile-gps0002.jpg',
      title: 'Găng tay cao su 123',
      price: 123567,
      unit: 'Cái'
    },
    {
      image: 'https://moriitalia.com/images/thumbs/001/0010959_moi-binh-giu-nhiet-la-fonte-500ml-mau-den-180695_700.jpeg',
      title: '[MỚI] Bình giữ nhiệt La Fonte 500ml màu đen - 180695',
      price: 120000,
      unit: 'Chai'
    },
    {
      image: 'https://moriitalia.com/images/thumbs/001/0010959_moi-binh-giu-nhiet-la-fonte-500ml-mau-den-180695_700.jpeg',
      title: '[MỚI] Bình giữ nhiệt La Fonte 500ml màu đen - 180695',
      price: 120000,
      unit: 'Chai'
    }
  ];

  return (
    <>
      <Modal
        centered
        okButtonProps={{ icon: <DoubleRightOutlined /> }}
        className="modal-cart"
        okText={t('Order now')}
        cancelText={t('close')}
        zIndex={1300}
        width={800}
        maskClosable={false}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move'
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            Cart Shopping
          </div>
        }
        open={open}
        onOk={() => {}}
        onCancel={() => {
          handleClose();
        }}
        modalRender={(modal) => (
          <Draggable disabled={disabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Flex style={{ paddingTop: '10px' }} justify="space-between" align="center">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text style={{ fontSize: '17px', fontWeight: 'bold' }}>Total: </Text>
                <Text style={{ fontSize: '17px', color: '#005494', fontWeight: 'bold' }}>14.000.000đ</Text>
              </div>
              <div>
                {/* <CancelBtn /> */}
                <OkBtn />
              </div>
            </Flex>
          </>
        )}
      >
        <Card className="cart-info">
          <Row gutter={24}>
            <Col xs={12}>
              Họ tên(<span style={{ color: 'red' }}>*</span>)
              <Input placeholder="Nhập họ tên..." />
            </Col>
            <Col xs={12}>
              Bộ phận(<span style={{ color: 'red' }}>*</span>)
              <Input placeholder="Nhập bộ phận..." />
            </Col>
          </Row>
        </Card>
        <Card className="cart-list-product">
          <Row style={{ display: 'flex', alignItems: 'center', padding: '5px 0px', borderBottom: '1px solid #ddd', paddingRight: '10px' }}>
            <Col xs={2}>
              <Text style={{ textTransform: 'uppercase' }}>#</Text>
            </Col>
            <Col xs={12} sm={6}>
              <Text style={{ textTransform: 'uppercase' }}>Product Details</Text>
            </Col>
            <Col style={{ textTransform: 'uppercase', textAlign: 'center' }} xs={8}>
              <Text>Quantity</Text>
            </Col>
            {!isMobile() && (
              <>
                <Col style={{ textTransform: 'uppercase', textAlign: 'right' }} xs={3}>
                  <Text>Price</Text>
                </Col>
                <Col style={{ textTransform: 'uppercase', textAlign: 'right' }} xs={3}>
                  <Text>Total</Text>
                </Col>
              </>
            )}
            <Col style={{ textTransform: 'uppercase', textAlign: 'right' }} xs={1}></Col>
          </Row>
          {/* <Divider style={{ margin: '0px', color: '#ddd' }} /> */}
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {products.map((item, index) => (
              <Row key={index} style={{ display: 'flex', alignItems: 'center', padding: '5px 0px', borderBottom: '1px solid #ddd' }}>
                <Col xs={2}>
                  <Flex align={'center'}>
                    <Text strong>{index + 1}</Text>
                  </Flex>
                </Col>
                <Col xs={12} sm={6}>
                  <Flex align={'center'}>
                    <Avatar shape="square" style={{ width: 60 }} size={60} src={<img src={item.image} alt="avatar" />} />
                    <div style={{ marginLeft: '10px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{item.title}</div>
                      <Text type="secondary">{isMobile() ? `${item.price}/${item.unit}` : item.unit}</Text>
                    </div>
                  </Flex>
                </Col>
                <Col xs={8}>
                  <Flex justify={'center'} align={'center'}>
                    <Button size="small" icon={<MinusOutlined />} shape="circle"></Button>
                    <input
                      style={{
                        width: '30px',
                        margin: '0px 10px',
                        height: '25px',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        outline: 'none'
                      }}
                      value={10}
                    />
                    <Button size="small" icon={<PlusOutlined />} shape="circle"></Button>
                  </Flex>
                </Col>
                {!isMobile() && (
                  <>
                    <Col style={{ textAlign: 'right' }} xs={3}>
                      <Text strong>{item.price}</Text>
                    </Col>
                    <Col style={{ textAlign: 'right' }} xs={3}>
                      <Text strong>4.155.000</Text>
                    </Col>
                  </>
                )}
                <Col style={{ textTransform: 'uppercase', textAlign: 'right' }} xs={2}>
                  <Button danger icon={<DeleteOutlined />} size="small" type="text"></Button>
                </Col>
              </Row>
            ))}
          </div>
        </Card>
      </Modal>
    </>
  );
};
export default ModalCart;
