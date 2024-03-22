import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, App, Popconfirm, Button, Flex, DatePicker, message, Tabs, Badge } from 'antd';
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
  requestPermisstionNoti,
  statusName
} from 'utils/helper';
const { Title, Link, Text } = Typography;
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  UsergroupAddOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import './list-guest.css';
import dayjs from 'dayjs';
import ModalInfoGuest from 'components/modal/modal-info-guest/ModalInfoGuest';
import ModalAddGuest from 'components/modal/modal-add-guest/ModalAddGuest';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import config from 'config';
import { HISTORY_TAB, NEW_TAB, concatGuestInfo, filterName, initialFilterStatus, optionsSelect } from './list-guest.service';
import ForbidenPage from 'components/403/ForbidenPage';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';

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
  const [loading, setLoading] = useState(false);
  const [checkChange, setCheckChange] = useState(false);
  const [valueTab, setValueTab] = useState(dataUser && dataUser?.role?.ROLE_NAME === 'USER' ? HISTORY_TAB : NEW_TAB);
  const [messageApi, contextHolder] = message.useMessage();

  const handleCloseModalInfo = () => {
    setOpenModalInfo(false);
  };
  const handleCloseModalAdd = () => {
    setDataSelect({});
    setOpenModalAdd(false);
  };

  // useEffect(() => {
  //   if (dataUser && dataUser?.role?.ROLE_NAME === 'USER') {
  //     setValueTab(HISTORY_TAB);
  //   }
  // }, [dataUser]);

  const getData = async () => {
    console.log('valueTab', valueTab);
    const data = { date: JSON.stringify(formatArrDate(dateSelect)), status: statusName.NEW };
    if (valueTab === NEW_TAB) {
      data.date = JSON.stringify(formatArrDate([today]));
    } else {
      data.date = JSON.stringify(formatArrDate(dateSelect));
      data.status = 'ALL';
    }
    const rest = await restApi.post(RouterAPI.allGuest, data);
    if (rest?.status === 200) {
      setTableData(rest?.data);
    }
    setCheckChange(false);
  };
  const checkRole = async () => {
    setLoading(true);
    const rest = await restApi.get(RouterAPI.checkRole);
    if (rest?.status === 200) {
      setRole(rest?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkRole();
  }, []);
  useEffect(() => {
    getData();
  }, [valueTab]);

  useEffect(() => {
    if (role) {
      socket.on('newguest', (data) => {
        if (data) {
          //nếu là người duyệt(quyền duyệt,không là người tạo)
          if (dataUser?.username !== data?.CREATE_BY && dataUser?.role?.ROLE_NAME !== 'SECURITY' && role?.IS_ACCEPT) {
            console.log('valueTab', valueTab);
            setCheckChange(true);
          }
        }
      });
      socket.on('acceptguest', (data) => {
        setCheckChange(true);
      });

      return () => {
        socket.off('newguest');
        socket.off('acceptguest');
      };
    }
  }, [role]);

  useEffect(() => {
    if (checkChange) {
      getData();
    }
  }, [checkChange]);

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
      width: isMobile() ? 150 : '21%',
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
      }
    },
    {
      align: 'left',
      key: 'COMPANY',
      title: 'Công ty',
      dataIndex: 'COMPANY',
      width: isMobile() ? 130 : '11%',
      filters: tableData
        ? tableData
            .map((item) => {
              return {
                text: item?.COMPANY,
                value: item?.COMPANY
              };
            })
            .filter((v, i, a) => v.value !== '' && a.findIndex((v2) => v2.value === v.value) === i)
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
        ? tableData
            .map((item) => {
              return {
                text: item?.CAR_NUMBER,
                value: item?.CAR_NUMBER
              };
            })
            .filter((v, i, a) => v.value !== '' && a.findIndex((v2) => v2.value === v.value) === i)
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
      filters: valueTab === NEW_TAB ? [] : listNameStatus(),
      filterMode: 'tree',
      filterSearch: valueTab !== NEW_TAB,
      onFilter: (value, record) => record?.STATUS === value,
      hidden: dataUser?.role?.ROLE_NAME === 'SECURITY'
    },
    {
      key: 'ACTION',
      align: 'center',
      title: 'Chức năng',
      fixed: 'right',
      render: (_, data) => {
        if (
          (role?.IS_ACCEPT && data?.STATUS === statusName.NEW && dataUser?.role?.ROLE_NAME !== 'SECURITY') ||
          (role?.IS_ACCEPT && data?.STATUS === statusName.ACCEPT && dataUser?.role?.ROLE_NAME === 'SECURITY')
        ) {
          return (
            <>
              {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
              <Button
                onClick={() => {
                  onAccept(data?.GUEST_ID);
                }}
                size="small"
                type="link"
                shape="circle"
                icon={<CheckOutlined />}
              />
              {/* </div> */}
            </>
          );
        }
      },
      width: isMobile() ? 60 : '9%',
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
      getData();
    } else {
      messageApi.open({
        type: 'warning',
        content: rest?.data?.message ?? 'Thêm mới thất bại!'
      });
    }
  };
  const onClickFilter = () => {
    getData();
  };

  const handleDelete = async () => {
    const rest = await restApi.post(RouterAPI.deleteGuest, { data: selectedRowKeys });
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
  if (loading) {
    return <Loading />;
  }
  if (!role?.IS_READ) {
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
      <MainCard contentSX={{ p: 2, minHeight: '83vh' }}>
        <Tabs
          value={valueTab}
          defaultActiveKey="1"
          items={[
            {
              key: NEW_TAB,
              label: (
                <Badge dot={tableData?.filter((item) => item?.STATUS === statusName.NEW).length > 0}>
                  <span>Đăng ký mới</span>
                </Badge>
              ),
              icon: <UsergroupAddOutlined />,
              hidden: dataUser?.role?.ROLE_NAME === 'USER'
              // children: 'Content of Tab Pane 1'
            },
            {
              key: HISTORY_TAB,
              label: dataUser?.role?.ROLE_NAME === 'USER' ? 'Danh sách đăng ký' : 'Lịch sử đăng ký',
              icon: <HistoryOutlined />,
              hidden: false
              // children: 'Content of Tab Pane 2'
            }
          ].filter((item) => !item.hidden)}
          onChange={(key) => {
            setValueTab(key);
          }}
        />
        <Row style={{ margin: '5px 0px 10px 0px' }}>
          {valueTab === HISTORY_TAB && (
            <Col sm={12} xs={24}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile() ? 'space-between' : '' }}>
                <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                  {' '}
                  {dataUser?.role?.ROLE_NAME === 'SECURITY' ? 'Ngày vào:' : 'Ngày tạo:'}
                </span>
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
                <Button
                  style={{ marginLeft: '5px' }}
                  onClick={onClickFilter}
                  type="link"
                  icon={<FilterOutlined style={{ fontSize: '22px' }} />}
                />
              </div>
            </Col>
          )}
          <Col style={{ margin: isMobile() ? '10px 0px' : '' }} sm={valueTab !== HISTORY_TAB ? 24 : 12} xs={24}>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              {role?.IS_CREATE && (
                <Button shape="round" onClick={handleClickAdd} style={{ marginRight: '5px' }} icon={<PlusOutlined />} type="primary">
                  Đăng ký
                </Button>
              )}
              {role?.IS_DELETE && (
                <Popconfirm onConfirm={handleDelete} title="Thông báo" description="Bạn chắc chắn muốn hủy?" okText="Có" cancelText="đóng">
                  <Button shape="round" disabled={selectedRowKeys?.length === 0} danger icon={<CloseOutlined />} type="primary">
                    {'Hủy'}
                  </Button>
                </Popconfirm>
              )}
            </div>
          </Col>
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
            y: '60vh'
          }}
          columns={columns.filter((item) => !item?.hidden)}
          dataSource={tableData}
          pagination={false}
        ></Table>
      </MainCard>
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
