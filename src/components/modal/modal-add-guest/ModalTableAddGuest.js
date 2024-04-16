import React, { useState } from 'react';
import { Table, Input, DatePicker, TimePicker, Button, Space, message, Modal } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Chỉnh sửa ngôn ngữ nếu cần
import './modal_tabel_add_guest.css';
const { TextArea } = Input;
const { confirm } = Modal;
import { DeleteOutlined } from '@ant-design/icons';
import { isMobile } from 'utils/helper';
import config from 'config'

dayjs.locale('en'); // Thiết lập ngôn ngữ mặc định
const initData = {
  key: 0,
  name: '',
  entryTime: '00:00',
  exitTime: '00:00',
  date: '2024-04-18',
  company: '',
  reason: '',
  guestName: '',
  guarantor: '',
  department: ''
};
const ModalTableAddGuest = ({ onClose, open }) => {
  const [data, setData] = useState([initData]);
  const [saveClicked, setSaveClicked] = useState(false);

  const handleInputChange = (e, key, dataIndex) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index][dataIndex] = e.target.value;
      setData(newData);
    }
  };

  const handleTimeChange = (time, key, dataIndex) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index][dataIndex] = time.format('HH:mm');
      setData(newData);
    }
  };

  const handleDateChange = (date, key) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index].date = date.format(config.dateFormat);
      setData(newData);
    }
  };

  const handleAddRow = () => {
    const newData = [...data];
    const nextKey = newData.length > 0 ? newData[newData.length - 1].key + 1 : 0;
    newData.push({
      key: nextKey,
      name: '',
      entryTime: '00:00',
      exitTime: '00:00',
      date: dayjs().format('YYYY-MM-DD'),
      company: '',
      reason: '',
      guestName: '',
      guarantor: '',
      department: '',
      error: false
    });
    setData(newData);
  };

  const handleDeleteRow = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
    message.success('Row deleted successfully.');
  };

  const showDeleteConfirm = (key) => {
    confirm({
      title: 'Are you sure delete this row?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteRow(key);
      }
    });
  };

  const handleSave = () => {
    // Check for required fields
    const newData = data.map((item) => ({
      ...item,
      error: item.name === '' || item?.company === '' || item?.department === '' || item?.guestName === '' || item?.reason === ''
    }));
    console.log('new Dataa', newData);
    setSaveClicked(true);

    const hasEmptyFields = newData.some(
      (item) =>
        item.name === '' ||
        item.date === '' ||
        item.company === '' ||
        item.reason === '' ||
        item.guestName === '' ||
        item.guarantor === '' ||
        item.department === ''
    );

    if (hasEmptyFields) {
      message.error('Please fill in all required fields.');
      setData(newData);
      return;
    }

    // Save data here
    message.success('Data saved successfully.');
  };
  const columns = [
    {
      align: 'center',
      title: '#',
      dataIndex: '',
      render: (text, record, index) => index + 1,
      width: isMobile() ? 150 : '2%'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text, record) => (
        <DatePicker
        allowClear={false}
          className={text === '' && record.error ? 'error-input' : ''}
          defaultValue={dayjs(text, 'YYYY-MM-DD')}
          format={config.dateFormat}
          onChange={(date) => handleDateChange(date, record.key)}
        />
      ),
      width: isMobile() ? 150 : '13%'
    },
    {
      title: 'Guest Name',
      dataIndex: 'guestName',
      render: (text, record) => (
        <Input
          className={record.guestName === '' && record.error ? 'error-input' : ''}
          value={text}
          onChange={(e) => handleInputChange(e, record.key, 'guestName')}
        />
      ),
      width: isMobile() ? 150 : '14%'
    },
    {
      title: 'Time in',
      dataIndex: 'entryTime',
      render: (text, record) => (
        <TimePicker
          className={text === '' && record.error ? 'error-input' : ''}
          defaultValue={dayjs(text, 'HH:mm')}
          format="HH:mm"
          onChange={(time) => handleTimeChange(time, record.key, 'entryTime')}
        />
      ),
      width: isMobile() ? 150 : '11%'
    },
    {
      title: 'Time out',
      dataIndex: 'exitTime',
      render: (text, record) => (
        <TimePicker
          className={text === '' && record.error ? 'error-input' : ''}
          defaultValue={dayjs(text, 'HH:mm')}
          format="HH:mm"
          onChange={(time) => handleTimeChange(time, record.key, 'exitTime')}
        />
      ),
      width: isMobile() ? 150 : '11%'
    },

    {
      title: 'Company',
      dataIndex: 'company',
      render: (text, record) => (
        <Input
          className={record.company === '' && record.error ? 'error-input' : ''}
          value={text}
          onChange={(e) => handleInputChange(e, record.key, 'company')}
        />
      ),
      width: isMobile() ? 150 : '11%'
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      render: (text, record) => (
        <Input
          className={record.reason === '' && record.error ? 'error-input' : ''}
          value={text}
          onChange={(e) => handleInputChange(e, record.key, 'reason')}
        />
      ),
      width: isMobile() ? 150 : '11%'
    },

    {
      title: 'Guarantor',
      dataIndex: 'guarantor',
      render: (text, record) => (
        <Input
          className={record.guarantor === '' && record.error ? 'error-input' : ''}
          value={text}
          onChange={(e) => handleInputChange(e, record.key, 'guarantor')}
        />
      ),
      width: isMobile() ? 150 : '11%'
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (text, record) => (
        <Input
          className={record.department === '' && record.error ? 'error-input' : ''}
          value={text}
          onChange={(e) => handleInputChange(e, record.key, 'department')}
        />
      ),
      width: isMobile() ? 150 : '11%'
    },
    {
      align: 'center',
      title: 'Action',
      render: (_, record) => (
        <Space>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record.key)}></Button>
        </Space>
      ),
      width: isMobile() ? 150 : '6%'
    }
  ];
  const handleCancel = () => {
    onClose();
  };
  return (
    <div>
      <Modal maskClosable={false} centered zIndex={1300} width={1200} title="Basic Modal" open={open} onOk={() => {}} onCancel={handleCancel}>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={handleAddRow}>Add</Button>
          <Button onClick={handleSave}>Save</Button>
        </Space>
        <Table columns={columns} dataSource={data} pagination={false} bordered size="middle" scroll={{ y: 400 }} />
      </Modal>
    </div>
  );
};

export default ModalTableAddGuest;
