import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, App, Popconfirm, Button, Flex, DatePicker, message } from 'antd';
import { isMobile } from 'react-device-detect';

import {
  formatArrDate,
  formatDateDayjs,
  formatDateFromDB,
  formatHourMinus,
  generateRandomVNLicensePlate,
  getColorChipStatus,
  listNameStatus,
  statusName
} from 'utils/helper';
const { Title, Link, Text } = Typography;
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import './list-guest.css';
import dayjs from 'dayjs';
import ModalInfoGuest from 'components/modal/modal-info-guest/ModalInfoGuest';
import ModalAddGuest from 'components/modal/modal-add-guest/ModalAddGuest';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import config from 'config';
import { concatGuestInfo, filterName, optionsSelect } from './list-guest.service';
const today = dayjs(); // Get the current date using dayjs

const ListGuest = () => {
  const [tableData, setTableData] = useState([]);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [typeModalAdd, setTypeModalAdd] = useState('');
  const [dataSelect, setDataSelect] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dateSelect, setDateSelect] = useState([today]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectData, setSelectData] = message.useMessage([statusName.NOT_IN]);

  const handleCloseModalInfo = () => {
    setOpenModalInfo(false);
  };
  const handleCloseModalAdd = () => {
    setDataSelect({});
    setOpenModalAdd(false);
  };

  const getData = async () => {
    const data = { date: JSON.stringify(formatArrDate(dateSelect)) };
    const rest = await restApi.post(RouterAPI.allGuest, data);
    if (rest?.status === 200) {
      setTableData(rest?.data);
    }
  };
  useEffect(() => {
    getData();
  }, [dateSelect]);

  const onClickEditOnModal = (DATA) => {
    setTypeModalAdd('EDIT');
    handleCloseModalInfo();
    setDataSelect(DATA);
    setOpenModalAdd(true);
  };

  const findByID = async (id) => {
    if (id) {
      const rest = await restApi.post(RouterAPI.findByIdGuest, {
        id
      });
      if (rest?.status === 200) {
        setDataSelect(rest?.data);
        setOpenModalInfo(true);
        return;
      }
    }
    messageApi.open({
      type: 'warning',
      content: 'không có dữ liệu!'
    });
  };
  const columns = [
    {
      align: 'left',
      key: 'guest_info',
      title: 'Tên khách',
      dataIndex: 'guest_info',
      width: isMobile ? 150 : '19%',
      fixed: 'left',

      render: (_, data) => (
        <>
          <Link
            onClick={() => {
              findByID(data?.GUEST_ID);
            }}
          >
            {concatGuestInfo(data?.guest_info)}
          </Link>
          {/* <Button
            type="link"
            onClick={() => {
              setDataSelect(data);
              setOpenModalInfo(true);
            }}
          >
            {concatGuestInfo(data?.guest_info)}
          </Button> */}
        </>
      ),
      filters: filterName(tableData),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {
        if (record?.guest_info && record?.guest_info.length > 0) {
          let check = false;
          record?.guest_info.map((item) => {
            if (item?.FULL_NAME === value) {
              check = true;
              return true;
            }
          });
          return check;
        }
        // record?.guest_info.includes(value)
      }
    },
    {
      align: 'left',
      key: 'COMPANY',
      title: 'Công ty',
      dataIndex: 'COMPANY',
      width: isMobile ? 130 : '11%',
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
      width: isMobile ? 130 : '11%',
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
      title: 'Giờ vào',
      dataIndex: 'TIME_IN',
      align: 'center',
      render: (_, { TIME_IN }) => <>{formatHourMinus(TIME_IN)}</>,
      width: isMobile ? 100 : '9%'
    },
    {
      key: 'TIME_OUT',
      title: ['Giờ ra'],
      dataIndex: 'TIME_OUT',
      align: 'center',
      render: (_, { TIME_OUT }) => <>{formatHourMinus(TIME_OUT)}</>,
      width: isMobile ? 100 : '9%'
    },
    {
      key: 'PERSON_SEOWON',
      title: 'Người bảo lãnh',
      dataIndex: 'PERSON_SEOWON',
      width: isMobile ? 150 : '15%'
    },
    {
      key: 'STATUS',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'STATUS',
      render: (_, { STATUS, TIME_IN }) => <>{getColorChipStatus(STATUS, TIME_IN)}</>,
      width: isMobile ? 100 : '11%',
      filters: listNameStatus() ?? [],
      filterMode: 'tree',
      filterSearch: true,
      defaultFilteredValue: [statusName.NEW],
      onFilter: (value, record) => record?.STATUS === value
    },
    {
      key: 'ACTION',
      align: 'center',
      title: 'Duyệt',
      fixed: 'right',
      render: (_, { data }) => (
        <>
          <div style={{ display: 'flex' }}>
            {/* <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                alert('edit');
              }}
            /> */}
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => {
                alert('edit');
              }}
            />
          </div>
        </>
      ),
      width: isMobile ? 60 : '6%'
    }
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onChangeDate = (date, dateString) => {
    if (date?.length === 0) {
      setDateSelect([dayjs()]);
    } else {
      setDateSelect(date);
    }
  };
  const handleClickAdd = () => {
    setTypeModalAdd('ADD');
    setOpenModalAdd(true);
  };

  const onAfterSave = (rest) => {
    if (rest?.status === 200) {
      handleCloseModalAdd();
      messageApi.open({
        type: 'success',
        content: 'Thêm mới thành công!'
      });
      getData();
    } else {
      messageApi.open({
        type: 'warning',
        content: rest?.data?.message ?? 'Thêm mới thất bại!'
      });
    }
  };

  const handleChangeStatus = (value) => {};
  const handleDelete = async () => {
    const rest = await restApi.post(RouterAPI.deleteGuest, { data: selectedRowKeys });
    console.log('rest', rest);
    if (rest?.status === 200) {
      messageApi.open({
        type: 'success',
        content: 'Xoá thành công!'
      });
      getData();
    } else {
      messageApi.open({
        type: 'warning',
        content: rest?.data?.message ?? 'Xoá thất bại!'
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={24}>
          <Title level={5}>Đăng ký khách vào công ty</Title>
        </Col>
      </Row>
      <Row style={{ margin: '5px 0px 10px 0px' }}>
        <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="space-between">
          <DatePicker
            className="date-picker-custom"
            multiple
            maxTagCount={isMobile ? 2 : 1}
            style={{ width: isMobile ? '100%' : '200px' }}
            allowClear={false}
            format={config.dateFormat}
            value={dateSelect}
            onChange={onChangeDate}
          />
          {/* <Select
            mode="multiple"
            allowClear={false}
            style={{
              width: '200px'
            }}
            placeholder="Trạng thái"
            onChange={handleChangeStatus}
            options={optionsSelect}
          /> */}
          <div style={{ display: 'flex', justifyContent: 'end', width: isMobile ? '100%' : '' }}>
            <Button onClick={handleClickAdd} style={{ marginRight: '5px' }} icon={<PlusOutlined />} type="primary">
              Đăng ký
            </Button>
            <Popconfirm onConfirm={handleDelete} title="Thông báo" description="Bạn chắc chắn muốn xoá?" okText="Có" cancelText="đóng">
              <Button disabled={selectedRowKeys?.length === 0} danger icon={<DeleteOutlined />} type="primary">
                Xoá
              </Button>
            </Popconfirm>
          </div>
        </Flex>
      </Row>
      <Table
        // tableLayout={'auto'}
        // tableLayout={tableData?.length !== 0 ? 'fixed' : 'auto'}
        rowKey="GUEST_ID"
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        bordered
        scroll={{
          x: 'max',
          y: '70vh'
        }}
        columns={columns}
        dataSource={tableData}
        pagination={false}
      ></Table>
      <ModalInfoGuest dataSelect={dataSelect} onClickEdit={onClickEditOnModal} open={openModalInfo} handleClose={handleCloseModalInfo} />
      <ModalAddGuest
        typeModal={typeModalAdd}
        afterSave={onAfterSave}
        dataSelect={dataSelect}
        open={openModalAdd}
        handleClose={handleCloseModalAdd}
      />
    </>
  );
};

export default () => (
  <App>
    <ListGuest />
  </App>
);
