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
import { formattingVND, isMobile } from 'utils/helper';
import './modalcart.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addToCart, changeQuantityProduct, setCart } from 'store/reducers/menu';

import config from 'config';

const initialValidate = { err: false, message: '' };

const ModalCart = ({ open, handleClose }) => {
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState('');
  const [validateName, setValidateName] = useState(initialValidate);
  const [department, setDepartment] = useState('');
  const [validateDepartment, setValidateDepartment] = useState(initialValidate);
  const dispatch = useDispatch();

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const draggleRef = useRef(null);

  const { t } = useTranslation();
  const handleCancel = () => {
    setValidateDepartment(initialValidate);
    setValidateName(initialValidate);
    setName('');
    setDepartment('');
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
  const { cart } = useSelector((state) => state.menu);

  const onChangeQuantity = (type, item) => {
    const newQuantityMinus = parseInt(item?.quantity) - 1;
    switch (type) {
      case 'minus':
        dispatch(changeQuantityProduct({ product: { productID: item?.productID, quantity: newQuantityMinus < 1 ? 1 : newQuantityMinus } }));
        break;
      case 'plus':
        dispatch(changeQuantityProduct({ product: { productID: item?.productID, quantity: parseInt(item?.quantity) + 1 } }));
        break;

      default:
        break;
    }
  };
  const onDeleteRowOnCart = (prop) => {
    const newArr = cart?.filter((item) => item?.productID !== prop?.productID);
    dispatch(setCart({ cart: newArr }));
  };

  const onChangeInputQuantity = (e, item) => {
    const { value } = e.target;
    if (/^\d*$/g.test(value)) {
      let valueNum = parseInt(value);
      if (isNaN(valueNum) || valueNum < 1) {
        valueNum = 1;
      }
      dispatch(changeQuantityProduct({ product: { productID: item?.productID, quantity: valueNum } }));
    }
  };
  const onOrder = () => {
    let check = false;
    if (name?.trim() === '') {
      check = true;
      setValidateName({ err: true, message: 'Họ tên không được để trống!' })
    }
    if (department?.trim() === '') {
      check = true;
      setValidateDepartment({ err: true, message: 'Bộ phận không được để trống!' })
    }
    if (!check) {
      alert('pass')
    }
  };
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'department':
        setDepartment(value);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Modal
        centered
        okButtonProps={{ icon: <DoubleRightOutlined /> }}
        className="modal-cart"
        okText={t('Order now')}
        cancelText={t('close')}
        zIndex={1300}
        width={900}
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
            onFocus={() => { }}
            onBlur={() => { }}
          // end
          >
            Your Cart
          </div>
        }
        open={open}
        onOk={onOrder}
        onCancel={() => {
          handleCancel();
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
                <Text style={{ fontSize: '17px', color: '#005494', fontWeight: 'bold' }}>
                  {cart
                    ? formattingVND(
                      cart.reduce(
                        (accumulator, currentValue) => accumulator + parseInt(currentValue?.price) * parseInt(currentValue?.quantity),
                        0
                      ),
                      'đ'
                    )
                    : ''}
                </Text>
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
              <Input
                status={validateName?.err ? 'error' : ''}
                value={name}
                name="name"
                onChange={onChangeInput}
                placeholder="Nhập họ tên..."
              />
              {validateName?.err && <div style={{ color: 'red', marginLeft: '3px' }}>{validateName?.message}</div>}
            </Col>
            <Col xs={12}>
              Bộ phận(<span style={{ color: 'red' }}>*</span>)
              <Input
                status={validateDepartment?.err ? 'error' : ''}
                value={department}
                name="department"
                onChange={onChangeInput}
                placeholder="Nhập bộ phận..."
              />
              {validateDepartment.err && <div style={{ color: 'red', marginLeft: '3px' }}>{validateDepartment?.message}</div>}
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
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {cart?.map((item, index) => (
              <Row key={index} style={{ display: 'flex', alignItems: 'center', padding: '5px 0px', borderBottom: '1px solid #ddd' }}>
                <Col xs={2}>
                  <Flex align={'center'}>
                    <Text strong>{index + 1}</Text>
                  </Flex>
                </Col>
                <Col xs={12} sm={6}>
                  <Flex align={'center'}>
                    <Avatar
                      shape="square"
                      style={{ width: 60 }}
                      size={60}
                      src={<img src={item?.images[0] ? config.urlImageSever + item?.images[0]?.url : ''} alt="avatar" />}
                    />
                    <div style={{ marginLeft: '10px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{item.productName}</div>
                      <Text type="secondary">{isMobile() ? `${item.price}/${item.unit}` : item.unit}</Text>
                    </div>
                  </Flex>
                </Col>
                <Col xs={8}>
                  <Flex justify={'center'} align={'center'}>
                    <Button
                      onClick={() => {
                        onChangeQuantity('minus', item);
                      }}
                      size="small"
                      icon={<MinusOutlined />}
                      shape="circle"
                    ></Button>
                    <input
                      onChange={(e) => {
                        onChangeInputQuantity(e, item);
                      }}
                      style={{
                        width: '30px',
                        margin: '0px 10px',
                        height: '25px',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        outline: 'none'
                      }}
                      value={item?.quantity}
                    />
                    <Button
                      onClick={() => {
                        onChangeQuantity('plus', item);
                      }}
                      size="small"
                      icon={<PlusOutlined />}
                      shape="circle"
                    ></Button>
                  </Flex>
                </Col>
                {!isMobile() && (
                  <>
                    <Col style={{ textAlign: 'right' }} xs={3}>
                      <Text strong>{formattingVND(item.price, '')}</Text>
                    </Col>
                    <Col style={{ textAlign: 'right' }} xs={3}>
                      <Text strong>{formattingVND(parseInt(item.price) * parseInt(item?.quantity), '')}</Text>
                    </Col>
                  </>
                )}
                <Col style={{ textTransform: 'uppercase', textAlign: 'right' }} xs={2}>
                  <Button
                    danger
                    onClick={() => {
                      onDeleteRowOnCart(item);
                    }}
                    icon={<DeleteOutlined />}
                    size="small"
                    type="text"
                  ></Button>
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
