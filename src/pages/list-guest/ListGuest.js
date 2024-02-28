import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, App, Empty, Button, Flex, DatePicker } from 'antd';
import { formatDateFromDB, generateRandomVNLicensePlate, getColorChipStatus, listNameStatus, statusName } from 'utils/helper';
const { Title } = Typography;
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './list-guest.css';
import dayjs from 'dayjs';
import ModalInfoGuest from 'components/modal/modal-info-guest/ModalInfoGuest';
import ModalAddGuest from 'components/modal/modal-add-guest/ModalAddGuest';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
const today = dayjs(); // Get the current date using dayjs
// [
//   {
//       "NAME_ID": "4C267BA9-19D6-EE11-A1CF-04D9F5C9D2EB",
//       "FULL_NAME": "Nguyễn Anh Tuấn"
//   }
// ]
const concatGuestInfo = (arr) => {
  if (arr) {
    let result = '';
    arr.map((item, index) => {
      if (index !== arr.length - 1) {
        result += item?.FULL_NAME + ',';
      } else {
        result += item?.FULL_NAME;
      }
    });
    return result;
  }
  return '';
};

const ListGuest = () => {
  const [tableData, setTableData] = useState([]);
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

  const getData = async () => {
    const rest = await restApi.get(RouterAPI.allGuest);
    console.log('rest', rest);
    if (rest?.status === 200) {
      setTableData(rest?.data);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      align: 'left',
      key: 'guest_info',
      title: 'Tên khách',
      dataIndex: 'guest_info',
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
            {concatGuestInfo(data?.guest_info)}
          </Button>
        </>
      ),
      filters: tableData
        ? tableData.map((item) => {
            return {
              text: item?.guest_info?.FULL_NAME,
              value: item?.guest_info?.FULL_NAME
            };
          })
        : [],
      // {
      //   text: 'Category 2',
      //   value: 'Category 2'
      // }
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.guest_info?.FULL_NAME === value
    },
    {
      align: 'left',
      key: 'COMPANY',
      title: 'Công ty',
      dataIndex: 'COMPANY',
      width: 130,
      filters: tableData
        ? tableData.map((item) => {
            return {
              text: item?.COMPANY,
              value: item?.COMPANY
            };
          })
        : [],
      // {
      //   text: 'Category 2',
      //   value: 'Category 2'
      // }
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.COMPANY === value
    },
    {
      key: 'CAR_NUMBER',
      title: 'Biển số',
      dataIndex: 'CAR_NUMBER',
      align: 'center',
      width: 130,
      filters: tableData
        ? tableData.map((item) => {
            return {
              text: item?.CAR_NUMBER,
              value: item?.CAR_NUMBER
            };
          })
        : [],
      // {
      //   text: 'Category 2',
      //   value: 'Category 2'
      // }
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.CAR_NUMBER === value
    },
    {
      key: 'TIME_IN',
      title: 'Giờ vào\n(dự kiến)',
      dataIndex: 'TIME_IN',
      align: 'center',
      // render: (_, { timeInExpected }) => <>{formatDateFromDB(timeInExpected)}</>,
      width: 100
    },
    {
      key: 'TIME_OUT',
      title: ['Giờ ra', '(dự kiến)'],
      dataIndex: 'TIME_OUT',
      align: 'center',
      // render: (_, { timeOutExpected }) => <>{formatDateFromDB(timeOutExpected)}</>,
      width: 110
    },
    {
      key: 'PERSON_SEOWON',
      title: 'Người bảo lãnh',
      dataIndex: 'PERSON_SEOWON',
      width: 150
    },
    {
      key: 'STATUS',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'STATUS',
      render: (_, { STATUS, TIME_IN }) => <>{getColorChipStatus(STATUS, TIME_IN)}</>,
      width: 130,
      filters: listNameStatus() ?? [],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.STATUS === value
    },
    {
      key: 'ACTION',
      align: 'center',
      title: '',
      render: (_, { data }) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              alert('edit');
            }}
          />
        </>
      ),
      width: 30
    }
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('newSelectedRowKeys', newSelectedRowKeys);
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
        rowKey="GUEST_ID"
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
