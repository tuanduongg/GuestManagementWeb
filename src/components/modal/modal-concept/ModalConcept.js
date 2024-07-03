import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, Form, Select, DatePicker, Upload, Button } from 'antd';
import dayjs from 'dayjs';
const { TextArea } = Input;
import config from 'config';

// assets
import { UploadOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';

const initialValidate = { error: false, message: '' };
const optionStatus = [
  { value: true, label: 'Active' },
  { value: false, label: 'Block' }
];
const initRole = (arr = []) => {
  if (arr) {
    const rs = arr.find((item) => item?.label === 'USER');
    if (rs) {
      return rs?.value;
    }
  }
  return '';
};
const initValueForm = {
  category: '',
  model: '',
  plName: '',
  code: '',
  productName: '',
  registrationDate: dayjs(),
  registrant: '',
  approval: ''
};
const ModalConcept = ({ open, handleClose, typeModal, listRole, setListConcept, setSelectedRowKeys }) => {
  const [modal, contextHolder] = Modal.useModal();
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });

  const { t } = useTranslation();

  const optionSelect = listRole
    ? listRole.map((item) => {
      return {
        value: item?.ROLE_ID,
        label: item?.ROLE_NAME
      };
    })
    : [];

  const [username, setUsername] = useState('');
  const [validateUsername, setValidateUsername] = useState(initialValidate);

  const [password, setPassword] = useState('');
  const [validatePassword, setValidatePassword] = useState(initialValidate);

  const [form] = Form.useForm();

  const [status, setStatus] = useState(true);
  const [validateStatus, setValidateStatus] = useState(initialValidate);
  const [validateDepartmenId, setValidateDepartmentId] = useState(initialValidate);

  const [optionSelectDepartment, setOptionSelectDepartment] = useState([]);
  const [valueSelectDepart, setValueSelectDepart] = useState('');

  const [roleSelect, setRoleSelect] = useState(listRole ? listRole[0]?.ROLE_ID : '');
  const [validateRole, setValidateRole] = useState(initialValidate);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const draggleRef = useRef(null);
  const handleOk = (e) => {
    form.submit();
  };

  const handleCancel = (e) => {
    setFileList([]);
    form.resetFields();
    handleClose();
  };
  const handleOnSave = async (values) => {
    handleCancel();
    setListConcept((pre) => {
      return [...pre, values];
    });
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    });
  };

  const onClickCancel = () => {
    let check = false;
    if (username?.trim() !== '') {
      check = true;
    }
    if (password?.trim() !== '') {
      check = true;
    }
    if (check) {
      modal.confirm({
        title: t('msg_notification'),
        content: t('msg_confirm_close'),
        okText: t('yes'),
        cancelText: t('close'),
        centered: true,
        onOk: () => {
          handleCancel();
        }
      });
    } else {
      handleCancel();
    }
  };

  const onFinishForm = (values) => {
    const newValue = { ...values, registrationDate: values?.registrationDate.format('DD/MM/YYYY') };
    modal.confirm({
      centered: true,
      title: 'Thông báo',
      content: 'Bạn chắc chắn muốn thêm mới thiết bị?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        handleOnSave(newValue);
      },
      onCancel() { }
    });
  };

  const onChangeFileUpload = (info) => {
    // Update state with uploaded file list
    setFileList(info?.fileList);
  }
  return (
    <>
      {contextHolder}
      <Modal
        centered
        okText={t('saveButton')}
        cancelText={t('close')}
        zIndex={1300}
        maskClosable={false}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move'
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => { }}
            onBlur={() => { }}
          // end
          >
            Create New
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={onClickCancel}
        modalRender={(modal) => (
          <Draggable disabled={disabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      // footer={(_, { OkBtn, CancelBtn }) => (
      //   <>
      //     {typeModal !== 'VIEW' && (
      //       <>
      //         <CancelBtn />
      //         <OkBtn />
      //       </>
      //     )}
      //   </>
      // )}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form
              initialValues={initValueForm}
              form={form}
              size={'middle'}
              layout="vertical"
              onFinish={onFinishForm}
              onFinishFailed={() => { }}
              autoComplete="off"
            >
              <Row gutter={[8]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'This field is requied!'
                      }
                    ]}
                    name="category"
                    label="카테고리"
                  >
                    <Select
                      filterOption={(input, option) => {
                        return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
                      }}
                      showSearch
                      style={{ width: '100%' }}
                      options={[
                        {
                          value: 'ACC',
                          label: 'ACC'
                        },
                        {
                          value: 'RUBBER',
                          label: 'RUBBER'
                        },
                        {
                          value: 'CONVERTING',
                          label: 'CONVERTING'
                        },
                        {
                          value: 'INJECTION',
                          label: 'INJECTION'
                        },
                        {
                          value: 'METAL KEY 5개중 택',
                          label: 'METAL KEY 5개중 택'
                        }
                      ]}
                    ></Select>
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'This field is requied!'
                      }
                    ]}
                    name="code"
                    label="코드"
                  >
                    <Input placeholder="코드..." />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'This field is requied!'
                      }
                    ]}
                    name="model"
                    label="모델명"
                  >
                    <Input placeholder="모델명..." />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'This field is requied!'
                      }
                    ]}
                    name="productName"
                    label="품명"
                  >
                    <Input placeholder="품명..." />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'This field is requied!'
                      }
                    ]}
                    name="plName"
                    label="PL_NAME"
                  >
                    <Input placeholder="PL_NAME..." />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: 'This field is requied!'
                      }
                    ]}
                    name="registrationDate"
                    label="첨부자료"
                  >
                    <DatePicker format={config.dateFormat} style={{ width: '100%' }} onChange={() => { }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24}>
                  <Form.Item name="registrant" label="등록자">
                    <Input placeholder="등록자..." />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24}>
                  <Form.Item name="file" label="등록일자">
                    <Upload multiple fileList={fileList} beforeUpload={(file, fileList) => false} onChange={onChangeFileUpload}>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalConcept;
