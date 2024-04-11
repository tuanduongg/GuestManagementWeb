import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, Typography, message, Flex, Form, Select, Button, Upload, Image } from 'antd';
const { TextArea } = Input;
const { Title } = Typography;
// assets
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC, isMobile } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import './modal-add-product.css';
import config from 'config';

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
  name: '',
  price: '',
  inventory: '',
  unit: '',
  category: '',
  desciption: ''
};
const ModalAddProduct = ({ open, handleClose, categories, listUnit, typeModal, setLoading, onAfterSave, currentRow, afterDeleteImage }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [initValueForm, setInitValueForm] = useState(initialValuesForm);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const handleOk = (e) => {
    form.submit();
  };
  const handleCancel = () => {
    form.resetFields(); // Đặt lại trường của form
    setFileList([]);
    handleClose();
  };
  useEffect(() => {
    if (open && currentRow && typeModal === 'EDIT') {
      form.setFieldsValue({
        name: currentRow?.productName,
        price: currentRow?.price,
        inventory: currentRow?.inventory,
        unit: currentRow?.unit?.unitID,
        category: currentRow?.category?.categoryID,
        desciption: currentRow?.description
      });
      if (currentRow?.images) {
        const dataImages = currentRow?.images.map((item) => {
          return {
            uid: item?.imageID,
            name: item?.title,
            status: 'done',
            url: config.urlImageSever + item?.url
          };
        });
        setFileList(dataImages);
      }
    }
  }, [open]);

  const handleOnSave = async (data) => {
    setLoading(true);
    const dataSend = JSON.stringify({
      productID: currentRow?.productID,
      name: data?.name,
      price: data?.price,
      description: data?.desciption,
      inventory: data?.inventory,
      category: data?.category,
      unitID: data?.unit
    });
    var formData = new FormData();
    formData.append('data', dataSend);

    if (fileList && fileList?.length > 0) {
      fileList.map((file) => {
        formData.append('files', file?.originFileObj);
      });
    }
    const url = typeModal === 'EDIT' ? RouterAPI.editProduct : RouterAPI.addProduct;
    const res = await restApi.post(url, formData);
    setLoading(false);
    if (res?.status === 200) {
      let txt = typeModal === 'EDIT' ? 'Update product successful!' : 'Add product successful!';

      message.success(res?.data?.message ?? txt);
      handleCancel();
      onAfterSave();
    } else {
      message.error(res?.data?.message);
    }
    // afterSaved(res);
  };
  const onFinish = (values) => {
    handleOnSave(values);
  };
  const onFinishFailed = (values) => {
    // message.error('Submit failed!');
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleBeforeUpload = (file) => {
    // Xử lý trước khi tải lên
    // console.log('File to upload:', file);

    // Trả về false để ngăn không gửi yêu cầu lên server
    return false;
  };
  const handleChange = (info) => {
    setFileList(info.fileList);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  console.log('fileList', fileList);
  const handleDeleteImage = async (id) => {
    if (id) {
      const data = await restApi.post(RouterAPI.deleteImageByID, { imageID: id });
      if (data?.status === 200) {
        message.success('Xóa thành công!');
        afterDeleteImage(currentRow?.productID,id);
        return;
      }
      message.error(data?.data?.message ?? 'Delete Fail');
      setFileList(fileList); // xóa fail thì lấy lại ảnh
    }
  };
  const onRemoveImage = (file) => {
    modal.confirm({
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
  };
  return (
    <>
      {contextHolder}
      <Modal
        centered
        okText={t('saveButton')}
        cancelText={t('close')}
        width={530}
        zIndex={1300}
        maskClosable={false}
        title={typeModal === 'EDIT' ? 'Chỉnh sửa sản phẩm' : 'Tạo mới sản phẩm'}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        className="detail-modal"
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden', padding: '10px', scrollbarWidth: '1px' }}>
          <Form
            initialValues={initValueForm}
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                {
                  required: true,
                  message: 'Bắt buộc nhập tên sản phẩm!'
                }
              ]}
            >
              <Input placeholder="Tên sản phẩm..." />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={12}>
                <Form.Item
                  name="price"
                  label="Giá tiền"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc nhập giá tiền!'
                    }
                  ]}
                >
                  <Input placeholder="Nhập giá tiền..." />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="inventory"
                  label="Tồn kho"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc nhập số lượng tồn kho!'
                    },
                    {
                      pattern: /^[0-9]*$/,
                      message: 'Tồn kho phải là chữ số!'
                    }
                  ]}
                >
                  <Input placeholder="Nhập số lượng tồn kho..." />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={12}>
                <Form.Item
                  name="unit"
                  label="Đơn vị"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc nhập đơn vị!'
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
                    {listUnit?.map((unit, index) => (
                      <Select.Option key={index} value={unit?.unitID}>
                        {unit?.unitName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="category"
                  label="Danh mục"
                  rules={[
                    {
                      required: true,
                      message: 'Bắt buộc chọn danh mục!'
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
            </Row>
            <Form.Item
              name="desciption"
              label="Mô tả"
              rules={[
                {
                  required: true,
                  message: 'Bắt buộc nhập mô tả!'
                }
              ]}
            >
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
              <Upload
                onRemove={onRemoveImage}
                fileList={fileList}
                multiple
                accept=".png,.jpeg,.png,.jpg"
                onPreview={handlePreview}
                beforeUpload={handleBeforeUpload}
                onChange={handleChange}
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
          </Form>
        </div>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: 'none'
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage('')
            }}
            src={previewImage}
          />
        )}
      </Modal>
    </>
  );
};
export default ModalAddProduct;
