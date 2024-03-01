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
import { formatArrDate } from 'utils/helper';
import config from 'config';
import { isMobile } from 'react-device-detect';
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
const initialValiateName = { FULL_NAME: '', NAME_ID: '' };
const ModalAddGuest = ({ open, handleClose, afterSave, dataSelect, typeModal }) => {
  const [disabled, setDisabled] = useState(true);
  const [arrInputName, setArrInputName] = useState([initInputName]);
  const [messageApi, contextHolder] = message.useMessage();
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const [names, setNames] = useState(isMobile ? [initialValiateName] : [initialValiateName, initialValiateName]);
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
            ERROR: false
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
          return dayjs(item.DATE);
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
  const handleClearTag = (index, tagProp) => {
    if (typeModal === 'EDIT') {
      const arrNew = [...names];
      setNames(arrNew);
      Modal.confirm({
        title: 'Thông báo',
        content: 'Bạn chắc chắn muốn xoá?',
        okText: 'Yes',
        cancelText: 'No',
        centered: true,
        onOk: async () => {
          const rest = await restApi.post(RouterAPI.deleteGuestInfo, {
            NAME_ID: tagProp?.NAME_ID
          });
          if (rest?.status !== 200) {
            alert('Delete Fail!');
          } else {
            const newTags = names.filter((tag, i) => index !== i);
            setNames(newTags);
          }
          console.log('rest', rest);
        }
      });
    } else {
      const newTags = names.filter((tag, i) => index !== i);
      setNames(newTags);
    }
  };
  const handleSaveGuest = async () => {
    const data = {
      company,
      carNumber,
      personSeowon,
      department,
      reason,
      timeIn,
      timeOut,
      date: formatArrDate(date),
      names: names.map((item) => {
        if (item?.FULL_NAME?.trim() !== '') {
          return item.FULL_NAME;
        }
      })
    };
    const rest = await restApi.post(RouterAPI.addGuest, data);
    afterSave(rest);
  };
  const draggleRef = useRef(null);
  const handleOk = (e) => {
    let check = false;

    if (names?.length === 0) {
      check = true;
      messageApi.open({
        type: 'error',
        content: 'Vui lòng điền thông tin tên khách!'
      });
    } else {
      check = true;
      names.map((item, index) => {
        if (item?.FULL_NAME?.trim() !== '') {
          check = false;
        }
      });
      if (check) {
        messageApi.open({
          type: 'error',
          content: 'Vui lòng điền thông tin tên khách!'
        });
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
        title: `Thông báo`,
        content: 'Bạn chắc chắn muốn lưu thông tin?',
        okText: 'Yes',
        cancelText: 'No',
        centered: true,
        icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
        onOk: () => {
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

    setNames(isMobile ? [initialValiateName] : [initialValiateName, initialValiateName]);
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
  const onChangeInputName = (e, index) => {
    const { value } = e.target;
    const updatedNames = names.map((item, idx) => {
      if (idx === index) {
        return { ...item, FULL_NAME: value, ERROR: false };
      }
      return item;
    });
    setNames(updatedNames);
  };
  const onClearInput = (index) => {
    const data = [...names];
    data.splice(index, 1);
    setNames(data);
  };

  return (
    <>
      {contextHolder}
      <Modal
        width={600}
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
            {typeModal === 'EDIT' ? 'Chỉnh sửa thông tin' : 'Đăng ký khách vào'}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={onClickCancel}
        // footer={(_, { OkBtn, CancelBtn }) => (
        //   <>
        //     <Popconfirm
        //       open={openPopConfirm}
        //       title="Thông báo"
        //       description="Dữ liệu chưa được lưu, bạn chắc chắn muốn đóng?"
        //       onConfirm={() => {}}
        //       onCancel={() => {}}
        //       okText="Yes"
        //       cancelText="No"
        //     >
        //       <CancelBtn />
        //     </Popconfirm>
        //     <OkBtn />
        //   </>-
        // )}
        modalRender={(modal) => (
          <Draggable disabled={disabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Row gutter={16}>
          <Col span={24}>
            <p className="custom-label-input">
              Tên khách(<span className="color-red">*</span>)
            </p>
          </Col>

          {names?.map((item, index) => (
            <Col key={index} span={isMobile ? 24 : 12} style={{ marginTop: '5px' }}>
              <div style={{ display: 'flex' }}>
                <Input
                  name="carNumber"
                  value={names[index]?.FULL_NAME}
                  onChange={(e) => {
                    onChangeInputName(e, index);
                  }}
                  placeholder="Nhập tên khách..."
                />
                <Popconfirm
                  title="Thông báo"
                  description="Bạn chắc chắn muốn xoá?"
                  onConfirm={() => {
                    onClearInput(index);
                  }}
                  okText="Có"
                  cancelText="Đóng"
                  placement="left"
                >
                  <Button disabled={names?.length === 1} danger icon={<DeleteOutlined />} type="link"></Button>
                </Popconfirm>
              </div>
            </Col>
          ))}
          <Col xs={24} style={{ textAlign: 'right' }}>
            <Button
              type="link"
              onClick={() => {
                const data = names.map((item) => {
                  return { ...item };
                });
                console.log('data', data);
                data.push(initialValiateName);
                setNames(data);
                // setNames([...names, initialValiateName]);
              }}
            >
              Thêm
            </Button>
          </Col>
          <Col xs={12} sm={4}>
            <p className="custom-label-input">
              Giờ đến(<span className="color-red">*</span>)
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
          <Col xs={12} sm={4}>
            <p className="custom-label-input">
              Giờ về(<span className="color-red">*</span>)
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
          <Col xs={24} sm={16}>
            <p className="custom-label-input">
              Ngày vào(<span className="color-red">*</span>)
            </p>
            <DatePicker
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
              Công ty(<span className="color-red">*</span>)
            </p>
            <Input
              status={errorCompany ? 'error' : ''}
              value={company}
              name={'company'}
              onChange={onChangeInput}
              placeholder="Nhập tên công ty..."
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
export default ModalAddGuest;
