import React, { useState } from 'react';
import { Table, Row, Col, Typography, App, Empty, Button, Flex } from 'antd';
import { formatDateFromDB, generateRandomVNLicensePlate, getColorChipStatus, listNameStatus, statusName } from 'utils/helper';
const { Title } = Typography;
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ModalInfoStruck from 'components/modal/modal-info-struck/ModalInfoStruck';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    stt: i,
    key: i,
    vendor: 'vendor ' + i,
    status: Object.values(statusName)[Math.floor(Math.random() * 3)],
    carNumber: generateRandomVNLicensePlate(),
    timeOutExpected: '2024-02-29T03:02:32.701Z',
    timeInExpected: '2024-02-29T17:00:00.000Z',
    reason: 'reason ' + i
  });
}



const CarRegister = () => {
  const [tableData, setTableData] = useState(data ?? []);
  const [openModal, setOpenModal] = useState(false);
  const [dataSelect, setDataSelect] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    {
      align: 'left',
      key: 'vendor',
      title: 'Vendor',
      dataIndex: 'vendor',
      width: 130,
      fixed: 'left',
      render: (_, data) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setDataSelect(data);
              setOpenModal(true);
            }}
          >
            {data?.vendor}
          </Button>
        </>
      ),
      filters: tableData
        ? tableData.map((item) => {
            return {
              text: item?.vendor,
              value: item?.vendor
            };
          })
        : [],
      // {
      //   text: 'Category 2',
      //   value: 'Category 2'
      // }
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.vendor?.startsWith(value)
    },
    {
      key: 'carNumber',
      title: 'Biển số',
      dataIndex: 'carNumber',
      align: 'center',
      width: 130,
      fixed: 'left',
      filters: tableData
        ? tableData.map((item) => {
            return {
              text: item?.carNumber,
              value: item?.carNumber
            };
          })
        : [],
      // {
      //   text: 'Category 2',
      //   value: 'Category 2'
      // }
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.carNumber?.startsWith(value)
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
      width: 130,
      filters: listNameStatus() ?? [],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.status === value
    }
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={5}>Đăng ký xe ra/vào công ty</Title>
        </Col>
      </Row>
      <Row style={{ margin: '5px 0px' }}>
        <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="end">
          <Button size={'small'} icon={<PlusOutlined />} type="primary">
            Đăng ký
          </Button>
          <Button disabled={selectedRowKeys?.length === 0} size={'small'} danger icon={<DeleteOutlined />} type="primary">
            Xoá
          </Button>
        </Flex>
      </Row>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        bordered
        scroll={{
          x: 'max-content',
          y: '50vh'
        }}
        columns={columns}
        dataSource={tableData}
        pagination={{
          total: tableData?.length,
          onChange: (page, pageSize) => {
            console.log(page + '-' + pageSize);
          }
        }}
      >
        {tableData?.length === 0 && <Empty />}
      </Table>
      <ModalInfoStruck dataSelect={dataSelect} open={openModal} handleClose={handleCloseModal} />
    </>
  );
};

export default () => (
  <App>
    <CarRegister />
  </App>
);
