import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, Typography, Image, Flex, Button } from 'antd';
const { Title } = Typography;
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
// assets
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC, isMobile } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import './detail_product.css';

const ModalDetailProduct = ({ open, handleClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { modal } = App.useApp();
  const { t } = useTranslation();
  const handleOk = (e) => {};
  const handleCancel = (e) => {
    handleClose();
  };
  const onChangeInput = (e) => {};
  const onClickAddToCart = () => {
    if (parseInt(quantity) < 1 || isNaN(parseInt(quantity))) {
      setQuantity(1);
    }
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
        <div style={{ minWidth: '100%', height:'auto',minHeight:'400px' }}>
          <Row style={{ height: '100%' }} gutter={24}>
            <Col style={{ height: '100%' }} xs={24} sm={12}>
              <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                <SwiperSlide>
                  <Image
                    height={'100%'}
                    alt={'image'}
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  />
                </SwiperSlide>
              </Swiper>
            </Col>
            <Col xs={24} style={{ position: 'relative' }} sm={12}>
              <Title level={4}>Editable text with a custom enter icon in edit field</Title>
              <Title style={{ color: '#005494', fontWeight: 'bold' }} level={4}>
                5.125.000 vnđ/Cái
              </Title>
              <Title level={5}>Description:</Title>
              <div>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard dummy text ever
                since the 1500s,
              </div>
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
                    Add to cart
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
