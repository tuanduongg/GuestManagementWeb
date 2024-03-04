import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Row, Col, Flex, Typography, Spin } from 'antd';
import { CaretRightOutlined, InfoCircleOutlined, EditOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
import './modal_info_guest.css';
import { formatDateFromDB, formatHourMinus, getColorChipStatus, isMobile } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { concatDateString } from './modal_info_guest.service';
import config from 'config';

const ModalInfoGuest = ({ open, handleClose, dataSelect, onClickEdit }) => {
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
        width={'600px'}
        titleFontSize={20}
        centered
        zIndex={1300}
        maskClosable={false}
        open={open}
        title={
          <>
            <Text style={{ fontSize: '15px', fontWeight: 'bold' }}>Thông tin đăng ký khách</Text>
          </>
        }
        onCancel={handleCancel}
        cancelText="Đóng"
        okText="Chỉnh sửa"
        autoFocusButton="cancel"
        // okButtonProps={{ icon: <EditOutlined /> }}
        cancelButtonProps={{ icon: <CloseOutlined /> }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <div className="footer-modal">
              <Button
                type="link"
                onClick={() => {
                  onClickEdit(dataSelect);
                }}
                icon={<EditOutlined />}
              >
                Chỉnh sửa
              </Button>
              <div>
                {/* <OkBtn icon={<EditOutlined />} /> */}
                {!isMobile() && <CancelBtn />}
                {/* /className="btn-success-custom" */}
                <Button type="primary" style={{ marginLeft: '10px' }} icon={<CheckOutlined />}>
                  Đã vào
                </Button>
              </div>
            </div>
          </>
        )}
      >
        <Row gutter={16}>
          {/* thông tin chung */}
          <Col xs={24} sm={12}>
            <p className="title-detail">Thông tin chung</p>
            <Flex direction="row">
              <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                {`Trạng thái: `}
                {dataSelect ? getColorChipStatus(dataSelect?.STATUS, dataSelect?.TIME_IN) : ''}
              </Text>
            </Flex>
            <Flex direction="row">
              <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                Công ty:
              </Text>
              <Text>{dataSelect?.COMPANY ? dataSelect?.COMPANY : 'Chưa cập nhật'}</Text>
            </Flex>
            <Flex direction="row">
              <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                Biển số xe:
              </Text>
              <Text>{dataSelect?.CAR_NUMBER ? dataSelect?.CAR_NUMBER : 'Chưa cập nhật'}</Text>
            </Flex>
          </Col>
          <Col xs={24} sm={12}>
            <p className="title-detail">Thời gian</p>
            <Flex direction="row">
              <Text className="title-time">Giờ vào(dự kiến):</Text>
              <Text>{dataSelect?.TIME_IN ? formatHourMinus(dataSelect?.TIME_IN) : ''}</Text>
            </Flex>
            <Flex direction="row">
              <Text className="title-time">Giờ vào(thực tế):</Text>
              <Text>{dataSelect?.REAL_TIME_IN ?? 'Chưa cập nhật'}</Text>
            </Flex>
            <Flex direction="row">
              <Text className="title-time">Giờ ra(dự kiến):</Text>
              <Text>{dataSelect?.TIME_OUT ? formatHourMinus(dataSelect?.TIME_OUT) : ''}</Text>
            </Flex>
            <Flex direction="row">
              <Text className="title-name-custom" style={{ minWidth: '40px' }}>
                Ngày:
              </Text>
              <Text>{dataSelect?.guest_date ? concatDateString(dataSelect?.guest_date) : 'Chưa cập nhật'}</Text>
            </Flex>
          </Col>
          {/* ==================== */}
          {/* thông tin khách */}
          <Col xs={24} sm={12}>
            <p className="title-detail">Thông tin khách</p>
            <Row>
              {dataSelect?.guest_info?.map((item, index) => (
                <Col key={index} span={24}>
                  <Text className="font-bold">{`${index + 1}.${item?.FULL_NAME}`}</Text>
                </Col>
              ))}
            </Row>
          </Col>
          {/* =================== */}
          {/* Người bảo lãnh */}
          <Col xs={24} sm={12}>
            <p className="title-detail">Người bảo lãnh</p>
            <Flex direction="row">
              <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                Họ tên:
              </Text>
              <Text>{dataSelect?.PERSON_SEOWON}</Text>
            </Flex>
            <Flex direction="row">
              <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                Bộ phận:
              </Text>
              <Text>{dataSelect?.DEPARTMENT}</Text>
            </Flex>
            <Flex direction="row">
              <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                Lý do:
              </Text>
              <Text>{dataSelect?.REASON}</Text>
            </Flex>
          </Col>
          {/* thông tin người bảo lãnh */}

          {/* <Col xs={12} sm={12}>
            <Flex direction="row">
              <Text className="title-time">Giờ vào(thực tế):</Text>
              <Text>12:23 22/02/2024</Text>
            </Flex>
          </Col> */}
          {/* =================== */}
          {/* thong tin hinh anh */}
          {/* <Col style={{ margin: '7px 0px' }} span={24}>
            <Text className="title-detail">Hình ảnh</Text>
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
          </Col> */}
        </Row>
      </Modal>
    </>
  );
};
export default ModalInfoGuest;
