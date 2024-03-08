import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, App, Popconfirm, Button, Flex, DatePicker, message, Result } from 'antd';
import io from 'socket.io-client';
import {
  formatArrDate,
  formatDateDayjs,
  formatDateFromDB,
  formatHourMinus,
  generateRandomVNLicensePlate,
  getColorChipStatus,
  getDataUserFromLocal,
  isMobile,
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
import { concatGuestInfo, filterName, initialFilterStatus, optionsSelect } from './list-guest.service';
import ForbidenPage from 'components/403/ForbidenPage';
import ICON from '../../assets/images/logo/favilogo.png';

const today = dayjs(); // Get the current date using dayjs
let urlSocket = process.env.REACT_APP_URL_SOCKET;
const socket = io(urlSocket);
console.log('socket ListGuest:', socket);

const ListGuest = () => {
  const [tableData, setTableData] = useState([]);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [typeModalAdd, setTypeModalAdd] = useState('');
  const [dataSelect, setDataSelect] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dateSelect, setDateSelect] = useState([today]);
  const [dataUser, setDateUser] = useState(getDataUserFromLocal());
  const [role, setRole] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

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
  const checkRole = async () => {
    const rest = await restApi.get(RouterAPI.checkRole);
    if (rest?.status === 200) {
      setRole(rest?.data);
    }
  };

  useEffect(() => {
    checkRole();
  }, []);
  useEffect(() => {
    if (dataSelect) {
      getData();
    }
  }, [dateSelect]);

  useEffect(() => {
    if (role) {
      socket.on('newguest', (data) => {
        if (data) {
          //nếu là người duyệt(quyền duyệt,không là người tạo)
          if (dataUser?.username !== data?.CREATE_BY && dataUser?.role?.ROLE_NAME !== 'SECURITY' && role?.IS_ACCEPT) {
            // if (Notification.permission === 'granted') {
            //   var notification = new Notification('Đăng ký khách mới', {
            //     icon: ICON,
            //     body: `- ${formatHourMinus(data?.TIME_IN)}-${formatHourMinus(data?.TIME_OUT)}\n- ${concatGuestInfo(data?.guest_info)}\n- ${data?.PERSON_SEOWON}`
            //   });
            //   notification.onclick = function () {
            //     window.open(process.env.REACT_APP_URL);
            //   };
            // } else {
            //   Notification.requestPermission();
            // }
            getData();
          }
        }
      });
      socket.on('acceptguest', (data) => {
        getData();
      });

      return () => {
        socket.off('newguest');
        socket.off('acceptguest');
      };
    }
  }, [role]);

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
  const onAccept = async (GUEST_ID) => {
    if (GUEST_ID) {
      const rest = await restApi.post(RouterAPI.changeStatusGuest, { GUEST_ID });
      if (rest?.status === 200) {
        // getData();
      } else {
        messageApi.open({
          type: 'warning',
          content: rest?.data?.message ?? 'Cannot accept!'
        });
      }
    }
  };
  const columns = [
    {
      align: 'left',
      key: 'guest_info',
      title: 'Tên khách',
      dataIndex: 'guest_info',
      width: isMobile() ? 150 : '19%',
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
      width: isMobile() ? 130 : '11%',
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
      width: isMobile() ? 130 : '11%',
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
      width: isMobile() ? 100 : '9%'
    },
    {
      key: 'TIME_OUT',
      title: ['Giờ ra'],
      dataIndex: 'TIME_OUT',
      align: 'center',
      render: (_, { TIME_OUT }) => <>{formatHourMinus(TIME_OUT)}</>,
      width: isMobile() ? 100 : '9%'
    },
    {
      key: 'PERSON_SEOWON',
      title: 'Người bảo lãnh',
      dataIndex: 'PERSON_SEOWON',
      width: isMobile() ? 150 : '15%'
    },
    {
      key: 'STATUS',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'STATUS',
      render: (_, { STATUS, TIME_IN }) => <>{getColorChipStatus(STATUS, TIME_IN)}</>,
      width: isMobile() ? 100 : '11%',
      filters: listNameStatus() ?? [],
      filterMode: 'tree',
      filterSearch: true,
      defaultFilteredValue: initialFilterStatus(dataUser?.role?.ROLE_NAME),
      onFilter: (value, record) => record?.STATUS === value
    },
    {
      key: 'ACTION',
      align: 'center',
      title: 'Duyệt',
      fixed: 'right',
      render: (_, data) => {
        if (
          (role?.IS_ACCEPT && data?.STATUS === statusName.NEW && dataUser?.role?.ROLE_NAME === 'ADMIN') ||
          (role?.IS_ACCEPT && data?.STATUS === statusName.ACCEPT && dataUser?.role?.ROLE_NAME === 'SECURITY')
        ) {
          return (
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    onAccept(data?.GUEST_ID);
                  }}
                />
              </div>
            </>
          );
        }
      },
      width: isMobile() ? 60 : '6%',
      hidden: dataUser?.role?.ROLE_NAME === 'USER'
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
      let text = typeModalAdd === 'EDIT' ? 'Cập nhật thông tin thành công!' : 'Đăng ký thành công!';
      messageApi.open({
        type: 'success',
        content: text
      });
      handleCloseModalAdd();
      getData();
    } else {
      messageApi.open({
        type: 'warning',
        content: rest?.data?.message ?? 'Thêm mới thất bại!'
      });
    }
  };
  const registerPushNotification = async () => {
    const swRegistration = await navigator?.serviceWorker?.ready;
    if (swRegistration) {
      console.log('process.env.REACT_APP_VAPID_PUBLIC_KEY', process.env.REACT_APP_VAPID_PUBLIC_KEY);
      const subscription = await swRegistration?.pushManager?.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      console.log('subscription', subscription);
      const rest = await restApi.post(RouterAPI.notifi_subscribe, { data: JSON.stringify(subscription) });
      console.log('resst', rest);
    }
    // Gửi subscription object lên server thông qua API
    // await fetch(process.env.REACT_APP_URL_API + 'auth/subscribeNoti', {
    //   method: 'POST',
    //   body: JSON.stringify(subscription),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
  };
  const handleDelete = async () => {
    registerPushNotification();
    // const rest = await restApi.post(RouterAPI.deleteGuest, { data: selectedRowKeys });
    // if (rest?.status === 200) {
    //   messageApi.open({
    //     type: 'success',
    //     content: 'Xoá thành công!'
    //   });
    //   getData();
    // } else {
    //   messageApi.open({
    //     type: 'warning',
    //     content: rest?.data?.message ?? 'Xoá thất bại!'
    //   });
    // }
  };
  if (!role) {
    return <ForbidenPage />;
  }
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
            maxTagCount={1}
            style={{ width: '205px' }}
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
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            {role?.IS_CREATE && (
              <Button onClick={handleClickAdd} style={{ marginRight: '5px' }} icon={<PlusOutlined />} type="primary">
                Đăng ký
              </Button>
            )}
            {role?.IS_DELETE && (
              <Popconfirm onConfirm={handleDelete} title="Thông báo" description="Bạn chắc chắn muốn xoá?" okText="Có" cancelText="đóng">
                <Button disabled={selectedRowKeys?.length === 0} danger icon={<DeleteOutlined />} type="primary">
                  {isMobile() ? '' : 'Xoá'}
                </Button>
              </Popconfirm>
            )}
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
        columns={columns.filter((item) => !item?.hidden)}
        dataSource={tableData}
        pagination={false}
      ></Table>
      <ModalInfoGuest
        role={role}
        dataSelect={dataSelect}
        onClickEdit={onClickEditOnModal}
        open={openModalInfo}
        handleClose={handleCloseModalInfo}
      />
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
