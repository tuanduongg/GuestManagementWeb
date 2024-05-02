import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { Table, Row, Col, Button, message, Input, Dropdown, notification, Badge, Modal } from 'antd';
const { Search } = Input;
import { concatNameProductsOnOrder, formatDateFromDB, formattingVND, isMobile, truncateString } from 'utils/helper';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import {
  MoreOutlined,
  CheckOutlined,
  CloseOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
  SignatureOutlined,
  StopOutlined,
  InfoCircleOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';
import config from 'config';
import { TABS_ORDER, getBadgeStatus } from './order.service';
import './order.css';
import ModalDetailOrder from 'components/modal/modal-detail-order/ModalDetailOrder';

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
  const [api] = notification.useNotification();

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
          content: t('deleteProduct'),
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
          content: t('deleteProduct'),
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
    const obj = { page: +page - 1, rowsPerPage, search, type: valueTab };
    const url = RouterAPI.getAllOrder;
    const res = await restApi.post(url, obj);
    setLoading(false);
    if (res?.status === 200) {
      const data = res?.data?.data;
      setTotalOrders(data);
    }
  };
  useEffect(() => {
    getAllOrder();
  }, [valueTab]);
  const columns = [
    {
      align: 'center',
      key: 'index',
      title: '#',
      render: (_, data, index) => <>{(page - 1) * rowsPerPage + index}</>,
      width: isMobile() ? '30px' : '3%'
    },
    {
      align: 'left',
      fixed: 'left',
      key: 'orderNumber',
      title: 'Order number',
      render: (_, data) => (
        <>
          <Button
            onClick={() => {
              setCurrentRow(data);
              setOpenModalDetail(true);
            }}
            style={{ padding: '0px' }}
            type="link"
          >
            {data?.code}
          </Button>
        </>
      ),
      width: isMobile() ? '130px' : '15%'
    },
    {
      align: 'left',
      key: 'product',
      title: 'Product',
      render: (_, data) => <>{concatNameProductsOnOrder(data?.orderDetail, '; ')}</>,
      width: isMobile() ? '130px' : '19%'
    },

    {
      key: 'reciever',
      title: 'Reciever',
      dataIndex: 'reciever',
      align: 'center',
      render: (_, data) => <>{data?.reciever}</>,
      width: isMobile() ? '100px' : '11%'
    },
    {
      key: 'address',
      title: 'deparment',
      dataIndex: 'address',
      align: 'center',
      render: (_, data) => <>{data?.department?.departName}</>,
      width: isMobile() ? '100px' : '19%'
    },
    {
      align: 'center',
      key: 'total',
      title: 'Total',
      dataIndex: 'total',
      render: (_, data) => <>{formattingVND(data?.total)}</>,
      sorter: (a, b) => a?.total - b?.total,
      width: isMobile() ? '100px' : '12%'
    },
    {
      align: 'center',
      key: 'create_at',
      title: 'Ngày tạo',
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
      title: 'Trạng thái',
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
      width: isMobile() ? '50px' : '5%'
    }
  ].map((item) => {
    return { ...item, title: t(item?.title) };
  });

  //   const checkRole = async () => {
  //     setLoading(true);
  //     const rest = await restApi.get(RouterAPI.checkRole);
  //     if (rest?.status === 200) {
  //       setRole(rest?.data);
  //     }
  //     setLoading(false);
  //   };

  //   useEffect(() => {
  //     checkRole();
  //   }, []);

  //   if (!role?.IS_READ) {
  //     return <ForbidenPage />;
  //   }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  return (
    <>
      {contextHolder}
      <Loading loading={loading} />
      <MainCard contentSX={{ p: isMobile() ? 0.5 : 2, minHeight: '83vh' }}>
        <Tabs
          value={valueTab}
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
            console.log('key', key);
            setValueTab(key);
          }}
        />
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
                      y: '65vh'
                    }
                  : { x: null, y: '58vh' }
              }
              columns={columns}
              dataSource={totalOrders}
              pagination={{
                current: page,
                pageSize: rowsPerPage,
                showSizeChanger: true,
                pageSizeOptions: config.sizePageOption,
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
        open={openModalDetail}
        handleClose={() => {
          setOpenModalDetail(false);
        }}
      />
    </>
  );
};
export default Order;
