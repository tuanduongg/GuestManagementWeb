import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { Table, Row, Col, Button, message, Input, Dropdown, notification, Badge, Modal, Tooltip, DatePicker } from 'antd';
const { Search } = Input;
import { concatNameProductsOnOrder, formatDateFromDB, formattingVND, getDataUserFromLocal, isMobile, truncateString } from 'utils/helper';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import { useTheme } from '@mui/material/styles';
const { RangePicker } = DatePicker;
import {
  MoreOutlined,
  CheckOutlined,
  CloseOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
  SignatureOutlined,
  StopOutlined,
  InfoCircleOutlined,
  ExclamationCircleFilled,
  UserOutlined
} from '@ant-design/icons';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';
import config from 'config';
import { TABS_ORDER, getBadgeStatus } from './order.service';
import './order.css';
import ModalDetailOrder from 'components/modal/modal-detail-order/ModalDetailOrder';
import dayjs from 'dayjs';
import ForbidenPage from 'components/403/ForbidenPage';
const today = dayjs();
const Order = () => {
  const [role, setRole] = useState(null);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [valueTab, setValueTab] = useState(TABS_ORDER.ALL_TAB.ID);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeModal, setTypeModal] = useState('');
  const [currentRow, setCurrentRow] = useState(null);
  const [totalOrders, setTotalOrders] = useState([]);
  const [detailOrder, setDetailOrder] = useState(null);
  const [dataUser, setDataUser] = useState({});
  const [api] = notification.useNotification();
  const [itemSteps, setItemSteps] = useState([]);
  const [fromDateValue, setFromDateValue] = useState(today.subtract(30, 'day'));
  const [toDateValue, setToDateValue] = useState(today);
  const [roleAccept, setRoleAccept] = useState({ accept: false, cancel: false });
  const theme = useTheme();

  useEffect(() => {
    checkRole();
    const data = getDataUserFromLocal();
    if (data) {
      setDataUser(data);
    }
  }, []);

  const checkRole = async () => {
    setLoading(true);
    const rest = await restApi.get(RouterAPI.checkRole);
    if (rest?.status === 200) {
      setRole(rest?.data);
    }
    setLoading(false);
  };

  const handleAccept = async () => {
    if (!currentRow) {
      messageApi.open({
        type: 'error',
        content: 'You must choose a row!'
      });
      return;
    }
    setLoading(true);

    const res = await restApi.post(RouterAPI.changeStatusOrder, { orderID: currentRow?.orderID });
    setLoading(false);
    if (res?.status === 200) {
      messageApi.open({
        type: 'success',
        content: 'Thay đổi trạng thái thành công!'
      });
      setOpenModalDetail(false);
      getAllOrder();
    } else {
      messageApi.open({
        type: 'error',
        content: res?.data?.message ?? 'Change status order fail!'
      });
    }
  };
  const handleCancel = async () => {
    if (!currentRow) {
      messageApi.open({
        type: 'error',
        content: 'You must choose a row!'
      });
      return;
    }
    setLoading(true);

    const res = await restApi.post(RouterAPI.cancelOrder, { orderID: currentRow?.orderID });
    setLoading(false);

    if (res?.status === 200) {
      messageApi.open({
        type: 'success',
        content: 'Hủy thành công!'
      });
      setOpenModalDetail(false);
      getAllOrder();
    } else {
      messageApi.open({
        type: 'error',
        content: res?.data?.message ?? 'Cancel order fail!'
      });
    }
  };
  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'accept':
        Modal.confirm({
          title: t('msg_notification'),
          content: t('msg_accept_order'),
          okText: t('yes'),
          cancelText: t('close'),
          centered: true,
          icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
          onOk: async () => {
            handleAccept();
          }
        });
        break;
      case 'cancel':
        Modal.confirm({
          title: t('msg_notification'),
          content: t('msg_cancel_order'),
          okText: t('yes'),
          cancelText: t('close'),
          centered: true,
          onOk: async () => {
            handleCancel();
          },
          icon: <ExclamationCircleFilled />
        });
        break;

      default:
        break;
    }
  };
  const getAllOrder = async () => {
    setLoading(true);
    const obj = { page: +page - 1, rowsPerPage, search, type: valueTab, fromDate: fromDateValue, toDate: toDateValue };
    const url = RouterAPI.getAllOrder;
    const res = await restApi.post(url, obj);
    setLoading(false);
    if (res?.status === 200) {
      const data = res?.data?.data;
      setTotalOrders(data);
      setTotal(res?.data?.count);
    }
  };
  const onClickShowDetail = (data) => {
    onShowDetail(data);
  };
  const onShowDetail = async (data) => {
    setLoading(true);
    // await getStatus(data?.departmentID, res?.data);
    setCurrentRow(data);
    const orderID = data?.orderID;
    if (orderID) {
      const res = await restApi.post(RouterAPI.detailOrderWithAllStatus, { orderID });
      setLoading(false);
      if (res?.status === 200) {
        const order = res?.data?.order;
        const allStatus = res?.data?.allStatus;
        setRoleAccept(data?.disable);
        setDetailOrder(order);
        if (order?.cancel_at) {
          setItemSteps([
            {
              title: 'New',
              status: 'finish'
            },
            {
              title: order?.cancel_by,
              status: 'error'
            },
            {
              title: 'Done',
              status: 'wait'
            }
          ]);
        } else {
          const levelOrder = order?.status?.level;
          if (allStatus?.length > 0 && order?.status) {
            const newItems = allStatus.map((each) => {
              if (each?.level >= 0) {
                if (each?.level <= levelOrder) {
                  return {
                    title: each?.statusName,
                    status: 'finish'
                  };
                } else {
                  return {
                    title: each?.statusName,
                    status: 'wait'
                  };
                }
              }
            });
            setItemSteps(newItems);
          }
        }
        setOpenModalDetail(true);
      } else {
        messageApi.open({
          type: 'error',
          content: res?.data?.message ?? 'Get infomation order fail!'
        });
      }
    }
  };
  useEffect(() => {
    getAllOrder();
  }, [valueTab, page, search, rowsPerPage, fromDateValue, toDateValue]);
  const columns = [
    {
      align: 'center',
      key: 'index',
      title: '#',
      render: (_, data, index) => <>{(page - 1) * rowsPerPage + index + 1}</>,
      width: isMobile() ? '30px' : '5%'
    },
    {
      align: 'left',
      fixed: 'left',
      key: 'orderNumber',
      title: 'order_number_col',
      render: (_, data) => (
        <>
          <Button
            onClick={() => {
              onClickShowDetail(data);
            }}
            style={{ padding: '0px' }}
            type="link"
          >
            {data?.code}
          </Button>
        </>
      ),
      width: isMobile() ? '137px' : '15%'
    },
    {
      align: 'left',
      key: 'product',
      title: 'product',
      render: (_, data) => (
        <>
          {data?.created_by === dataUser?.username ? (
            <Tooltip placement="top" title={'Order của bạn'}>
              <UserOutlined style={{ marginRight: '2px', color: theme?.palette?.info?.dark }} />
            </Tooltip>
          ) : null}
          {concatNameProductsOnOrder(data?.orderDetail, '; ')}
        </>
      ),
      width: isMobile() ? '130px' : '15%'
    },

    {
      key: 'reciever',
      title: 'name',
      dataIndex: 'reciever',
      align: 'center',
      render: (_, data) => <>{data?.reciever}</>,
      width: isMobile() ? '100px' : '11%'
    },
    {
      key: 'department',
      title: 'department',
      align: 'center',
      render: (_, data) => <>{data?.department?.departName}</>,
      width: isMobile() ? '100px' : '14%'
    },
    {
      align: 'center',
      key: 'total',
      title: 'totalCol',
      dataIndex: 'total',
      render: (_, data) => <>{formattingVND(data?.total)}</>,
      sorter: (a, b) => a?.total - b?.total,
      width: isMobile() ? '100px' : '12%'
    },
    {
      align: 'center',
      key: 'create_at',
      title: 'time',
      dataIndex: 'created_at',
      render: (_, data) => <>{formatDateFromDB(data?.created_at)}</>,
      sorter: (a, b) => {
        const dateA = new Date(a?.created_at);
        const dateB = new Date(b?.created_at);
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      },
      width: isMobile() ? '100px' : '10%'
    },
    {
      align: 'center',
      key: 'status',
      title: 'status_col',
      render: (_, data) => <>{getBadgeStatus(data?.status)}</>,
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'ACTION',
      align: 'center',
      title: '',
      render: (_, data) => {
        return (
          <>
            <Dropdown
              disabled={!data?.disable?.accept && !data?.disable?.cancel}
              trigger={['click']}
              placement="left"
              menu={{
                items: [
                  {
                    label: t('accept'),
                    key: 'accept',
                    icon: <CheckOutlined />,
                    disabled: !data?.disable?.accept
                  },
                  {
                    label: t('cancel'),
                    key: 'cancel',
                    icon: <CloseOutlined />,
                    disabled: !data?.disable?.cancel,
                    danger: true
                  }
                ],
                onClick: handleMenuClick
              }}
            >
              <Button
                disabled={!data?.disable?.accept && !data?.disable?.cancel}
                onClick={() => {
                  setCurrentRow(data);
                }}
                type="text"
                icon={<MoreOutlined />}
              ></Button>
            </Dropdown>
          </>
        );
      },
      width: isMobile() ? '50px' : '4%'
    }
  ].map((colItem) => {
    return { ...colItem, title: t(colItem?.title) };
  });

  

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };
  const disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20)
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4)
    };
  };
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  if (!role?.IS_READ) {
    return <ForbidenPage />;
  }
  return (
    <>
      {contextHolder}
      <Loading loading={loading} />
      <MainCard contentSX={{ p: isMobile() ? 0.5 : 2, minHeight: '83vh' }}>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }} gutter={8}>
          <Col xs={24} sm={10} md={12}>
            <Tabs
              className="tab_order"
              value={valueTab}
              activeKey={valueTab}
              defaultActiveKey="1"
              items={[
                {
                  key: TABS_ORDER.ALL_TAB.ID,
                  label: t(TABS_ORDER.ALL_TAB.title),
                  icon: <UnorderedListOutlined />,
                  hidden: false
                },
                {
                  key: TABS_ORDER.NEW_TAB.ID,
                  label: (
                    <Badge
                      style={{
                        // backgroundColor: 'hwb(205 6% 9%)'
                        backgroundColor: 'green'
                      }}
                      count={0}
                      offset={[15, -5]}
                    >
                      <span>{t(TABS_ORDER.NEW_TAB.title)}</span>
                    </Badge>
                  ),
                  icon: <SolutionOutlined />,
                  hidden: false
                  // children: 'Content of Tab Pane 2'
                },
                {
                  key: TABS_ORDER.ACCEPT_TAB.ID,
                  label: <span>{t(TABS_ORDER.ACCEPT_TAB.title)}</span>,
                  icon: <SignatureOutlined />,
                  hidden: false
                  // children: 'Content of Tab Pane 2'
                },
                {
                  key: TABS_ORDER.CANCEL_TAB.ID,
                  label: t(TABS_ORDER.CANCEL_TAB.title),
                  icon: <StopOutlined />,
                  hidden: false
                  // children: 'Content of Tab Pane 2'
                }
              ].filter((item) => !item.hidden)}
              onChange={(key) => {
                setValueTab(key);
              }}
            />
          </Col>
          <Col xs={24} sm={8} md={7}>
            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              {t('from')}
              <DatePicker
                style={{ margin: '5px' }}
                allowClear={false}
                value={fromDateValue}
                onChange={(value, dateString) => {
                  setFromDateValue(value);
                }}
                format={{
                  format: config.dateFormat,
                  type: 'mask'
                }}
              />
              {t('to')}
              <DatePicker
                style={{ marginLeft: '5px' }}
                allowClear={false}
                value={toDateValue}
                onChange={(value, dateString) => {
                  setToDateValue(value);
                }}
                format={{
                  format: config.dateFormat,
                  type: 'mask'
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={6} md={5}>
            <Search
              placeholder={t('searchByOrderCode')}
              allowClear
              enterButton
              onSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col xs={24}>
            <Table
              size="small"
              rowKey="orderID"
              rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange
              }}
              bordered
              scroll={
                isMobile()
                  ? {
                      x: '100vh',
                      y: '62vh'
                    }
                  : { x: null, y: 'calc(100vh - 260px)' }
              }
              columns={columns}
              dataSource={totalOrders}
              pagination={{
                current: page,
                pageSize: rowsPerPage,
                showSizeChanger: true,
                pageSizeOptions: config?.sizePageOption,
                total: total,
                responsive: true,
                onChange: (page, pageSize) => {
                  setSelectedRowKeys([]);
                  setPage(page);
                  setRowsPerPage(pageSize);
                }
              }}
            ></Table>
          </Col>
        </Row>
      </MainCard>
      <ModalDetailOrder
        handleMenuClick={handleMenuClick}
        roleAccept={roleAccept}
        ItemProp={itemSteps}
        detailOrder={detailOrder}
        open={openModalDetail}
        handleClose={() => {
          setOpenModalDetail(false);
        }}
      />
    </>
  );
};
export default Order;
