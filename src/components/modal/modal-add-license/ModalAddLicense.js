import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal, Table, Row, Col, Typography, message, Flex, Form, Select, Button, Upload, DatePicker } from 'antd';
const { TextArea } = Input;
const { Title, Link, Paragraph } = Typography;
// assets
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC, addCommaToString, formatCurrency, isMobile, moneyFormat } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import config from 'config';
import dayjs from 'dayjs';
import { STATUS_DEVICE } from 'pages/manage-device/manage_device.service';
import { LICENSE_TYPES } from './modal-add-linsence.service';

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
  LICENSE_ID: '',
  LICENSE_KEY: '',
  LICENSE_TYPE: '',
  LICENSE_START_DATE: '',
  LICENSE_END_DATE: '',
  LICENSE_PRICE: '',
  LICENSE_NOTE: ''
};
const ModalAddLicense = ({
  open,
  handleClose,
  setLoading,
  categories,
  getAllData,
  listLicenseProp,
  setListLicenseProp,
  currentRow,
  typeModal
}) => {
  const { t } = useTranslation();
  const [initValueForm, setInitValueForm] = useState(initialValuesForm);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [linceseType, setLicenseType] = useState('');
  const [listLicense, setListLicense] = useState([]);

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
      setLicenseType('');
    }
  };

  const onChangeLinceseType = (value) => {
    setLicenseType(value);
  };
  const getAllLicenses = async () => {
    const res = await restApi.get(RouterAPI.licenseGetAll);
    setListLicense(res?.data);
  };
  useEffect(() => {
    if (open) {
      getAllLicenses();
      if (currentRow && typeModal === 'EDIT') {
        form.setFieldValue('LICENSE_TYPE', currentRow?.LICENSE_TYPE);
        setLicenseType(currentRow?.LICENSE_TYPE);
        form.setFieldValue('LICENSE_ID', currentRow?.LICENSE_ID);
        form.setFieldValue('LICENSE_START_DATE', currentRow?.LICENSE_START_DATE);
        form.setFieldValue('LICENSE_END_DATE', currentRow?.LICENSE_END_DATE);
        form.setFieldValue('LICENSE_KEY', currentRow?.LICENSE_KEY);
        form.setFieldValue('LICENSE_PRICE', currentRow?.LICENSE_PRICE);
        form.setFieldValue('LICENSE_NOTE', currentRow?.LICENSE_NOTE);
        form.setFieldValue('LICENSE_NAME', currentRow?.LICENSE_NAME);
      }
    }
  }, [open]);
  const handleOnSave = async (data) => {
    if (typeModal === 'EDIT') {
      const newList = listLicenseProp?.map((item, index) => {
        if (index === currentRow?.index) {
          const lincenseID = form.getFieldValue('LICENSE_ID');
          if (lincenseID) {
            item.LICENSE_NAME = listLicense.find((ite) => ite.LICENSE_ID === lincenseID)?.LICENSE_NAME;
          }
          item.LICENSE_TYPE = form.getFieldValue('LICENSE_TYPE');
          item.LICENSE_ID = form.getFieldValue('LICENSE_ID');
          item.LICENSE_START_DATE = form.getFieldValue('LICENSE_START_DATE');
          item.LICENSE_END_DATE = form.getFieldValue('LICENSE_END_DATE');
          item.LICENSE_KEY = form.getFieldValue('LICENSE_KEY');
          item.LICENSE_PRICE = form.getFieldValue('LICENSE_PRICE');
          item.LICENSE_NOTE = form.getFieldValue('LICENSE_NOTE');
        }
        return item;
      });
      setListLicenseProp(newList);
    } else {
      setListLicenseProp((prevState) => {
        data.LICENSE_NAME = listLicense?.find((item) => item?.LICENSE_ID === data?.LICENSE_ID)?.LICENSE_NAME ?? '';
        return [...prevState, data];
      });
    }
    handleCancel();
  };
  const onFinish = (values) => {
    modal.confirm({
      centered: true,
      title: 'Thông báo',
      content: 'Bạn chắc chắn muốn thêm mới?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        handleOnSave(values);
      },
      onCancel() {}
    });
  };
  const onFinishFailed = (values) => {};
  return (
    <>
      {contextHolder}
      <Modal
        centered
        okText={t('saveButton')}
        cancelText={t('close')}
        width={500}
        zIndex={1301}
        maskClosable={false}
        title={typeModal === 'ADD' ? 'Thêm mới' : 'Chỉnh sửa thông tin'}
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
              if (changedFields[0]?.name[0] === 'LICENSE_PRICE') {
                let inputValue = changedFields[0]?.value;
                if (inputValue?.length > 3) {
                  inputValue = inputValue.replace(/,/g, '');
                  // Thêm dấu phẩy sau mỗi 3 ký tự
                  const formattedValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                  form.setFieldValue('LICENSE_PRICE', formattedValue);
                }
              }
            }}
          >
            <Row gutter={[8]}>
              {/* <Form.Item name="DEVICE_ID" style={{ display: 'none' }}>
                <Input type="text" />
              </Form.Item> */}
              <Col xs={24} sm={15}>
                <Form.Item
                  name="LICENSE_ID"
                  label="Tên phần mềm"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc nhập trường này!'
                    }
                  ]}
                >
                  <Select onChange={() => {}} style={{ width: '100%' }}>
                    {listLicense?.map((lisence, index) => (
                      <Select.Option key={index} value={lisence?.LICENSE_ID}>
                        {lisence?.LICENSE_NAME}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={9}>
                <Form.Item
                  name="LICENSE_TYPE"
                  label="Loại"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc nhập trường này!'
                    }
                  ]}
                >
                  <Select onChange={onChangeLinceseType} style={{ width: '100%' }}>
                    {LICENSE_TYPES?.map((type, index) => (
                      <Select.Option key={index} value={type?.value}>
                        {type?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item name="LICENSE_START_DATE" label="Ngày bắt đầu">
                  <DatePicker
                    disabled={linceseType === 'FOREVER'}
                    placement="bottomRight "
                    format={config.dateFormat}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item name="LICENSE_END_DATE" label="Ngày kết thúc">
                  <DatePicker
                    disabled={linceseType === 'FOREVER'}
                    placement="bottomRight "
                    format={config.dateFormat}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={15}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc nhập trường này!'
                    }
                  ]}
                  name="LICENSE_KEY"
                  label="Key"
                >
                  <Input placeholder="Nhập key..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={9}>
                <Form.Item name="LICENSE_PRICE" label="Giá tiền">
                  <Input placeholder="Giá tiền..." />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="LICENSE_NOTE" label="Ghi chú">
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default ModalAddLicense;
