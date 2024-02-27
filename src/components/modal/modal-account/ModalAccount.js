import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
const { TextArea } = Input;

// assets
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ROLE_ACC } from 'utils/helper';

const ModalAccount = ({ open, handleClose }) => {
  const { modal } = App.useApp();
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const [names, setNames] = useState([]);
  const [errorEditTag, setErrorEditTag] = useState(false);

  const [date, setDate] = useState('');
  const [errorDate, setErrorDate] = useState(false);

  const [company, setCompany] = useState('');
  const [errorCompany, setErrorCompany] = useState(false);

  const [carNumber, setCarNumber] = useState('');

  const [personSeowon, setPersonSeowon] = useState('');
  const [errorPersonSeowon, setErrorPersonSeowon] = useState(false);

  const [reason, setReason] = useState('');
  const [errReason, setErrReason] = useState(false);

  const [department, setDepartment] = useState('');
  const [errorDepartment, setErrorDepartment] = useState(false);

  const [inputVisible, setInputVisible] = useState(false);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  const draggleRef = useRef(null);
  const handleOk = (e) => {
    let check = false;
    if (names?.length === 0) {
      check = true;
      setErrorEditTag(true);
    }
    if (date?.length === 0) {
      check = true;
      setErrorDate(true);
    }
    if (!timeIn) {
      check = true;
      setErrorTimeIn(true);
    }
    if (!timeOut) {
      check = true;
      setErrorTimeOut(true);
    }
    if (company?.trim() === '') {
      check = true;
      setErrorCompany(true);
    }
    if (personSeowon?.trim() === '') {
      check = true;
      setErrorPersonSeowon(true);
    }
    if (department?.trim() === '') {
      check = true;
      setErrorDepartment(true);
    }
    if (reason?.trim() === '') {
      check = true;
      setErrReason(true);
    }
    if (!check) {
      Modal.confirm({
        title: `Thông báo`,
        content: 'Bạn chắc chắn muốn lưu thông tin?',
        okText: 'Yes',
        cancelText: 'No',
        centered: true,
        icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
        onOk: () => {
          alert('pass');
        }
      });
    }
  };
  const handleCancel = (e) => {
    setErrorEditTag(false);
    setErrorEditTag(false);
    setErrorDate(false);
    setErrorTimeIn(false);
    setErrorTimeOut(false);
    setErrorCompany(false);
    setErrorPersonSeowon(false);
    setErrorDepartment(false);
    setErrReason(false);

    setNames([]);
    setTimeIn(defaultValueTime);
    setTimeOut(defaultValueTime);
    setDate(defaultValueDate);
    setCompany('');
    setCarNumber('');
    setPersonSeowon('');
    setReason('');
    setDepartment('');

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

  const onChangeDatePicker = (date, dateString) => {
    if (errorDate) {
      setErrorDate(false);
    }
    setDate(date);
  };
  function disabledDate(current) {
    // Get today's date
    const today = dayjs().startOf('day');
    // Disable past days
    return current && current < today;
  }
  const onChangeInput = (e) => {
    const { value, name } = e.target;
    switch (name) {
      case 'company':
        if (errorCompany) {
          setErrorCompany(false);
        }
        setCompany(value);
        break;
      case 'personInSeowon':
        if (errorPersonSeowon) {
          setErrorPersonSeowon(false);
        }
        setPersonSeowon(value);
        break;
      case 'department':
        if (errorDepartment) {
          setErrorDepartment(false);
        }
        setDepartment(value);
        break;
      case 'reason':
        if (errReason) {
          setErrReason(false);
        }
        setReason(value);
        break;
      case 'carNumber':
        setCarNumber(value);
        break;

      default:
        break;
    }
  };

  const onClickCancel = () => {
    let check = false;
    if (names?.length !== 0) {
      check = true;
    }
    if (company?.trim() !== '') {
      check = true;
    }
    if (personSeowon?.trim() !== '') {
      check = true;
    }
    if (department?.trim() !== '') {
      check = true;
    }
    if (reason?.trim() !== '') {
      check = true;
    }
    if (check) {
      Modal.confirm({
        title: `Thông báo`,
        content: 'Dữ liệu chưa được lưu, bạn chắc chắn muốn đóng?',
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
            Thông tin tài khoản
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
        <Row gutter={16}>
          <Col xs={24} sm={24}>
            <p className="custom-label-input">
              Tên tài khoản(<span className="color-red">*</span>)
            </p>
            <Input
              //   status={errorCompany ? 'error' : ''}
              //   value={company}
              name={'company'}
              onChange={onChangeInput}
              placeholder="Nhập tên tài khoản..."
            />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">
              Quyền(<span className="color-red">*</span>)
            </p>
            <Select
              defaultValue="lucy"
              style={{
                width: '100%'
              }}
              onChange={() => {}}
              options={Object.values(ROLE_ACC)?.map((item) => {
                return {
                  value: item,
                  label: item
                };
              })}
            />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">Biển số xe</p>
            <Input name="carNumber" value={carNumber} onChange={onChangeInput} placeholder="Nhập biển số xe..." />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">
              Người bảo lãnh(<span className="color-red">*</span>)
            </p>
            <Input
              name="personInSeowon"
              value={personSeowon}
              onChange={onChangeInput}
              status={errorPersonSeowon ? 'error' : ''}
              placeholder="Nhập tên người bảo lãnh..."
            />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">
              Bộ phận(<span className="color-red">*</span>)
            </p>
            <Input
              name="department"
              value={department}
              onChange={onChangeInput}
              status={errorDepartment ? 'error' : ''}
              placeholder="Nhập bộ phận..."
            />
          </Col>
          <Col span={24}>
            <p className="custom-label-input">
              Lý do(<span className="color-red">*</span>)
            </p>
            <TextArea
              name="reason"
              value={reason}
              onChange={onChangeInput}
              status={errReason ? 'error' : ''}
              placeholder="Nhập lý do..."
              rows={2}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalAccount;
