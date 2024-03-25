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
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  UsergroupAddOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import './list-guest.css';
import dayjs from 'dayjs';
import ModalInfoGuest from 'components/modal/modal-info-guest/ModalInfoGuest';
import ModalAddGuest from 'components/modal/modal-add-guest/ModalAddGuest';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import config from 'config';
import {
  HISTORY_TAB,
  NEW_TAB,
  concatGuestInfo,
  filterName,
  getAllDateOfWeek,
  initialFilterStatus,
  optionsSelect
} from './list-guest.service';
import ForbidenPage from 'components/403/ForbidenPage';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import ModalHistoryGuest from 'components/modal/modal-history-guest/ModalHistoryGuest';

const today = dayjs(); // Get the current date using dayjs
// console.log('getAllDateOfWeek', getAllDateOfWeek());
let urlSocket = process.env.REACT_APP_URL_SOCKET;
const socket = io(urlSocket);
console.log('socket ListGuest:', socket);

const ListGuest = () => {
  const [tableData, setTableData] = useState([]);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [typeModalAdd, setTypeModalAdd] = useState('');
  const [dataSelect, setDataSelect] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dateSelect, setDateSelect] = useState(getAllDateOfWeek());
  const [dataUser, setDateUser] = useState(getDataUserFromLocal());
  const [role, setRole] = useState(null);
  const [disabledBtnCancel, setDisableBtnCancel] = useState(true);
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
  const showCancelBtn = () => {
    const rs = tableData?.filter((item) => {
      return selectedRowKeys.includes(item?.GUEST_ID) && item.STATUS !== statusName.CANCEL;
    });
    return rs?.length > 0;
  };
  useEffect(() => {
    if (selectedRowKeys) {
      const result = !showCancelBtn();
      setDisableBtnCancel(result);
    }
  }, [selectedRowKeys]);

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
        messageApi.open({
          type: 'success',
          content: 'Cập nhật thành công!'
        });
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
      render: (_, { STATUS, DELETE_AT }) => <>{getColorChipStatus(STATUS, DELETE_AT)}</>,
      width: isMobile() ? 100 : '11%',
      filters: valueTab === NEW_TAB ? [] : listNameStatus(),
      filterMode: 'tree',
      filterSearch: valueTab !== NEW_TAB,
      onFilter: (value, record) => {
        return record?.STATUS === value;
      },
      hidden: dataUser?.role?.ROLE_NAME === 'SECURITY'
    },
    // {
    //   key: 'CREATE_AT',
    //   align: 'center',
    //   title: 'Thời Gian Tạo',
    //   render: (_, { CREATE_AT }) => formatDateFromDB(CREATE_AT),
    //   hidden: !dataUser?.role?.ROLE_NAME === 'USER'
    // },
    {
      key: 'ACTION',
      align: 'center',
      title: 'Chức năng',
      fixed: 'right',
      render: (text, data, index) => {
        if (
          (role?.IS_ACCEPT && data?.STATUS === statusName.NEW && !data?.DELETE_AT && dataUser?.role?.ROLE_NAME !== 'SECURITY') ||
          (role?.IS_ACCEPT && data?.STATUS === statusName.ACCEPT && !data?.DELETE_AT && dataUser?.role?.ROLE_NAME === 'SECURITY') ||
          data?.histories?.length === 0
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
      width: isMobile() ? 60 : '12%',
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
    const rest = await restApi.post(RouterAPI.cancelGuest, { data: selectedRowKeys });
    if (rest?.status === 200) {
      messageApi.open({
        type: 'success',
        content: 'Hủy thành công!'
      });
      getData();
    } else {
      messageApi.open({
        type: 'warning',
        content: rest?.data?.message ?? 'Hủy thất bại!'
      });
    }
  };

  const onClickShowModalHistory = () => {
    setOpenModalHistory(true);
  };
  // if (loading) {
  //   return <Loading />;
  // }
  if (!role?.IS_READ) {
    return <ForbidenPage />;
  }
  return (
    <>
      <Loading loading={loading} />
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
                <Badge dot={0}>
                  <span>Hôm nay</span>
                </Badge>
              ),
              icon: <CalendarOutlined />,
              hidden: dataUser?.role?.ROLE_NAME === 'USER'
            },
            {
              key: HISTORY_TAB,
              label: 'Danh sách đăng ký',
              icon: <UnorderedListOutlined />,
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
                  <Button shape="round" disabled={disabledBtnCancel} danger icon={<CloseOutlined />} type="primary">
                    {'Huỷ'}
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
        onClickShowModalHistory={onClickShowModalHistory}
        role={role}
        dataSelect={dataSelect}
        onClickEdit={onClickEditOnModal}
        open={openModalInfo}
        handleClose={handleCloseModalInfo}
      />
      <ModalAddGuest
        setLoading={setLoading}
        typeModal={typeModalAdd}
        afterSave={onAfterSave}
        dataSelect={dataSelect}
        open={openModalAdd}
        handleClose={handleCloseModalAdd}
      />
      <ModalHistoryGuest
        idGuest={dataSelect?.GUEST_ID}
        open={openModalHistory}
        handleClose={() => {
          setOpenModalHistory(false);
        }}
      />
    </>
  );
};

export default () => (
  <App>
    <ListGuest />
  </App>
);
