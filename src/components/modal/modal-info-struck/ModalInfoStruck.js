import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Row, Col, Flex, Typography, Divider, Image, Tag } from 'antd';
import { CaretRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
import './modal_info_struck.css';
import { formatDateFromDB, getColorChipStatus, isMobile } from 'utils/helper';

const ModalInfoStruck = ({ open, handleClose, dataSelect }) => {
  const [widthBoxImage, setWidthBoxImage] = useState(100);

  const handleCancel = () => {
    handleClose();
  };

  //   {
  //     "stt": 4,
  //     "key": 4,
  //     "vendor": "vendor 4",
  //     "status": "COME_OUT",
  //     "carNumber": "87B-06850",
  //     "timeOutExpected": "2024-02-22T01:27:47.974Z",
  //     "timeInExpected": "2024-02-22T04:27:47.974Z",
  //     "reason": "reason 4"
  // }
  // useEffect will run on stageCanvasRef value assignment
  useEffect(() => {
    if (open) {
      var element = document.getElementById('div-image');
      if (element) {
        var positionInfo = element.getBoundingClientRect();
        var height = positionInfo.height;
        var width = positionInfo.width;
        let numRow = isMobile() ? 4 : 6;
        setWidthBoxImage(width / numRow - 5);
      }
    }
  }, [open]);

  return (
    <>
      <Modal
        width={'700px'}
        titleFontSize={20}
        centered
        zIndex={1300}
        maskClosable={false}
        open={open}
        title={
          <>
            <Text style={{ fontSize: '15px', fontWeight: 'bold' }}>Thông tin đăng ký xe</Text>
          </>
        }
        onCancel={handleCancel}
        cancelText="Đóng"
        autoFocusButton="cancel"
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
          </>
        )}
      >
        <Row gutter={16}>
          {/* thông tin chung */}
          <Col xs={24} sm={12}>
            <Text className="title-detail">Thông tin chung</Text>
            <div style={{ margin: '5px 0px 0px 0px' }}>
              <Text style={{ marginRight: '5px', fontWeight: 500 }}>
                {`Trạng thái: `}
                {dataSelect ? getColorChipStatus(dataSelect?.status, dataSelect?.timeInExpected) : ''}
              </Text>
              <Flex direction="row">
                <Text style={{ marginRight: '5px', fontWeight: 500 }}>Vendor:</Text>
                <Text>{dataSelect?.vendor}</Text>
              </Flex>
              <Flex direction="row">
                <Text style={{ marginRight: '5px', fontWeight: 500 }}>Biển số xe:</Text>
                <Text>{dataSelect?.carNumber}</Text>
              </Flex>
              <div>
                <Text style={{ marginRight: '5px', fontWeight: 500 }}>Mục đích:</Text>
              </div>
              <Text>{dataSelect?.reason}</Text>
            </div>
          </Col>
          {/* ==================== */}
          {/* thông tin người */}
          <Col xs={24} sm={12}>
            <Text className="title-detail">Thông tin người</Text>
            <div style={{ margin: '5px 0px 0px 0px' }}>
              <Row>
                <Col span={12}>
                  <Text style={{ textAlign: 'left' }} strong>
                    Họ tên
                  </Text>
                </Col>
                <Col style={{ textAlign: 'center' }} span={12}>
                  <Text strong>Giấy tờ tuỳ thân</Text>
                </Col>
              </Row>
              <Divider style={{ margin: '0px 0px' }} />
              <Row>
                <Col span={12}>
                  <Text style={{ textAlign: 'left' }}>Dương Ngô Tuấn</Text>
                </Col>
                <Col style={{ textAlign: 'center' }} span={12}>
                  <Text>122415883656(CCCD)</Text>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Text style={{ textAlign: 'left' }}>Nguyễn Anh Dương</Text>
                </Col>
                <Col style={{ textAlign: 'center' }} span={12}>
                  <Text>122415883(CMND)</Text>
                </Col>
              </Row>
            </div>
          </Col>
          {/* =================== */}
          {/* thông tin thoi gian */}
          <Col style={{ margin: '7px 0px' }} span={24}>
            <Text className="title-detail">Thông tin thời gian</Text>
          </Col>
          <Col xs={24} sm={12}>
            <Flex direction="row">
              <Text className="title-time">Giờ vào(dự kiến):</Text>
              <Text>{dataSelect?.timeInExpected ? formatDateFromDB(dataSelect?.timeInExpected) : ''}</Text>
            </Flex>
            <Flex direction="row">
              <Text className="title-time">Giờ ra(dự kiến):</Text>
              <Text>{dataSelect?.timeOutExpected ? formatDateFromDB(dataSelect?.timeOutExpected) : ''}</Text>
            </Flex>
          </Col>
          <Col xs={24} sm={12}>
            <Flex direction="row">
              <Text className="title-time">Giờ vào(thực tế):</Text>
              <Text>12:23 22/02/2024</Text>
            </Flex>
            <Flex direction="row">
              <Text className="title-time">Giờ ra(thực tế):</Text>
              <Text>18:00 22/02/2024</Text>
            </Flex>
          </Col>
          {/* =================== */}
          {/* thong tin hinh anh */}
          <Col style={{ margin: '7px 0px' }} span={24}>
            <Text className="title-detail">Thông tin hình ảnh</Text>
          </Col>
          <Col span={24}>
            <div id={'div-image'} className="box-image">
              <Image.PreviewGroup
              // preview={{
              //   onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`)
              // }}
              >
                <Image width={widthBoxImage} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                <Image width={widthBoxImage} src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
                <Image width={widthBoxImage} src="https://picsum.photos/200" />
                <Image width={widthBoxImage} src="https://picsum.photos/200" />
                <Image width={widthBoxImage} src="https://picsum.photos/200" />
                <Image width={widthBoxImage} src="https://picsum.photos/200" />
                <Image width={widthBoxImage} src="https://picsum.photos/200" />
              </Image.PreviewGroup>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalInfoStruck;
