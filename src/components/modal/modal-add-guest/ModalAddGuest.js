import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, Row, Col, Flex, Button, DatePicker, TimePicker } from 'antd';
import './modal_add_guest.css';
import dayjs from 'dayjs';
const { TextArea } = Input;
// assets
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
const initInputName = {
  value: '',
  error: false,
  message: ''
};
const defaultValue = [dayjs()];
const defaultValueTime = dayjs();

const ModalAddGuest = ({ open, handleClose }) => {
  const [disabled, setDisabled] = useState(true);
  const [arrInputName, setArrInputName] = useState([initInputName]);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const draggleRef = useRef(null);
  const handleOk = (e) => {
    alert('okeee');
  };
  const handleCancel = (e) => {
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
  const onChangeDatePicker = () => {};

  return (
    <>
      <Modal
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
            Đăng ký khách vào
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable disabled={disabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Row gutter={16}>
          <Col span={24}>
            <p className="custom-label-input">Ngày vào</p>
            <DatePicker
              allowClear={false}
              format="DD-MM-YYYY"
              multiple
              onChange={onChangeDatePicker}
              maxTagCount="responsive"
              defaultValue={defaultValue}
            />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">Giờ vào</p>
            <TimePicker format = 'HH:mm' defaultValue={defaultValueTime} size="small" />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">Giờ ra</p>
            <TimePicker format = 'HH:mm' defaultValue={defaultValueTime} size="small" />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">Tên công ty</p>
            <Input placeholder="Nhập tên công ty..." />
          </Col>
          <Col span={12}>
            <p className="custom-label-input">Biển số xe</p>
            <Input placeholder="Nhập biển số xe..." />
          </Col>
          <Col span={24}>
            <p className="custom-label-input">Tên khách</p>
            {arrInputName?.map((item, index) => (
              <Flex style={{ marginTop: '4px' }} key={index}>
                <Input
                  name={`name-${index}`}
                  value={arrInputName[index].value}
                  style={{ width: '100%', marginRight: '7px' }}
                  addonAfter={<PlusOutlined onClick={() => onClickAddInput(index)} />}
                  placeholder="Nhập tên khách..."
                  onChange={(e) => {
                    handleChangeName(e, index);
                  }}
                />
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    alert('clear');
                  }}
                />
              </Flex>
            ))}
          </Col>
          <Col span={24}>
            <p className="custom-label-input">Lý do</p>
            <TextArea placeholder="Nhập lý do..." rows={4} />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalAddGuest;
