import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal, App, Row, Col, DatePicker, Button } from 'antd';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
const { TextArea } = Input;

// assets
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC, isMobile } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import TableUnit from './component/TableUnit';

const DATA = [
  { id: '1', name: 'KG' },
  { id: '2', name: 'Cái' },
  { id: '3', name: 'Chai' },
  { id: '4', name: 'Hộp' },
  { id: '5', name: 'Bì' }
];

const initialValidate = { error: false, message: '' };
const optionStatus = [
  { value: true, label: 'Active' },
  { value: false, label: 'Block' }
];

const ModalUnit = ({ open, handleClose }) => {
  const { modal } = App.useApp();
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState(null);
  const [name, setName] = useState('');
  const [validateName, setValidateName] = useState(initialValidate);
  const [unit, setUnit] = useState(DATA);

  const handleOk = (e) => {};
  const handleCancel = (e) => {
    setName('');
    setValidateName(initialValidate);
    handleClose();
  };

  const onClickCancel = () => {
    let check = false;
    if (name?.trim() !== '') {
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
  const onChangeSelectedRow = (row) => {
    setSelectedRow(row);
    setName(row?.name ?? '');
  };
  const handleClickAdd = () => {
    if (name?.trim() === '') {
      setValidateName({ err: true, msg: 'Tên đơn vị is required.' });
    } else {
      alert('pass');
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
        title={'Đơn vị tính'}
        open={open}
        onOk={handleOk}
        onCancel={onClickCancel}
        footer={null}
      >
        <div>
          <Row>
            <Col xs={24}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                  error={validateName?.err}
                  helperText={validateName?.msg}
                  onChange={(e) => {
                    if (validateName?.err) {
                      setValidateName(initialValidate);
                    }
                    setName(e?.target?.value);
                  }}
                  sx={{ width: isMobile() ? '70%' :'75%' }}
                  placeholder="Nhập tên đơn vị..."
                  size="small"
                  value={name}
                  label="Đơn vị "
                  variant="outlined"
                />
                <Button size="medium" type="primary" onClick={handleClickAdd} autoFocus>
                  {selectedRow ? 'Cập nhật' : `Thêm mới`}
                </Button>
              </div>
            </Col>
            <Col xs={24}>
              <TableUnit listUnit={unit} selectedRow={selectedRow} changeSelectedRow={onChangeSelectedRow} />
            </Col>
          </Row>
        </div>
      </Modal>
      {/* <TableUnit listUnit={unit} selectedRow={selectedRow} changeSelectedRow={onChangeSelectedRow} /> */}
    </>
  );
};
export default ModalUnit;
