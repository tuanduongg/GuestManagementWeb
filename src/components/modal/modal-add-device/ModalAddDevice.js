import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal, App, Row, Col, Typography, message, Flex, Form, Select, Button, Upload, DatePicker } from 'antd';
const { TextArea } = Input;
const { Title } = Typography;
// assets
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC, formatCurrency, isMobile, moneyFormat } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import config from 'config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  NOTE: ''
};
const ModalAddDevice = ({ open, handleClose, setLoading, categories }) => {
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
  const handleCancel = () => {
    form.resetFields(); // Đặt lại trường của form
    setFileList([]);
    handleClose();
  };


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
      PRICE: data?.PRICE,
      BUY_DATE: data?.BUY_DATE,
      EXPIRATION_DATE: data?.EXPIRATION_DATE,
      USER_FULLNAME: data?.USER_FULLNAME,
      USER_CODE: data?.USER_CODE,
      USER_DEPARTMENT: data?.USER_DEPARTMENT,
      INFO: data?.INFO,
      NOTE: data?.NOTE
    });
    var formData = new FormData();
    formData.append('data', dataSend);

    if (fileList && fileList?.length > 0) {
      fileList.map((file) => {
        formData.append('files', file?.originFileObj);
      });
    }
    const url = RouterAPI.addDevice;
    const res = await restApi.post(url, formData);
    setLoading(false);
    if (res?.status === 200) {
      message.success('Add new device successful!');
      handleCancel();
    } else {
      message.error(res?.data?.message ?? 'Add new device fail!');
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
        title={'Thêm mới thiết bị'}
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
              <Col xs={24}>
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
              <Col xs={12}>
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

              <Col xs={12}>
                <Form.Item name="MODEL" label="Model">
                  <Input placeholder="Nhập model..." />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item name="MANUFACTURER" label="Hãng sản xuất">
                  <Input placeholder="Nhập hãng sản xuất..." />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item name="SERIAL_NUMBER" label="Số serial">
                  <Input placeholder="Nhập số Serial..." />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item name="MAC_ADDRESS" label="Địa chỉ MAC">
                  <Input placeholder="Nhập địa chỉ MAC..." />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item name="IP_ADDRESS" label="Địa chỉ IP">
                  <Input placeholder="Nhập địa chỉ IP..." />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item name="PRICE" label="Giá tiền">
                  <Input onChange={(e) => {}} placeholder="Nhập giá tiền..." />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item name="BUY_DATE" label="Ngày mua">
                  <DatePicker format={config.dateFormat} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item name="EXPIRATION_DATE" label="Ngày hết hạn bảo hành">
                  <DatePicker format={config.dateFormat} style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={8}>
                <Form.Item name="USER_FULLNAME" label="Tên người sử dụng">
                  <Input placeholder="Nhập họ tên người sử dụng..." />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item name="USER_CODE" label="Mã nhân viên">
                  <Input placeholder="Nhập mã nhân viên..." />
                </Form.Item>
              </Col>
              <Col xs={8}>
                <Form.Item name="USER_DEPARTMENT" label="Bộ phận">
                  <Input placeholder="Nhập bộ phận..." />
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
                    onRemove={() => {}}
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
