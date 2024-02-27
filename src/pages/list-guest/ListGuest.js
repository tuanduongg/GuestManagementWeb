import React, { useState } from 'react';
import { Table, Row, Col, Typography, App, Empty, Button, Flex, DatePicker } from 'antd';
import { formatDateFromDB, generateRandomVNLicensePlate, getColorChipStatus, listNameStatus, statusName } from 'utils/helper';
const { Title } = Typography;
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './list-guest.css';
import dayjs from 'dayjs';
import ModalInfoGuest from 'components/modal/modal-info-guest/ModalInfoGuest';
import ModalAddGuest from 'components/modal/modal-add-guest/ModalAddGuest';
const today = dayjs(); // Get the current date using dayjs

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    stt: i,
    key: i,
    nameGuest: 'guest ' + i,
    vendor: 'Công ty  ' + i,
    status: Object.values(statusName)[Math.floor(Math.random() * 2)],
    carNumber: generateRandomVNLicensePlate(),
    timeOutExpected: '2024-02-22T01:27:47.974Z',
    timeInExpected: '2024-02-22T04:27:47.974Z',
    guardian: 'guardian ' + i
  });
}

const ListGuest = () => {
  const [tableData, setTableData] = useState(data ?? []);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [dataSelect, setDataSelect] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [defaultDatePicker, setDefaultDatePicker] = useState(today);
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
  };

  const columns = [
    {
      align: 'left',
      key: 'nameGuest',
      title: 'Tên khách',
      dataIndex: 'nameGuest',
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
            {data?.nameGuest}
          </Button>
        </>
      ),
      filters: tableData
        ? tableData.map((item) => {
            return {
              text: item?.nameGuest,
              value: item?.nameGuest
            };
          })
        : [],
      // {
      //   text: 'Category 2',
      //   value: 'Category 2'
      // }
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.nameGuest === value
    },
    {
      align: 'left',
      key: 'vendor',
      title: 'Công ty',
      dataIndex: 'vendor',
      width: 130,
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
      onFilter: (value, record) => record?.vendor === value
    },
    {
      key: 'carNumber',
      title: 'Biển số',
      dataIndex: 'carNumber',
      align: 'center',
      width: 130,
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
      onFilter: (value, record) => record?.carNumber === value
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
      key: 'Guardian',
      title: 'Người bảo lãnh',
      dataIndex: 'guardian',
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
  const onChangeDate = () => {};
  const handleClickAdd = () => {
    setOpenModalAdd(true);
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={5}>Đăng ký khách vào công ty</Title>
        </Col>
      </Row>
      <Row style={{ margin: '5px 0px 10px 0px' }}>
        <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="space-between">
          <DatePicker allowClear={false} format="DD-MM-YYYY" defaultValue={defaultDatePicker} onChange={onChangeDate} />
          <div>
            <Button onClick={handleClickAdd} style={{ marginRight: '5px' }} icon={<PlusOutlined />} type="primary">
              Đăng ký
            </Button>
            <Button disabled={selectedRowKeys?.length === 0} danger icon={<DeleteOutlined />} type="primary">
              Xoá
            </Button>
          </div>
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
          y: '70vh'
        }}
        columns={columns}
        dataSource={tableData}
        pagination={false}
      >
        {tableData?.length === 0 && <Empty />}
      </Table>
      <ModalInfoGuest dataSelect={dataSelect} open={openModal} handleClose={handleCloseModal} />
      <ModalAddGuest open={openModalAdd} handleClose={handleCloseModalAdd} />
    </>
  );
};

export default () => (
  <App>
    <ListGuest />
  </App>
);
