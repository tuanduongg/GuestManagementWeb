import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, Table, Checkbox, Divider } from 'antd';
import dayjs from 'dayjs';
const { TextArea } = Input;

// assets
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { ConfigMenuAlias } from 'ConfigMenuAlias';
import { INITIAL_PERMISSTION } from './modal-role.service';

const initialValidate = { error: false, message: '' };
const optionStatus = [
  { value: true, label: 'Active' },
  { value: false, label: 'Block' }
];
const initRole = (arr = []) => {
  if (arr) {
    const rs = arr.find((item) => item?.ROLE_NAME === 'USER');
    if (rs) {
      return rs?.ROLE_ID;
    }
  }
  return '';
};
const ModalRole = ({ open, handleClose, listRole, afterSave }) => {
  const { modal } = App.useApp();
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });

  const [roleName, setRoleName] = useState('');
  const [validateRoleName, setValidateRoleName] = useState(initialValidate);

  const [dataPermisstion, setDataPermission] = useState(INITIAL_PERMISSTION);

  const [status, setStatus] = useState(true);

  const [role, setRole] = useState(initRole(listRole));

  const draggleRef = useRef(null);
  const handleOk = (e) => {
    let check = false;
    if (roleName?.trim() === '') {
      setValidateRoleName({ error: true, message: 'Trường này bắt buộc nhập' });
      check = true;
    }
    if (!check) {
      Modal.confirm({
        title: `Thông báo`,
        content: 'Bạn chắc chắn muốn đóng?',
        okText: 'Có',
        cancelText: 'Không',
        centered: true,
        onOk: () => {
          handleSave();
        }
      });
    }
  };
  const handleSave = async () => {
    const data = {
      ROLE_NAME: roleName,
      data: dataPermisstion
    };
    const res = await restApi.post(RouterAPI.addRole, data);
    if (res?.status === 200) {
      handleCancel();
    }
    afterSave(res);
  };

  const handleCancel = (e) => {
    setValidateRoleName(initialValidate);
    setRoleName('');
    handleClose();
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

  const onChangeInput = (e) => {
    const { value, name } = e.target;
    if (validateRoleName.error) {
      setValidateRoleName(initialValidate);
    }
    setRoleName(value);
  };

  const onClickCancel = () => {
    let check = false;
    if (roleName?.trim() !== '') {
      check = true;
    }
    if (check) {
      Modal.confirm({
        title: `Thông báo`,
        content: 'Bạn chắc chắn muốn đóng?',
        okText: 'Có',
        cancelText: 'Không',
        centered: true,
        onOk: () => {
          handleCancel();
        }
      });
    } else {
      handleCancel();
    }
  };

  const onChangeChecked = (e, index) => {
    const { checked, name } = e.target;
    const dataUp = [];
    const dataNew = dataPermisstion?.map((item, i) => {
      if (i === index) {
        item[name] = checked;
        return { ...item };
      }
      return item;
    });
    setDataPermission(dataNew);
  };
  return (
    <>
      <Modal
        centered
        okText="Lưu thông tin"
        cancelText="Đóng"
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
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            Thêm mới quyền truy cập
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
      >
        <Row gutter={16} style={{ marginBottom: '15px' }}>
          <Col xs={24} sm={24}>
            <p className="custom-label-input">
              Tên quyền(<span className="color-red">*</span>)
            </p>
            <Input
              value={roleName}
              name={'roleName'}
              status={validateRoleName.error ? 'error' : ''}
              onChange={onChangeInput}
              placeholder="Nhập tên quyền..."
            />
            {validateRoleName.error && <p className="message-err">(*){validateRoleName.message}</p>}
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Divider style={{ margin: '10px 0px' }} />
          <Col span={8}>
            <strong style={{ marginLeft: '10px' }}>Screen</strong>
          </Col>
          <Col className="center-text" span={3}>
            <strong>Read</strong>
          </Col>
          <Col className="center-text" span={3}>
            <strong>Create</strong>
          </Col>
          <Col className="center-text" span={4}>
            <strong>Update</strong>
          </Col>
          <Col className="center-text" span={3}>
            <strong>Delete</strong>
          </Col>
          <Col span={3}>
            <strong>Accept</strong>
          </Col>
        </Row>
        <Divider style={{ margin: '10px 0px' }} />
        {dataPermisstion?.map((item, idx) => (
          <Row key={idx} style={{ marginTop: '10px' }}>
            <Col span={9}>{item?.screen}</Col>
            <Col span={3}>
              <Checkbox
                name="isRead"
                onChange={(e) => {
                  onChangeChecked(e, idx);
                }}
                checked={dataPermisstion[idx]?.isRead}
              />
            </Col>
            <Col span={3}>
              <Checkbox
                name="isCreate"
                onChange={(e) => {
                  onChangeChecked(e, idx);
                }}
                checked={dataPermisstion[idx]?.isCreate}
              />
            </Col>
            <Col span={3}>
              <Checkbox
                name="isUpdate"
                onChange={(e) => {
                  onChangeChecked(e, idx);
                }}
                checked={dataPermisstion[idx]?.isUpdate}
              />
            </Col>
            <Col className="center-text" span={3}>
              <Checkbox
                name="isDelete"
                onChange={(e) => {
                  onChangeChecked(e, idx);
                }}
                checked={dataPermisstion[idx]?.isDelete}
              />
            </Col>
            <Col className="center-text" span={3}>
              <Checkbox
                name="isAccept"
                onChange={(e) => {
                  onChangeChecked(e, idx);
                }}
                checked={dataPermisstion[idx]?.isAccept}
              />
            </Col>
          </Row>
        ))}
        <Divider style={{ margin: '10px 0px' }} />
      </Modal>
    </>
  );
};
export default ModalRole;
