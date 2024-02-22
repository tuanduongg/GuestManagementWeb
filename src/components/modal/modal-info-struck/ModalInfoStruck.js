import React, { useState } from 'react';
import { Button, Modal, Row, Col, Flex, Typography, Divider } from 'antd';
import { CaretRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
import './modal_info_struck.css';

const ModalInfoStruck = ({ open, handleClose }) => {
  const handleOk = () => {
    alert('111');
  };
  const handleCancel = () => {
    handleClose();
  };

  return (
    <>
      <Modal
        titleFontSize={20}
        centered
        zIndex={1300}
        maskClosable={false}
        open={open}
        title={
          <Text strong style={{ fontSize: '15px', fontWeight: 'bold' }}>
            Thông tin đăng ký xe
          </Text>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Đóng"
        autoFocusButton="cancel"
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
          </>
        )}
      >
        <Row>
          <Col span={12}>
            <Text className="title-detail">Thông tin chung</Text>
            <div style={{ margin: '5px 0px 0px 0px' }}>
              <Flex direction="row">
                <Text style={{ marginRight: '5px', fontWeight: 500 }}>Vendor:</Text>
                <Text>SH Tech</Text>
              </Flex>
              <Flex direction="row">
                <Text style={{ marginRight: '5px', fontWeight: 500 }}>Biển số xe:</Text>
                <Text>99H-31223</Text>
              </Flex>
            </div>
          </Col>
          <Col span={12}>
            <Text className="title-detail">Thông tin người</Text>
            <div style={{ margin: '5px 0px 0px 0px' }}>
              <Row>
                <Col span={12}>
                  <Text style={{ textAlign: 'left' }} strong>
                    Họ tên
                  </Text>
                </Col>
                <Col style={{ textAlign: 'center' }} span={12}>
                  <Text strong>CMND/CCCD</Text>
                </Col>
              </Row>
              <Divider style={{ margin: '0px 0px' }} />
              <Row>
                <Col span={12}>
                  <Text style={{ textAlign: 'left' }}>Dương Ngô Tuấn</Text>
                </Col>
                <Col style={{ textAlign: 'center' }} span={12}>
                  <Text>122415883</Text>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <Flex direction="row">
              <Text style={{ marginRight: '5px', fontWeight: 500 }}>Giờ vào(dự kiến):</Text>
              <Text>12:23 22/02/2024</Text>
            </Flex>
            <Flex direction="row">
              <Text style={{ marginRight: '5px', fontWeight: 500 }}>Giờ ra(dự kiến):</Text>
              <Text>18:00 22/02/2024</Text>
            </Flex>
          </Col>
          <Col span={12}>
            <Flex direction="row">
              <Text style={{ marginRight: '5px', fontWeight: 500 }}>Giờ vào(thực tế):</Text>
              <Text>12:23 22/02/2024</Text>
            </Flex>
            <Flex direction="row">
              <Text style={{ marginRight: '5px', fontWeight: 500 }}>Giờ ra(thực tế):</Text>
              <Text>18:00 22/02/2024</Text>
            </Flex>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalInfoStruck;
