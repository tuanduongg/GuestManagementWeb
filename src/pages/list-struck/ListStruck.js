/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Space, Typography, Col, Row, Table, App, Tag, Popover, Button } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';
import './list-struct.css';
import { compareDateTime, formatDateFromDB, generateRandomVNLicensePlate, statusName } from 'utils/helper';
import ModalInfoStruck from 'components/modal/modal-info-struck/ModalInfoStruck';
const { Title } = Typography;

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    stt: i,
    key: i,
    vendor: 'vendor ' + i,
    status: Object.values(statusName)[Math.floor(Math.random() * 3)],
    carNumber: generateRandomVNLicensePlate(),
    timeOutExpected: '2024-02-22T01:27:47.974Z',
    timeInExpected: '2024-02-22T04:27:47.974Z',
    reason: 'reason ' + i
  });
}

const getColorChipStatus = (status, timeInExpected) => {
  // console.log('compareDateTime(timeInExpected)', compareDateTime(timeInExpected));
  let color = '';
  let message = '';
  switch (status) {
    case statusName.NOT_IN:
      color = 'geekblue';
      message = 'Chưa vào';
      break;
    case statusName.COME_IN:
      color = 'green';
      message = 'Đã vào';
      break;
    case statusName.COME_OUT:
      color = 'volcano';
      message = 'Đã ra';
      break;

    default:
      break;
  }
  if (status === statusName.NOT_IN) {
    let rs = compareDateTime(timeInExpected);
    if (rs) {
      return (
        <>
          <Popover
            placement="left"
            title={`Thời gian dự kiến sẽ đến: ${rs} nữa`}
            trigger={['click', 'hover']} // Trigger on both click and hover
          >
            <Tag color={color} key={status}>
              <FieldTimeOutlined style={{ marginRight: '5px' }} />
              {rs}
            </Tag>
          </Popover>
        </>
      );
    }
  }
  return (
    <Tag color={color} key={status}>
      {message}
    </Tag>
  );
};
//2023-12-21 17:34:04.443

const ListStruck = () => {
  const [tableData, setTableData] = useState(data ?? []);
  const { notification } = App.useApp();
  const [openModal, setOpenModal] = useState(false);

  const columns = [
    {
      title: 'STT',
      width: 70,
      key: 'stt',
      dataIndex: 'stt',
      sorter: (a, b) => a.stt - b.stt,
      align: 'center'
    },
    {
      align: 'left',
      key: 'vendor',
      title: 'Vendor',
      dataIndex: 'vendor',
      width: 130,
      fixed: 'left',
      render: (_, { vendor }) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            {vendor}
          </Button>
        </>
      )
    },
    {
      key: 'carNumber',
      title: 'Biển số',
      dataIndex: 'carNumber',
      sorter: (a, b) => a.carNumber - b.carNumber,
      align: 'center',
      width: 130,
      fixed: 'left'
    },
    {
      key: 'timeInExpected',
      title: 'Giờ vào\n(dự kiến)',
      dataIndex: 'timeInExpected',
      align: 'center',
      render: (_, { timeInExpected }) => <>{formatDateFromDB(timeInExpected)}</>,
      width: 130
    },
    {
      key: 'timeOutExpected',
      title: ['Giờ ra', '(dự kiến)'],
      dataIndex: 'timeOutExpected',
      align: 'center',
      render: (_, { timeOutExpected }) => <>{formatDateFromDB(timeOutExpected)}</>,
      width: 130
    },
    {
      key: 'reason',
      title: 'Mục đích',
      dataIndex: 'reason',
      width: 130
    },
    {
      key: 'status',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, { status, timeInExpected }) => <>{getColorChipStatus(status, timeInExpected)}</>,
      width: 130
    }
  ];

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...tableData];
      setTableData(newData);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  //   const { modal } = App.useApp();
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={5}>Danh sách xe đăng ký</Title>
        </Col>
      </Row>
      <Table
        className="table-custom"
        bordered
        scroll={{
          x: 'max-content',
          y: '60vh'
        }}
        columns={columns}
        dataSource={tableData}
        onChange={onChange}
        pagination={false}
      />
      <ModalInfoStruck open={openModal} handleClose={handleCloseModal} />
    </>
  );
};

export default () => (
  <App>
    <ListStruck />
  </App>
);
