import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, message, Tooltip, Popconfirm, Button, DatePicker, TimePicker, Space } from 'antd';
import './modal_add_guest.css';
import dayjs from 'dayjs';
const { TextArea } = Input;

// assets
import { PlusOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { formatArrDate, isMobile } from 'utils/helper';
import config from 'config';
import { useTranslation } from 'react-i18next';
const initInputName = {
  value: '',
  error: false,
  message: ''
};
const defaultValueDate = [dayjs()];
const defaultValueTime = dayjs();
const tagInputStyle = {
  width: 130,
  height: 30,
  marginInlineEnd: 8,
  verticalAlign: 'top'
};
const initialValiateName = { FULL_NAME: '', NAME_ID: '', isShow: true };
const ModalAddGuest = ({ open, handleClose, afterSave, dataSelect, typeModal, setLoading }) => {
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(true);
  const [arrInputName, setArrInputName] = useState([initInputName]);
  const [messageApi, contextHolder] = message.useMessage();
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const [names, setNames] = useState(isMobile() ? [initialValiateName] : [initialValiateName, initialValiateName]);
  const [errorName, setErrorName] = useState(false);

  const [errorEditTag, setErrorEditTag] = useState(false);

  const [timeIn, setTimeIn] = useState(defaultValueTime);
  const [errorTimeIn, setErrorTimeIn] = useState(false);

  const [timeOut, setTimeOut] = useState(defaultValueTime);
  const [errorTimeOut, setErrorTimeOut] = useState(false);

  const [date, setDate] = useState(defaultValueDate);
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
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false);
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  //  [
  //     {
  //         "NAME_ID": "1AABA74A-E3D6-EE11-A1CF-04D9F5C9D2EB",
  //         "FULL_NAME": "KO DEOK JUN ABC"
  //     }
  // ]
  useEffect(() => {
    if (dataSelect && open && typeModal === 'EDIT') {
      setNames(
        dataSelect?.guest_info.map((item) => {
          return {
            NAME_ID: item?.NAME_ID,
            FULL_NAME: item?.FULL_NAME,
            isShow: true
          };
        })
      );
      setTimeIn(dataSelect?.TIME_IN ? dayjs(dataSelect?.TIME_IN) : '');
      setTimeOut(dataSelect?.TIME_OUT ? dayjs(dataSelect?.TIME_OUT) : '');
      setCompany(dataSelect?.COMPANY);
      setCarNumber(dataSelect?.CAR_NUMBER);
      setPersonSeowon(dataSelect?.PERSON_SEOWON);
      setReason(dataSelect?.REASON);
      setDepartment(dataSelect?.DEPARTMENT);
      setDate(
        dataSelect?.guest_date?.map((item) => {
          return dayjs(item.DATE, config.dateFormat);
        })
      );
    }
  }, [open]);

  const tagPlusStyle = {
    display: 'flex',
    alignItems: 'center',
    height: 30,
    background: '#ddd',
    borderStyle: 'dashed',
    color: errorEditTag ? 'red' : '',
    borderColor: errorEditTag ? 'red' : ''
  };
  const handleSaveGuest = async () => {
    setLoading(true);
    let url = typeModal === 'EDIT' ? RouterAPI.updateGuest : RouterAPI.addGuest;
    const data = {
      id: dataSelect?.GUEST_ID,
      company,
      carNumber,
      personSeowon,
      department,
      reason,
      timeIn,
      timeOut,
      date: formatArrDate(date),
      names
    };
    const rest = await restApi.post(url, data);
    setLoading(false);
    afterSave(rest);
    if (rest?.status === 200) {
      handleCancel();
    }
  };
  const draggleRef = useRef(null);
  const handleOk = (e) => {
    let check = false;
    const fil = names?.filter((name) => name.isShow);
    if (fil?.length === 0) {
      check = true;
      setErrorName(true);
    } else {
      check = true;
      fil.map((item) => {
        if (item?.FULL_NAME?.trim() !== '') {
          check = false;
        }
      });
      if (check) {
        setErrorName(true);
      }
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
        title: t('msg_notification'),
        content: t('msg_confirm_save'),
        okText: t('yes'),
        cancelText: t('close'),
        centered: true,
        icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
        onOk: async () => {
          handleSaveGuest();
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
    setErrorName(false);

    setNames(isMobile() ? [initialValiateName] : [initialValiateName, initialValiateName]);
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

  const handleChangeName = (e, index) => {
    const { value } = e.target;
    const newArr = [...arrInputName];
    newArr[index].value = value;
    const arrTemp = [...newArr];
    setArrInputName(arrTemp);
  };
  const onClickAddInput = (index) => {
    const arrNew = [...arrInputName];
    arrNew.splice(index + 1, 0, initInputName);
    const arrTemp = [...arrNew];
    setArrInputName(arrTemp);
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

  // useEffect(() => {
  //   if (names && names.length === 0) {
  //     setNames([
  //       { FULL_NAME: '', NAME_ID: '' },
  //       { FULL_NAME: '', NAME_ID: '' }
  //     ]);
  //   }
  // }, [names]);

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
  const onChangeInputName = (e, index) => {
    if (errorName) {
      setErrorName(false);
    }
    const { value } = e.target;
    const updatedNames = names.map((item, idx) => {
      if (idx === index) {
        return { ...item, FULL_NAME: value };
      }
      return item;
    });
    setNames(updatedNames);
  };
  const onClearInput = (index) => {
    const updatedNames = names.map((item, idx) => {
      if (idx === index) {
        return { ...item, isShow: false };
      }
      return item;
    });
    setNames(updatedNames);
  };
  return (
    <>
      {contextHolder}
      <Modal
        centered
        width={600}
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
            {typeModal === 'EDIT' ? t('tittle_edit') : t('sidebar_registration_guest')}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={onClickCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        modalRender={(modal) => (
          <Draggable disabled={disabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Row gutter={16}>
          <Col span={24}>
            <p className="custom-label-input">
              {t('nameGuest_col')}(<span className="color-red">*</span>)
            </p>
          </Col>

          {names?.map((item, index) => {
            if (item?.isShow) {
              return (
                <Col key={index} span={isMobile() ? 24 : 12} style={{ marginTop: '5px' }}>
                  <div style={{ display: 'flex' }}>
                    <Input
                      // name="carNumber"
                      status={errorName ? 'error' : ''}
                      value={names[index]?.FULL_NAME}
                      onChange={(e) => {
                        onChangeInputName(e, index);
                      }}
                      placeholder={t('nameGuest_col') + '...'}
                    />
                    <Button
                      disabled={names?.filter((item) => item.isShow === true).length === 1}
                      onClick={() => {
                        onClearInput(index);
                      }}
                      danger
                      icon={<DeleteOutlined />}
                      type="link"
                    ></Button>
                  </div>
                </Col>
              );
            }
            return null;
          })}
          <Col xs={24} style={{ textAlign: 'right' }}>
            <Button
              type="link"
              onClick={() => {
                const data = names.map((item) => {
                  return { ...item };
                });
                data.push(initialValiateName);
                setNames(data);
              }}
            >
              Add
            </Button>
          </Col>
          <Col xs={12} sm={6}>
            <p className="custom-label-input">
              {t('timeIn_col')}(<span className="color-red">*</span>)
            </p>
            <TimePicker
              value={timeIn}
              onChange={(time, timeString) => {
                setTimeIn(time);
              }}
              status={errorTimeIn ? 'error' : ''}
              allowClear={false}
              className="full-width"
              format="HH:mm"
            />
          </Col>
          <Col xs={12} sm={6}>
            <p className="custom-label-input">
              {t('timeOut_col')}(<span className="color-red">*</span>)
            </p>
            <TimePicker
              value={timeOut}
              onChange={(time, timeString) => {
                setTimeOut(time);
              }}
              status={errorTimeOut ? 'error' : ''}
              allowClear={false}
              className="full-width"
              format="HH:mm"
            />
          </Col>
          <Col xs={24} sm={12}>
            <p className="custom-label-input">
              {t('dateArrived')}(<span className="color-red">*</span>)
            </p>
            <DatePicker
              needConfirm
              status={errorDate ? 'error' : ''}
              value={date}
              disabledDate={typeModal !== 'EDIT' ? disabledDate : false}
              allowClear={false}
              format={config.dateFormat}
              multiple
              onChange={onChangeDatePicker}
              maxTagCount="responsive"
            />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">
              {t('company_col')}(<span className="color-red">*</span>)
            </p>
            <Input
              status={errorCompany ? 'error' : ''}
              value={company}
              name={'company'}
              onChange={onChangeInput}
              placeholder={t('company_col') + '...'}
            />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">{t('carNum_col')}</p>
            <Input name="carNumber" value={carNumber} onChange={onChangeInput} placeholder={t('carNum_col') + '...'} />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">
              {t('personSeowon_col')}(<span className="color-red">*</span>)
            </p>
            <Input
              name="personInSeowon"
              value={personSeowon}
              onChange={onChangeInput}
              status={errorPersonSeowon ? 'error' : ''}
              placeholder={t('personSeowon_col') + '...'}
            />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">
              {t('department_col')}(<span className="color-red">*</span>)
            </p>
            <Input
              name="department"
              value={department}
              onChange={onChangeInput}
              status={errorDepartment ? 'error' : ''}
              placeholder={t('department_col')}
            />
          </Col>
          <Col span={24}>
            <p className="custom-label-input">
              {t('reason_col')}(<span className="color-red">*</span>)
            </p>
            <TextArea
              name="reason"
              value={reason}
              onChange={onChangeInput}
              status={errReason ? 'error' : ''}
              placeholder={t('reason_col') + '...'}
              rows={2}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalAddGuest;
