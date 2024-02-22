import React from 'react';
import { Table, Row, Col, Typography, App, Space } from 'antd';
const { Title } = Typography;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left', // Fixing this column to the left
    width: 150
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 150
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 200
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 150
  },
  {
    title: 'Company',
    dataIndex: 'company',
    key: 'company',
    width: 200
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right', // Fixing this column to the right
    width: 100,
    render: () => <a>Edit</a>
  }
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `John ${i}`,
    age: 30 + i,
    address: `New York No. ${i}`,
    gender: i % 2 === 0 ? 'Male' : 'Female',
    company: `ABC ${i}`
  });
}

const CarRegister = () => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={5}>Danh sách xe đăng ký</Title>
        </Col>
      </Row>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content', y: '60vh' }} // Enable horizontal scrolling
      />
    </>
  );
};

export default () => (
  <App>
    <CarRegister />
  </App>
);
