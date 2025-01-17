import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, Typography, Image, Flex, Button, message } from 'antd';
const { Title } = Typography;
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// assets
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC, formattingVND, isMobile } from 'utils/helper';
import { useTranslation } from 'react-i18next';
import './detail_product.css';
import config from 'config';
import { addToCart } from 'store/reducers/menu';
import { useDispatch, useSelector } from 'react-redux';
import { urlFallBack } from 'pages/manager-product/manager-product.service';

const ModalDetailProduct = ({ open, handleClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const { modal } = App.useApp();
  const { t } = useTranslation();
  const { cart } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  const handleOk = (e) => {};
  const handleCancel = (e) => {
    setQuantity(1);
    handleClose();
  };
  const onChangeInput = (e) => {};
  const onClickAddToCart = () => {
    if (parseInt(quantity) < 1 || isNaN(parseInt(quantity))) {
      setQuantity(1);
    }
    dispatch(addToCart({ cart: { ...product, quantity: quantity } }));
    message.success(t('msg_add_to_cart'));
  };

  return (
    <>
      <Modal
        centered
        okText={t('saveButton')}
        cancelText={t('close')}
        width={900}
        zIndex={1300}
        maskClosable={false}
        title={''}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="detail-modal"
      >
        <div style={{ minWidth: '100%', height: 'auto', minHeight: '400px' }}>
          <Row style={{ height: '100%' }} gutter={24}>
            <Col style={{ height: '100%', minHeight: '390px' }} xs={24} sm={12}>
              <Swiper pagination={true} navigation={true} modules={[Pagination, Navigation]} className="mySwiper">
                {product?.images?.length > 0 ? (
                  product?.images?.map((item, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        height={'500px'}
                        width={'100%'}
                        alt={item?.title}
                        style={{ objectFit: 'cover', cursor: 'pointer', minHeight: '400px' }}
                        src={config.urlImageSever + item?.url}
                        fallback={urlFallBack}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <Image
                    preview={false}
                    height={'100%'}
                    width={'100%'}
                    style={{ objectFit: 'cover', cursor: 'pointer', minHeight: '400px' }}
                    src={urlFallBack}
                  />
                )}
              </Swiper>
            </Col>
            <Col xs={24} style={{ position: 'relative' }} sm={12}>
              <Title level={4}>{product?.productName}</Title>
              <Title style={{ color: '#005494', fontWeight: 'bold' }} level={4}>
                {`${formattingVND(product?.price, 'đ')}/${product?.unit}`}
              </Title>
              <Title level={5}>{t('description')}:</Title>
              <div>{product?.description}</div>
              <Row style={{ position: isMobile() ? '' : 'absolute', bottom: 20, margin: '10px 0px' }} gutter={16}>
                <Col xs={10}>
                  <Flex justify={'center'} align={'center'}>
                    <Button
                      onClick={() => {
                        setQuantity((pre) => {
                          let sub = parseInt(pre) - 1;
                          if (sub < 1) {
                            sub = 1;
                          }
                          return sub;
                        });
                      }}
                      icon={<MinusOutlined />}
                      shape="circle"
                    ></Button>
                    <input
                      onPaste={(e) => console.log('e', e.target.value)}
                      onChange={(e) => {
                        const { value } = e.target;
                        let numValue = parseInt(value);
                        if (isNaN(numValue)) {
                          numValue = '';
                        }
                        setQuantity(numValue);
                      }}
                      value={quantity}
                      style={{
                        width: '30%',
                        minWidth: '25px',
                        margin: '0px 10px',
                        height: '30px',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        outline: 'none'
                      }}
                    />
                    <Button
                      onClick={() => {
                        setQuantity((pre) => {
                          let sub = parseInt(pre) + 1;
                          if (isNaN(sub)) {
                            sub = 1;
                          }
                          if (sub < 1) {
                            sub = 1;
                          }
                          return sub;
                        });
                      }}
                      icon={<PlusOutlined />}
                      shape="circle"
                    ></Button>
                  </Flex>
                </Col>
                <Col xs={14}>
                  <Button
                    className="no-border-radius"
                    onClick={onClickAddToCart}
                    style={{ width: '100%' }}
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                  >
                    {t('btn_add_to_cart')}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};
export default ModalDetailProduct;
