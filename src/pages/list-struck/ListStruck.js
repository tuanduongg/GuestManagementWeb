/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { DatePicker, Typography, Col, Row, Table, App, Button, Empty, Input } from 'antd';
const { Search } = Input;
import './list-struct.css';
import {
  formatDateFromDB,
  generateRandomVNLicensePlate,
  getColorChipStatus,
  getNameStatus,
  listNameStatus,
  statusName
} from 'utils/helper';
import ModalInfoStruck from 'components/modal/modal-info-struck/ModalInfoStruck';
const { Title } = Typography;
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import vi from 'dayjs/locale/vi'; // Import Vietnamese locale

dayjs.locale(vi);

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

//2023-12-21 17:34:04.443

const ListStruck = () => {
  const [tableData, setTableData] = useState(data ?? []);
  const { notification } = App.useApp();
  const [openModal, setOpenModal] = useState(false);
  const [dataSelect, setDataSelect] = useState({});

  const today = dayjs(); // Get the current date using dayjs

  const [defaultDates, setDefaultDates] = useState([today, today]);

  const columns = [
    {
      title: 'STT',
      width: 70,
      key: 'stt',
      dataIndex: 'stt',
      align: 'center'
    },
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
      onFilter: (value, record) => record?.vendor === value
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
    // console.log('params', pagination, filters, sorter, extra);
  };
  const onChangeDateRange = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={5}>Danh sách xe đăng ký</Title>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: 'right', marginBottom: '5px' }} span={24}>
          <RangePicker allowClear={false} defaultValue={defaultDates} format="DD/MM/YYYY" onChange={onChangeDateRange} />
        </Col>
      </Row>
      <Table
        className="table-custom"
        bordered
        scroll={{
          x: 'max-content',
          y: '58vh'
        }}
        columns={columns}
        dataSource={tableData}
        onChange={onChange}
        pagination={false}
      >
        {tableData?.length === 0 && <Empty />}
      </Table>
      <ModalInfoStruck dataSelect={dataSelect} open={openModal} handleClose={handleCloseModal} />
    </>
  );
};

export default () => (
  <App>
    <ListStruck />
  </App>
);
