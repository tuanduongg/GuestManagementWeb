import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal, App, Row, Col, Typography, message, Flex, Form, Select, Button, Upload, DatePicker } from 'antd';
const { TextArea } = Input;
const { Title } = Typography;
// assets
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC, addCommaToString, formatCurrency, isMobile, moneyFormat } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import config from 'config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';

import { STATUS_DEVICE } from 'pages/manage-device/manage_device.service';

const formatPrice = (value) => {
  // Xóa các ký tự không phải số từ giá trị nhập vào
  const sanitizedValue = value.replace(/[^0-9]/g, '');

  // Kiểm tra xem giá trị sau khi xóa ký tự có bằng không hay không
  if (sanitizedValue !== '') {
    if (value) {
      const sanitizedValue = value.replace(/[^0-9]/g, '');

      // Chuyển định dạng số thành chuỗi có dấu phẩy ngăn cách hàng nghìn
      const formattedValue = new Intl.NumberFormat('en-US').format(parseInt(sanitizedValue, 10));

      return formattedValue.replace(',', '.');
    }
    return value;
  }
  return '';
};
const initValidate = { err: false, msg: '' };
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const initialValuesForm = {
  DEVICE_ID: '',
  NAME: '',
  categoryID: '',
  MODEL: '',
  MANUFACTURER: '',
  SERIAL_NUMBER: '',
  MAC_ADDRESS: '',
  IP_ADDRESS: '',
  PRICE: '',
  BUY_DATE: '',
  EXPIRATION_DATE: '',
  USER_FULLNAME: '',
  USER_CODE: '',
  USER_DEPARTMENT: '',
  INFO: '',
  NOTE: '',
  DEVICE_CODE: '',
  LOCATION: '',
  STATUS: 'USING'
};
const ModalAddDevice = ({ open, handleClose, setLoading, categories, getAllData, getStatistic, currentRow, typeModal }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [initValueForm, setInitValueForm] = useState(initialValuesForm);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [info, setInfo] = useState('');
  const [note, setNote] = useState('');

  const handleOk = (e) => {
    form.submit();
  };
  const handleCancel = (e) => {
    if (e?.keyCode === 27) {
      console.log();
    } else {
      form.resetFields(); // Đặt lại trường của form
      setFileList([]);
      handleClose();
    }
  };

  useEffect(() => {
    if (open && currentRow && typeModal === 'EDIT') {
      form.setFieldValue('NAME', currentRow?.NAME);
      form.setFieldValue('categoryID', currentRow?.categoryID);
      form.setFieldValue('MODEL', currentRow?.MODEL);
      form.setFieldValue('MANUFACTURER', currentRow?.MANUFACTURER);
      form.setFieldValue('SERIAL_NUMBER', currentRow?.SERIAL_NUMBER);
      form.setFieldValue('MAC_ADDRESS', currentRow?.MAC_ADDRESS);
      form.setFieldValue('IP_ADDRESS', currentRow?.IP_ADDRESS);
      form.setFieldValue('PRICE', addCommaToString(currentRow?.PRICE));

      if (currentRow?.BUY_DATE) {
        form.setFieldValue('BUY_DATE', dayjs(currentRow?.BUY_DATE));
      }

      if (currentRow?.EXPIRATION_DATE) {
        form.setFieldValue('EXPIRATION_DATE', dayjs(currentRow?.EXPIRATION_DATE));
      }

      form.setFieldValue('USER_FULLNAME', currentRow?.USER_FULLNAME);
      form.setFieldValue('USER_CODE', currentRow?.USER_CODE);
      form.setFieldValue('USER_DEPARTMENT', currentRow?.USER_DEPARTMENT);
      form.setFieldValue('INFO', currentRow?.INFO);
      form.setFieldValue('NOTE', currentRow?.NOTE);
      form.setFieldValue('STATUS', currentRow?.STATUS);
      form.setFieldValue('DEVICE_ID', currentRow?.DEVICE_ID);
      form.setFieldValue('DEVICE_CODE', currentRow?.DEVICE_CODE);
      form.setFieldValue('LOCATION', currentRow?.LOCATION);
      if (currentRow?.images?.length > 0) {
        const dataImages = currentRow?.images?.map((image) => {
          return {
            uid: image?.IMAGE_ID,
            name: image?.TITLE,
            status: 'done',
            url: config?.urlImageSever + image?.URL
          };
        });
        setFileList(dataImages);
      }
    }
  }, [open]);

  const handleOnSave = async (data) => {
    setLoading(true);
    const dataSend = JSON.stringify({
      NAME: data?.NAME,
      categoryID: data?.categoryID,
      MODEL: data?.MODEL,
      MANUFACTURER: data?.MANUFACTURER,
      SERIAL_NUMBER: data?.SERIAL_NUMBER,
      MAC_ADDRESS: data?.MAC_ADDRESS,
      IP_ADDRESS: data?.IP_ADDRESS,
      PRICE: `${data?.PRICE}`.replace(',', ''),
      BUY_DATE: data?.BUY_DATE,
      EXPIRATION_DATE: data?.EXPIRATION_DATE,
      USER_FULLNAME: data?.USER_FULLNAME,
      USER_CODE: data?.USER_CODE,
      USER_DEPARTMENT: data?.USER_DEPARTMENT,
      INFO: data?.INFO,
      NOTE: data?.NOTE,
      STATUS: data?.STATUS,
      DEVICE_CODE: data?.DEVICE_CODE,
      LOCATION: data?.LOCATION,
      DEVICE_ID: data?.DEVICE_ID ?? ''
    });
    var formData = new FormData();
    formData.append('data', dataSend);

    if (fileList && fileList?.length > 0) {
      fileList.map((file) => {
        if (file?.originFileObj) {
          formData.append('files', file?.originFileObj);
        }
      });
    }
    const url = typeModal === 'ADD' ? RouterAPI.addDevice : RouterAPI.editDevice;
    const res = await restApi.post(url, formData);
    setLoading(false);
    if (res?.status === 200) {
      message.success(typeModal === 'ADD' ? 'Add new device successful!' : 'Update device successful!');
      handleCancel();
      getStatistic();
      getAllData();
    } else {
      message.error(res?.data?.message ?? typeModal === 'ADD' ? 'Add new device fail!' : 'Update device fail!');
    }
  };
  const onFinish = (values) => {
    modal.confirm({
      centered: true,
      title: 'Thông báo',
      content: 'Bạn chắc chắn muốn thêm mới thiết bị?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        handleOnSave(values);
      },
      onCancel() {}
    });
  };
  const onFinishFailed = (values) => {};
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleDeleteImage = async (id) => {
    if (id) {
      const data = await restApi.post(RouterAPI.deleteImageDevice, { imageID: id });
      if (data?.status === 200) {
        message.success('Xóa thành công!');
        getAllData();
        return;
      }
      message.error(data?.data?.message ?? 'Delete Fail');
      setFileList(fileList); // xóa fail thì lấy lại ảnh
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        centered
        okText={t('saveButton')}
        cancelText={t('close')}
        width={700}
        zIndex={1300}
        maskClosable={false}
        title={typeModal === 'ADD' ? 'Thêm mới thiết bị' : 'Chỉnh sửa thông tin thiết bị'}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden', padding: '10px', scrollbarWidth: '1px' }}>
          <Form
            initialValues={initValueForm}
            form={form}
            size={'middle'}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            onFieldsChange={(changedFields, allFields) => {
              if (changedFields[0]?.name[0] === 'PRICE') {
                let inputValue = changedFields[0]?.value;
                if (inputValue?.length > 3) {
                  inputValue = inputValue.replace(/,/g, '');
                  // Thêm dấu phẩy sau mỗi 3 ký tự
                  const formattedValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  form.setFieldValue('PRICE', formattedValue);
                }
              }
            }}
          >
            <Row gutter={[8]}>
              <Form.Item name="DEVICE_ID" style={{ display: 'none' }}>
                <Input type="text" />
              </Form.Item>
              <Col xs={24} sm={8}>
                <Form.Item name="DEVICE_CODE" label="Mã thiết bị">
                  <Input placeholder="Mã thiết bị..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={16}>
                <Form.Item
                  name="NAME"
                  label="Tên thiết bị"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc nhập tên thiết bị!'
                    }
                  ]}
                >
                  <Input placeholder="Tên thiết bị..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="categoryID"
                  label="Loại thiết bị"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc chọn loại thiết bị!'
                    }
                  ]}
                >
                  <Select
                    filterOption={(input, option) => {
                      return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
                    }}
                    showSearch
                    style={{ width: '100%' }}
                  >
                    {categories?.map((categorie, index) => (
                      <Select.Option key={index} value={categorie?.categoryID}>
                        {categorie?.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="STATUS"
                  label="Trạng thái"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc chọn trạng thái!'
                    }
                  ]}
                >
                  <Select
                    filterOption={(input, option) => {
                      return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
                    }}
                    showSearch
                    style={{ width: '100%' }}
                  >
                    {Object.values(STATUS_DEVICE)?.map((status, index) => (
                      <Select.Option key={index} value={status?.value}>
                        {status?.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item name="MODEL" label="Model">
                  <Input placeholder="Nhập model..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="MANUFACTURER" label="Hãng sản xuất">
                  <Input placeholder="Nhập hãng sản xuất..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="SERIAL_NUMBER" label="Số serial">
                  <Input placeholder="Nhập số Serial..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="MAC_ADDRESS" label="Địa chỉ MAC">
                  <Input placeholder="Nhập địa chỉ MAC..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="IP_ADDRESS" label="Địa chỉ IP">
                  <Input placeholder="Nhập địa chỉ IP..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="PRICE" label="Giá tiền">
                  <Input onChange={(e) => {}} placeholder="Nhập giá tiền..." />
                </Form.Item>
              </Col>
              <Col xs={12} sm={8}>
                <Form.Item name="BUY_DATE" label="Ngày mua">
                  <DatePicker format={config.dateFormat} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={12} sm={8}>
                <Form.Item name="EXPIRATION_DATE" label="Ngày hết hạn bảo hành">
                  <DatePicker format={config.dateFormat} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="USER_FULLNAME" label="Tên người sử dụng">
                  <Input placeholder="Nhập họ tên người sử dụng..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="USER_CODE" label="Mã nhân viên">
                  <Input placeholder="Nhập mã nhân viên..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="USER_DEPARTMENT" label="Bộ phận">
                  <Input placeholder="Nhập bộ phận..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="LOCATION" label="Vị trí">
                  <Input placeholder="Nhập vị trí..." />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="INFO" label="Cấu hình">
                  <ReactQuill theme="snow" value={info} onChange={setInfo} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="NOTE" label="Ghi chú">
                  <ReactQuill theme="snow" value={note} onChange={setNote} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Hình ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
                  <Upload
                    onRemove={(file) => {
                      modal.confirm({
                        centered: true,
                        title: 'Thông báo',
                        content: 'Bạn chắc chắn muốn xóa ảnh này',
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk() {
                          if (!file?.originFileObj) {
                            handleDeleteImage(file?.uid);
                          }
                        },
                        onCancel() {
                          setFileList(fileList);
                        }
                      });
                    }}
                    fileList={fileList}
                    multiple
                    accept=".png,.jpeg,.png,.jpg,.PNG,.JPEG,.JPG,.JPG"
                    onPreview={() => {}}
                    beforeUpload={() => false}
                    onChange={(info) => {
                      setFileList(info.fileList);
                    }}
                    listType="picture-card"
                  >
                    <button
                      style={{
                        border: 0,
                        background: 'none'
                      }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8
                        }}
                      >
                        Tải lên ảnh
                      </div>
                    </button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default ModalAddDevice;
