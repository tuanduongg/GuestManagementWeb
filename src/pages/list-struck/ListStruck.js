/* eslint-disable no-unused-vars */
import React from 'react';
import { Space, Typography, Col, Row, Table, App, Tag } from 'antd';
import './list-struct.css';
import { compareDateTime, formatDateFromDB, generateRandomVNLicensePlate, statusName } from 'utils/helper';
const { Title } = Typography;

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    stt: i,
    key: i,
    vendor: 'vendor ' + i,
    status: Object.values(statusName)[Math.floor(Math.random() * 3)],
    carNumber: generateRandomVNLicensePlate(),
    timeInExpected: '2024-02-21T18:00:00.811Z',
    timeOutExpected: '2024-02-21T18:00:00.811Z',
    reason: 'reason ' + i
  });
}

const getColorChipStatus = (status, timeInExpected) => {
  console.log('timeInExpected', timeInExpected);
  // console.log('compareDateTime(timeInExpected)', compareDateTime(timeInExpected));
  let color = '';
  switch (status) {
    case statusName.NOT_IN:
      color = 'geekblue';
      break;
    case statusName.COME_IN:
      color = 'green';
      break;
    case statusName.COME_OUT:
      color = 'volcano';
      break;

    default:
      break;
  }
  if (status === statusName.NOT_IN) {
    return setInterval(() => {
      compareDateTime(timeInExpected);
    }, 1000);
  } else {
    return (
      <Tag color={color} key={status}>
        {status}
      </Tag>
    );
  }
};
//2023-12-21 17:34:04.443

const ListStruck = () => {
  const columns = [
    {
      title: 'STT',
      key: 'stt',
      dataIndex: 'stt',
      width: 70,
      fixed: 'left',
      sorter: (a, b) => a.stt - b.stt,
      align: 'center'
    },
    {
      key: 'vendor',
      title: 'Vendor',
      dataIndex: 'vendor'
    },

    {
      key: 'carNumber',
      title: 'Biển số',
      dataIndex: 'carNumber',
      sorter: (a, b) => a.carNumber - b.carNumber,
      align: 'center'
    },
    {
      key: 'timeInExpected',
      title: 'Giờ vào\n(dự kiến)',
      dataIndex: 'timeInExpected',
      align: 'center',
      render: (_, { timeInExpected }) => <>{formatDateFromDB(timeInExpected)}</>
    },
    {
      key: 'timeOutExpected',
      title: ['Giờ ra', '(dự kiến)'],
      dataIndex: 'timeOutExpected',
      align: 'center',
      render: (_, { timeOutExpected }) => <>{formatDateFromDB(timeOutExpected)}</>
    },
    {
      key: 'reason',
      title: 'Mục đích',
      dataIndex: 'reason'
    },
    {
      key: 'status',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, { status, timeInExpected }) => <>{getColorChipStatus(status, timeInExpected)}</>
    }
  ];
  //   const { modal } = App.useApp();
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    // modal.warning({
    //   title: 'This is a warning message',
    //   content: '' + pagination + filters + sorter + extra
    // });
  };
  return (
    <Space direction="vertical">
      <Row>
        <Col span={24}>
          <Title level={5}>Danh sách xe đăng ký</Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            // className="border-table"
            bordered
            scroll={{
              x: 100,
              y: '60vh'
            }}
            columns={columns}
            dataSource={data}
            onChange={onChange}
            pagination={false}
          />
        </Col>
      </Row>
    </Space>
  );
};

export default () => (
  <App>
    <ListStruck />
  </App>
);
