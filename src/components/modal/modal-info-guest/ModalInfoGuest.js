import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Row, Col, Flex, Typography, Tabs, Image, Segmented } from 'antd';
import {
  PicLeftOutlined,
  FileImageOutlined,
  FileSearchOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
  AppleOutlined,
  AndroidOutlined,
  BarsOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
const { Title, Text } = Typography;
import './modal_info_guest.css';
import { formatDateFromDB, formatHourMinus, getColorChipStatus, isMobile, statusName } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { concatDateString } from './modal_info_guest.service';
import config from 'config';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const DETAIL_TAB = 'DETAIL_TAB';
const IMAGE_TAB = 'IMAGE_TAB';
const ModalInfoGuest = ({ open, handleClose, dataSelect, onClickEdit, role, onClickShowModalHistory }) => {
  const [widthBoxImage, setWidthBoxImage] = useState(100);
  const [valueTab, setValueTab] = useState(DETAIL_TAB);
  const [srcImage, setSrcImage] = useState('');
  const { t } = useTranslation();

  const handleCancel = () => {
    setSrcImage('');
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

  const getImage = async () => {
    const response = await restApi.post(RouterAPI.exportImageGuest, { id: [dataSelect?.GUEST_ID] });
    if (response?.status === 200) {
      // Convert buffer data to Uint8Array
      const uint8Array = new Uint8Array(response?.data[0]?.data);

      // Convert Uint8Array to Blob
      const blob = new Blob([uint8Array], { type: 'image/png' });

      // Create URL from Blob
      const url = URL.createObjectURL(blob);
      setSrcImage(url);
    }
  };
  useEffect(() => {
    if (valueTab === IMAGE_TAB) {
      getImage();
    }
  }, [valueTab]);
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
      if (valueTab === IMAGE_TAB) {
        getImage();
      }
    }
  }, [open]);

  return (
    <>
      <Modal
        width={valueTab === IMAGE_TAB ? '1050px' : '600px'}
        titleFontSize={20}
        centered
        zIndex={1300}
        maskClosable={false}
        open={open}
        title={
          <>
            <Text style={{ fontSize: '15px', fontWeight: 'bold' }}>{t('title_modal_info_guset')}</Text>
          </>
        }
        onCancel={handleCancel}
        cancelText={t('close')}
        // okText={t('edit')}
        autoFocusButton="cancel"
        // okButtonProps={{ icon: <EditOutlined /> }}
        cancelButtonProps={{ icon: <CloseOutlined /> }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <div className={!role?.IS_UPDATE ? 'footer-modal-right' : 'footer-modal'}>
              <CancelBtn />
              <div>
                <Button
                  style={{ margin: '0px 5px' }}
                  // type="link"
                  onClick={() => {
                    onClickShowModalHistory();
                  }}
                  icon={<FileSearchOutlined />}
                >
                  {t('history')}
                </Button>
                {role?.IS_UPDATE && dataSelect?.STATUS == statusName.NEW && (
                  <Button
                    type="primary"
                    onClick={() => {
                      onClickEdit(dataSelect);
                    }}
                    icon={<EditOutlined />}
                  >
                    {t('edit')}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      >
        <div>
          <Tabs
            value={valueTab}
            activeKey={valueTab}
            items={[
              {
                key: DETAIL_TAB,
                label: 'Detail',
                icon: <PicLeftOutlined />
              },
              {
                key: IMAGE_TAB,
                label: 'Image',
                icon: <FileImageOutlined />
                // children: 'Content of Tab Pane 2'
              }
            ]}
            onChange={(key) => {
              setValueTab(key);
            }}
          />
        </div>
        {valueTab === IMAGE_TAB && (
          <Row>
            <Col xs={24}>
              <Image style={{ objectFit: 'contain', minHeight: '300px' }} width={'auto'} height={'auto'} src={srcImage} />
            </Col>
          </Row>
        )}
        {valueTab === DETAIL_TAB && (
          <Row gutter={16}>
            {/* thông tin chung */}
            <Col xs={24} sm={12}>
              <p className="title-detail">{t('general_info')}</p>
              <Flex direction="row">
                <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                  {`${t('status_col')}: `}
                  {dataSelect ? getColorChipStatus(dataSelect?.STATUS, dataSelect?.DELETE_AT) : ''}
                </Text>
              </Flex>
              <Flex direction="row">
                <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                  {t('company_col')}:
                </Text>
                <Text>{dataSelect?.COMPANY ? dataSelect?.COMPANY : '...'}</Text>
              </Flex>
              <Flex direction="row">
                <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                  {t('carNum_col')}:
                </Text>
                <Text>{dataSelect?.CAR_NUMBER ? dataSelect?.CAR_NUMBER : '...'}</Text>
              </Flex>
              <Flex direction="row">
                <Text className="min-width-50" style={{ marginRight: '5px', fontWeight: 500 }}>
                  {t('time_create')}:
                </Text>
                <Text>{dataSelect?.CREATE_AT ? formatDateFromDB(dataSelect?.CREATE_AT) : '...'}</Text>
              </Flex>
            </Col>
            <Col xs={24} sm={12}>
              <p className="title-detail">{t('time')}</p>
              <Flex direction="row">
                <Text style={{ fontWeight: '500', marginRight: '5px' }}>{t('timeIn_col')}:</Text>
                <Text>{dataSelect?.TIME_IN ? formatHourMinus(dataSelect?.TIME_IN) : ''}</Text>
              </Flex>
              <Flex direction="row">
                <Text style={{ fontWeight: '500', marginRight: '5px' }}>{t('timeOut_col')}:</Text>
                <Text>{dataSelect?.TIME_OUT ? formatHourMinus(dataSelect?.TIME_OUT) : ''}</Text>
              </Flex>
              <Flex direction="row">
                <Text className="title-name-custom" style={{ minWidth: '65px' }}>
                  {t('dateArrived')}:
                </Text>
                <Text>{dataSelect?.guest_date ? concatDateString(dataSelect?.guest_date) : '...'}</Text>
              </Flex>
            </Col>
            {/* ==================== */}
            {/* thông tin khách */}
            <Col xs={24} sm={12}>
              <p className="title-detail">{t('nameGuest_col')}</p>
              <Row>
                {dataSelect?.guest_info?.map((item, index) => (
                  <Col key={index} span={24}>
                    <Text className="font-bold">{`${index + 1}. ${item?.FULL_NAME}`}</Text>
                  </Col>
                ))}
              </Row>
            </Col>
            {/* =================== */}
            {/* Người bảo lãnh */}
            <Col xs={24} sm={12}>
              <p className="title-detail">{t('personSeowon_col')}:</p>
              <Flex direction="row">
                <Text style={{ marginRight: '5px', fontWeight: 500 }}>{t('name')}:</Text>
                <Text>{dataSelect?.PERSON_SEOWON}</Text>
              </Flex>
              <Flex direction="row">
                <Text style={{ marginRight: '5px', fontWeight: 500 }}>{t('department_col')}:</Text>
                <Text>{dataSelect?.DEPARTMENT}</Text>
              </Flex>
              <Flex direction="row">
                <Text style={{ marginRight: '5px', fontWeight: 500 }}>{t('reason_col')}:</Text>
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
        )}
      </Modal>
    </>
  );
};
export default ModalInfoGuest;
