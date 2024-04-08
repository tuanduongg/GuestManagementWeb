import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, App, Popconfirm, Button, Flex, DatePicker, message, Tabs, Badge, Dropdown } from 'antd';
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
  UploadOutlined,
  ImportOutlined,
  UnorderedListOutlined,
  DownOutlined,
  UserOutlined
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
import { useTranslation } from 'react-i18next';
import ModalUploadExcel from 'components/modal/modal-upload-excel/ModalUploadExcel';
import axios from 'axios';

const today = dayjs(); // Get the current date using dayjs
// console.log('getAllDateOfWeek', getAllDateOfWeek());
let urlSocket = process.env.REACT_APP_URL_SOCKET;
const socket = io(urlSocket);
console.log('socket ListGuest:', socket);

const ListGuest = () => {
  const { t } = useTranslation();
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
  const [openModalUpload, setOpenModalUpload] = useState(false);
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
    // setLoading(true);
    const data = { date: JSON.stringify(formatArrDate(dateSelect)), status: statusName.NEW };
    if (valueTab === NEW_TAB) {
      data.date = JSON.stringify(formatArrDate([today]));
    } else {
      data.date = JSON.stringify(formatArrDate(dateSelect));
      data.status = 'ALL';
    }
    const rest = await restApi.post(RouterAPI.allGuest, data);
    // setLoading(false);
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
          if (role?.IS_ACCEPT) {
            // if (dataUser?.username !== data?.CREATE_BY && dataUser?.role?.ROLE_NAME !== 'SECURITY' && role?.IS_ACCEPT) {
            setCheckChange(true);
          }
        }
      });
      socket.on('acceptguest', (data) => {
        console.log('data', data);
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
      return selectedRowKeys.includes(item?.GUEST_ID) && item.STATUS === statusName.NEW;
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
      content: 'No data!'
    });
  };
  const onAccept = async (GUEST_ID) => {
    if (GUEST_ID) {
      const rest = await restApi.post(RouterAPI.changeStatusGuest, { GUEST_ID });
      if (rest?.status === 200) {
        messageApi.open({
          type: 'success',
          content: t('msg_update_success')
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
      title: 'nameGuest_col',
      dataIndex: 'guest_info',
      width: isMobile() ? 150 : role?.IS_ACCEPT ? '20%' : '33%',
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
      title: 'company_col',
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
      title: 'carNum_col',
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
      title: 'timeIn_col',
      dataIndex: 'TIME_IN',
      align: 'center',
      render: (_, { TIME_IN }) => <>{formatHourMinus(TIME_IN)}</>,
      width: isMobile() ? 100 : '9%'
    },
    {
      key: 'TIME_OUT',
      title: 'timeOut_col',
      dataIndex: 'TIME_OUT',
      align: 'center',
      render: (_, { TIME_OUT }) => <>{formatHourMinus(TIME_OUT)}</>,
      width: isMobile() ? 100 : '9%'
    },
    {
      key: 'PERSON_SEOWON',
      title: 'personSeowon_col',
      dataIndex: 'PERSON_SEOWON',
      width: isMobile() ? 150 : '15%'
    },
    {
      key: 'STATUS',
      align: 'center',
      title: 'status_col',
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
      title: 'action_col',
      fixed: 'right',
      render: (text, data, index) => {
        // if (
        //   (role?.IS_ACCEPT && data?.STATUS === statusName.NEW && dataUser?.role?.ROLE_NAME !== 'SECURITY') ||
        //   (role?.IS_ACCEPT && data?.STATUS === statusName.ACCEPT && dataUser?.role?.ROLE_NAME === 'SECURITY') ||
        //   data?.histories?.length === 0
        // ) {
        if ((role?.IS_ACCEPT && data?.STATUS === statusName.NEW) || (role?.IS_ACCEPT && data?.histories?.length === 0)) {
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
      hidden: valueTab === HISTORY_TAB
    }
  ].map((item) => {
    return { ...item, title: t(item?.title) };
  });
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
      let text = typeModalAdd === 'EDIT' ? t('msg_update_success') : t('msg_add_success');
      messageApi.open({
        type: 'success',
        content: text
      });
      getData();
    } else {
      messageApi.open({
        type: 'warning',
        content: rest?.data?.message ?? t('msg_add_fail')
      });
    }
  };
  const onClickFilter = () => {
    getData();
  };

  const handleDelete = async () => {
    const data = [];
    tableData.map((item) => {
      if (selectedRowKeys.includes(item?.GUEST_ID) && item?.STATUS === statusName.NEW) {
        data.push(item.GUEST_ID);
      }
    });
    const rest = await restApi.post(RouterAPI.cancelGuest, { data: data });
    if (rest?.status === 200) {
      messageApi.open({
        type: 'success',
        content: 'Cancel successful!'
      });
      // getData();
    } else {
      messageApi.open({
        type: 'warning',
        content: rest?.data?.message ?? 'Cancel fail!'
      });
    }
  };
  const handleExportExcel = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_URL_API + RouterAPI.exportGuest,
        { listID: selectedRowKeys },
        {
          responseType: 'blob' // Ensure response is treated as a blob
        }
      );
      if (response?.data.error) {
        console.error(response.data.error);
      }
      console.log(response?.data);

      const link = document.createElement('a');
      link.href = URL.createObjectURL(response?.data);
      link.setAttribute('download', 'file.xlsx');
      document.body.appendChild(link);
      link.click();
      // const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      // const fileLink = document.createElement('a');
      // fileLink.href = fileURL;
      // const contentDisposition = response.headers['content-disposition'];
      // const fileName = contentDisposition.substring(contentDisposition.indexOf('filename=') + 9, contentDisposition.length);
      // fileLink.setAttribute('download', fileName);
      // fileLink.setAttribute('target', '_blank');
      // document.body.appendChild(fileLink);
      // fileLink.click();
      // fileLink.remove();
    } catch (error) {
      console.error('Error generating Excel:', error);
    }
  };
  const onClickShowModalHistory = () => {
    setOpenModalHistory(true);
  };
  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'importExcel':
        setOpenModalUpload(true);
        break;
      case 'cancel':
        handleDelete();
        break;
      case 'exportExcel':
        handleExportExcel();
        break;

      default:
        break;
    }
  };
  const ITEMS = [
    {
      label: 'Import Excel',
      key: 'importExcel',
      icon: <UploadOutlined />,
      disabled: !role?.IS_IMPORT,
      hidden: false
    },
    {
      label: 'Export Excel',
      key: 'exportExcel',
      icon: <ImportOutlined />,
      disabled: selectedRowKeys?.length < 1,
      hidden: !role?.IS_EXPORT
    },
    {
      label: 'Canel',
      key: 'cancel',
      icon: <CloseOutlined />,
      disabled: disabledBtnCancel,
      danger: true,
      hidden: !role?.IS_DELETE
    }
  ];
  const menuProps = {
    items: ITEMS.filter((item) => item?.hidden === false) ?? [],
    onClick: handleMenuClick
  };

  if (!role?.IS_READ) {
    return <ForbidenPage />;
  }
  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
      <Row>
        <Col style={{ marginTop: '5px' }} span={24}>
          <Title level={5}>{t('sidebar_manager_guest')}</Title>
        </Col>
      </Row>
      <div style={{ width: '100%', maxWidth: '100%' }}>
        <MainCard contentSX={{ p: 2, minHeight: '83vh' }}>
          <Tabs
            value={valueTab}
            defaultActiveKey="1"
            items={[
              {
                key: NEW_TAB,
                label: (
                  <Badge dot={0}>
                    <span>{t('today')}</span>
                  </Badge>
                ),
                icon: <CalendarOutlined />,
                hidden: dataUser?.role?.ROLE_NAME === 'USER'
              },
              {
                key: HISTORY_TAB,
                label: t('regisList'),
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
                    {dataUser?.role?.ROLE_NAME === 'SECURITY' ? 'Ngày vào:' : `${t('createDate')}:`}
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
                    {t('createBTN')}
                  </Button>
                )}
                {/* {role?.IS_DELETE && (
                  <Popconfirm
                    onConfirm={handleDelete}
                    title={t('msg_notification')}
                    description="Are you sure you want to cancel it?"
                    okText={t('yes')}
                    cancelText={t('close')}
                  >
                    <Button shape="round" disabled={disabledBtnCancel} danger icon={<CloseOutlined />} type="primary">
                      {t('canelBTN')}
                    </Button>
                  </Popconfirm>
                )} */}
                {(role?.IS_DELETE || role?.IS_IMPORT || role?.IS_EXPORT) && (
                  <Dropdown menu={menuProps}>
                    <Button style={{ marginLeft: '5px' }} shape="round" icon={<DownOutlined />}>
                      More
                    </Button>
                  </Dropdown>
                )}
              </div>
            </Col>
          </Row>
          <Table
            rowKey="GUEST_ID"
            rowSelection={
              role?.IS_DELETE
                ? {
                    selectedRowKeys,
                    onChange: onSelectChange
                  }
                : null
            }
            bordered
            scroll={
              tableData?.length === 0 && !isMobile()
                ? null
                : isMobile()
                  ? {
                      x: '100vh',
                      y: '100vh'
                    }
                  : null
            }
            columns={columns.filter((item) => !item?.hidden)}
            dataSource={tableData}
            pagination={false}
          ></Table>
        </MainCard>
      </div>
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
      <ModalUploadExcel
        setLoading={setLoading}
        afterSave={onAfterSave}
        open={openModalUpload}
        handleClose={() => {
          setOpenModalUpload(false);
        }}
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
