import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col } from 'antd';

// assets
import { InfoCircleOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import './modalChangePassword.css';
import { handleLogout, logout } from 'utils/helper';
import { useTranslation } from 'react-i18next';

const initialValidate = { error: false, message: '' };
const ModalChangePassword = ({ open, handleClose }) => {
  const { modal } = App.useApp();
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const { t, i18n } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [validateCurrentPassword, setValidateCurrentPassword] = useState(initialValidate);

  const [newPassword, setNewPassword] = useState('');
  const [validateNewPassword, setValidateNewPassword] = useState(initialValidate);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validateConfirmPassword, setValidateConfirmPassword] = useState(initialValidate);

  const [loading, setLoading] = useState(false);

  const draggleRef = useRef(null);
  const handleSave = async () => {
    setLoading(true);
    let url = RouterAPI.changePassword;
    let data = {
      currentPassword,
      newPassword,
      confirmPassword
    };
    const res = await restApi.post(url, data);
    setLoading(false);
    if (res?.status === 200) {
      Modal.confirm({
        centered: true,
        closable: false,
        okText: 'Đăng xuất',
        title: 'Thông báo',
        content: 'Đổi mật khẩu thành công!',
        keyboard: false,
        onOk: () => {
          handleLogout();
        },
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            {/* <CancelBtn /> */}
            <OkBtn />
          </>
        )
      });
    } else {
      setValidateCurrentPassword({ error: true, message: res?.data?.message });
    }
  };
  const handleOk = (e) => {
    let check = false;
    if (currentPassword?.trim() === '') {
      check = true;
      setValidateCurrentPassword({ error: true, message: ' Bắt buộc nhập trường này!' });
    }
    if (newPassword?.trim() === '') {
      check = true;
      setValidateNewPassword({ error: true, message: ' Bắt buộc nhập trường này!' });
    } else {
      if (newPassword?.length < 4) {
        check = true;
        setValidateNewPassword({ error: true, message: ' Mật khẩu có ít nhất 4 ký tự!' });
      }
    }
    if (confirmPassword?.trim() === '') {
      check = true;
      setValidateConfirmPassword({ error: true, message: ' Bắt buộc nhập trường này!' });
    } else {
      if (confirmPassword?.trim() !== newPassword?.trim()) {
        check = true;
        setValidateNewPassword({ error: true, message: ' Mật khẩu không khớp nhau!' });
        setValidateConfirmPassword({ error: true, message: ' Mật khẩu không khớp nhau!' });
      }
    }
    if (!check) {
      Modal.confirm({
        title: `Thông báo`,
        content: 'Bạn chắc chắn muốn lưu thay đổi?',
        okText: 'Có',
        cancelText: 'Không',
        centered: true,
        icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
        onOk: async () => {
          handleSave();
        }
      });
    }
  };

  const handleCancel = (e) => {
    setCurrentPassword('');
    setValidateCurrentPassword(initialValidate);

    setValidateNewPassword(initialValidate);
    setNewPassword('');

    setConfirmPassword('');
    setValidateConfirmPassword(initialValidate);

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
    switch (name) {
      case 'currentPassword':
        if (validateCurrentPassword?.error) {
          setValidateCurrentPassword(initialValidate);
        }
        setCurrentPassword(value);
        break;
      case 'newPassword':
        if (validateNewPassword?.error) {
          setValidateNewPassword(initialValidate);
        }
        setNewPassword(value);
        break;
      case 'confirmPassword':
        if (validateConfirmPassword?.error) {
          setValidateConfirmPassword(initialValidate);
        }
        setConfirmPassword(value);
        break;

      default:
        break;
    }
  };

  const onClickCancel = () => {
    let check = false;
    if (currentPassword?.trim() !== '' || newPassword?.trim() !== '' || confirmPassword?.trim() !== '') {
      check = true;
    }
    if (check) {
      Modal.confirm({
        title: `Thông báo`,
        content: 'Bạn chắc chắn muốn đóng?',
        okText: 'Yes',
        cancelText: 'No',
        centered: true,
        onOk: () => {
          handleCancel();
        }
      });
    } else {
      handleCancel();
    }
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
            Đổi mật khẩu
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
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn loading={loading} />
          </>
        )}
      >
        <Row gutter={16}>
          <Col span={24}>
            <p className="custom-label-input">
              Mật khẩu hiện tại(<span className="color-red">*</span>)
            </p>
            <Input
              name="currentPassword"
              value={currentPassword}
              onChange={onChangeInput}
              status={validateCurrentPassword.error ? 'error' : ''}
              placeholder="Nhập mật khẩu hiện tại..."
            />
            {validateCurrentPassword.error && <p className="message-err">(*){validateCurrentPassword.message}</p>}
          </Col>
          <Col span={24}>
            <p className="custom-label-input">
              Mật khẩu mới(<span className="color-red">*</span>)
            </p>
            <Input
              name="newPassword"
              value={newPassword}
              onChange={onChangeInput}
              status={validateNewPassword.error ? 'error' : ''}
              placeholder="Nhập mật khẩu mới..."
            />
            {validateNewPassword.error && <p className="message-err">(*){validateNewPassword.message}</p>}
          </Col>
          <Col span={24}>
            <p className="custom-label-input">
              Nhập lại mật khẩu(<span className="color-red">*</span>)
            </p>
            <Input
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChangeInput}
              status={validateConfirmPassword.error ? 'error' : ''}
              placeholder="Xác nhận mật khẩu mới..."
            />
            {validateConfirmPassword.error && <p className="message-err">(*){validateConfirmPassword.message}</p>}
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalChangePassword;
