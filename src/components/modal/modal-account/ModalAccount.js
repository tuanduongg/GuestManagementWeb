import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
const { TextArea } = Input;

// assets
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC } from 'utils/helper';
import './modal-account.css';
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
const ModalAccount = ({ open, handleClose, typeModal, dataSelect, listRole, afterSave, setSelectedRowKeys }) => {
  const { modal } = App.useApp();
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

  const [status, setStatus] = useState(true);
  const [validateStatus, setValidateStatus] = useState(initialValidate);

  const [roleSelect, setRoleSelect] = useState(listRole ? listRole[0]?.ROLE_ID : '');
  const [loading, setLoading] = useState(false);

  const draggleRef = useRef(null);
  const handleOk = (e) => {
    let check = false;
    if (username?.trim() === '') {
      check = true;
      setValidateUsername({ error: true, message: 'errorEmptyUsername' });
    }
    if (username?.includes(' ')) {
      check = true;
      setValidateUsername({ error: true, message: 'error_contain_space' });
    }
    if (typeModal !== 'EDIT') {
      // modal add
      if (password?.trim() === '') {
        check = true;
        setValidatePassword({ error: true, message: 'errorEmptyPassword' });
      }
      if (password.includes(' ')) {
        check = true;
        setValidatePassword({ error: true, message: 'error_contain_space' });
      }
      if (password.length < 4) {
        check = true;
        setValidatePassword({ error: true, message: 'pwMinCharacter' });
      }
    } else {
      if (password?.trim() !== '') {
        if (password.includes(' ')) {
          check = true;
          setValidatePassword({ error: true, message: 'error_contain_space' });
        }
        if (password.length < 4) {
          check = true;
          setValidatePassword({ error: true, message: 'pwMinCharacter' });
        }
      }
    }
    const handleSave = async () => {
      setLoading(true);
      let url = RouterAPI.addUser;
      if (typeModal === 'EDIT') {
        url = RouterAPI.editUser;
      }
      const res = await restApi.post(url, {
        USER_ID: dataSelect?.USER_ID ? dataSelect?.USER_ID : '',
        USERNAME: username,
        PASSWORD: password,
        role: roleSelect,
        ACTIVE: status
      });
      setLoading(false);
      if (res?.status === 200) {
        handleCancel();
      }
      afterSave(res);
    };
    if (!check) {
      Modal.confirm({
        title: t('msg_notification'),
        content: t('msg_confirm_save'),
        okText: t('yes'),
        cancelText: t('close'),
        centered: true,
        icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
        onOk: async () => {
          handleSave();
        }
      });
    }
  };

  useEffect(() => {
    if (open) {
      setUsername(dataSelect?.USERNAME);
      setRoleSelect(dataSelect?.role?.ROLE_ID);
      setStatus(dataSelect?.ACTIVE ? true : false);
    }
  }, [dataSelect]);
  const handleCancel = (e) => {
    setUsername('');
    setPassword('');
    setRoleSelect(initRole(listRole));
    setStatus(STATUS_ACC.ACTIVE);
    setValidateUsername(initialValidate);
    setValidatePassword(initialValidate);
    setValidateStatus(initialValidate);
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
      case 'password':
        if (validatePassword?.error) {
          setValidatePassword(initialValidate);
        }
        setPassword(value);
        break;
      case 'username':
        if (validateUsername?.error) {
          setValidateUsername(initialValidate);
        }
        setUsername(value);
        break;

      default:
        break;
    }
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
      Modal.confirm({
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

  return (
    <>
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
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            {typeModal === 'EDIT' ? t('tittle_edit') : typeModal === 'VIEW' ? 'Account infomation' : t('title_modal_add_new_account')}
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
            {typeModal !== 'VIEW' && (
              <>
                <CancelBtn />
                <OkBtn loading={loading} />
              </>
            )}
          </>
        )}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24}>
            <p className="custom-label-input">
              {t('username')}(<span className="color-red">*</span>)
            </p>
            <Input
              disabled={typeModal === 'VIEW' || typeModal === 'EDIT'}
              value={username}
              name={'username'}
              status={validateUsername.error ? 'error' : ''}
              onChange={onChangeInput}
              placeholder={t('username') + '...'}
            />
            {validateUsername.error && <p className="message-err">(*){t(validateUsername.message)}</p>}
          </Col>
          <Col span={12}>
            <p className="custom-label-input">
              {t('role')}(<span className="color-red">*</span>)
            </p>
            <Select
              disabled={typeModal === 'VIEW'}
              value={roleSelect}
              style={{
                width: '100%'
              }}
              onChange={(value) => {
                setRoleSelect(value);
              }}
              options={optionSelect}
            />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">
              {t('status_col')}(<span className="color-red">*</span>)
            </p>
            <Select
              disabled={typeModal === 'VIEW'}
              value={status}
              style={{
                width: '100%'
              }}
              onChange={(value) => {
                setStatus(value);
              }}
              options={optionStatus}
            />
          </Col>
          {typeModal !== 'VIEW' && (
            <Col span={24}>
              {typeModal === 'EDIT' ? (
                <p className="custom-label-input">{t('header_changePW')}</p>
              ) : (
                <p className="custom-label-input">
                  {t('password')}(<span className="color-red">*</span>)
                </p>
              )}
              <Input
                name="password"
                value={password}
                onChange={onChangeInput}
                status={validatePassword.error ? 'error' : ''}
                placeholder={t('password') + '...'}
              />
              {validatePassword.error && <p className="message-err">(*){t(validatePassword.message)}</p>}
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};
export default ModalAccount;
