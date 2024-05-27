/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import {
  Table,
  Row,
  Col,
  Typography,
  Segmented,
  Space,
  Button,
  message,
  Modal,
  Input,
  Dropdown,
  Select,
  Switch,
  Image,
  notification,
  Card
} from 'antd';
const { Search } = Input;
import { formatDateFromDB, formattingVND, isMobile, truncateString } from 'utils/helper';
import ForbidenPage from 'components/403/ForbidenPage';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import {
  PlusOutlined,
  DownOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  FundProjectionScreenOutlined,
  ToolOutlined,
  HistoryOutlined,
  FundViewOutlined,
  PicCenterOutlined,
  CaretDownOutlined,
  MoreOutlined,
  WarningOutlined,
  ImportOutlined,
  CloseOutlined,
  ExportOutlined
} from '@ant-design/icons';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';
import config from 'config';
import './manage_device.css';
import { FONT_SIZE_ICON_CARD, ITEM_DROPDOWN_STATUS, TYPE_FILTER } from './manage_device.service';
import ModalAddDevice from 'components/modal/modal-add-device/ModalAddDevice';
const { Title, Link } = Typography;
const ITEMROWS = [
  {
    label: <span style={{ color: '#15803d' }}>Đang dùng</span>,
    key: TYPE_FILTER.USING,
    disabled: false,
    color: '#15803d'
  },
  {
    label: <span style={{ color: '#818cf8' }}>Rảnh</span>,
    key: TYPE_FILTER.FREE,
    disabled: false,
    color: '#818cf8'
  },
  {
    label: <span style={{ color: '#4a044e' }}>Đang sửa</span>,
    key: TYPE_FILTER.FIXING,
    disabled: false,
    color: '#4a044e'
  },
  {
    label: <span style={{ color: '#dc2626' }}>Đã hỏng</span>,
    key: TYPE_FILTER.NONE,
    disabled: false,
    color: '#dc2626'
  }
];

const ITEMROWS_MORE = [
  {
    label: 'Xuất excel',
    key: 'EXPORT',
    icon: <ExportOutlined />
  },
  {
    type: 'divider'
  },
  {
    label: 'Nhập excel',
    key: 'IMPORT',
    icon: <ImportOutlined />
  },
  {
    type: 'divider'
  },
  {
    label: 'Xóa',
    key: 'DELETE',
    icon: <CloseOutlined />,
    danger: true
  }
];

const ManageDevice = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [categories, setCategories] = useState([]);
  const [devices, setDevices] = useState([]);
  const [statistic, setStatistic] = useState({});
  const [currentDropdown, setCurrentDropdown] = useState('');
  const [currentRow, setCurrentRow] = useState({});
  const [typeModal, setTypeModal] = useState('ADD');
  const [detailDevice, setDetailDevice] = useState({});
  const [api, contextHolder] = notification.useNotification();

  const ITEM_CELL_ACTION = [
    {
      label: t('btnEdit'),
      key: 'edit',
      icon: <EditOutlined />,
      disabled: false
    },
    {
      label: t('delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
      disabled: false,
      danger: true
    }
  ];
  const getDetailDevice = async () => {
    setLoading(true);
    const res = await restApi.post(RouterAPI.detailDevice, { DEVICE_ID: currentRow?.DEVICE_ID });
    setLoading(false);
    if (res?.status === 200) {
      setDetailDevice(res?.data);
      setOpenModalAdd(true);
    } else {
      message.error('Get info device fail!');
    }
  };
  const menuPropsCellAction = {
    items: ITEM_CELL_ACTION,
    onClick: (e) => {
      switch (e?.key) {
        case 'edit':
          setTypeModal('EDIT');
          getDetailDevice();
          break;
        case 'delete':
          break;

        default:
          break;
      }
    }
  };
  const handleMenuClick = async (e) => {
    setLoading(true);
    const status = e?.key;
    const res = await restApi.post(RouterAPI.changeStatusDevice, { DEVICE_ID: currentDropdown, STATUS: status });
    setLoading(false);
    if (res?.status === 200) {
      message.success('Change status device successful!');
      getAllDevice();
      getStatistic();
    }
  };
  const handleMenuClickMore = async (e) => {
    console.log(e.key);
  };
  const menuProps = {
    items: ITEMROWS,
    onClick: handleMenuClick
  };
  const menuPropsMore = {
    items: ITEMROWS_MORE,
    onClick: handleMenuClickMore
  };

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
      key: 'NAME',
      title: 'Tên thiết bị',
      fixed: 'left',
      render: (_, data) => (
        <>
          <Row style={{ display: 'flex', alignItems: 'center' }} gutter={8}>
            <Col xs={24} sm={20} lg={20}>
              <Link onClick={() => { }}>{data?.NAME}</Link>
            </Col>
          </Row>
        </>
      ),
      width: isMobile() ? '130px' : '18%'
    },
    {
      align: 'center',
      key: 'categoryID',
      title: 'Loại thiết bị',
      render: (_, data) => <>{data?.category?.categoryName}</>,
      width: isMobile() ? '100px' : '15%'
    },
    {
      key: 'PRICE',
      title: 'Giá',
      dataIndex: 'PRICE',
      align: 'center',
      render: (_, data) => <>{data?.PRICE}</>,
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'userfulname',
      title: 'Người sử dụng',
      render: (_, data) => <>{data?.USER_FULLNAME}</>,
      align: 'center',
      // sorter: (a, b) => a?.inventory - b?.inventory,
      width: isMobile() ? '100px' : '10%'
    },
    {
      align: 'center',
      key: 'category',
      title: 'Ngày mua',
      filterMode: 'tree',
      filterSearch: true,
      render: (_, data) => <>{formatDateFromDB(data?.BUY_DATE, false)}</>,
      width: isMobile() ? '100px' : '10%'
    },
    {
      align: 'center',
      key: 'expiration_date',
      title: 'Ngày hết bảo hành',
      filterMode: 'tree',
      filterSearch: true,
      render: (_, data) => <>{formatDateFromDB(data?.EXPIRATION_DATE, false)}</>,
      width: isMobile() ? '100px' : '15%'
    },
    {
      key: 'isShow',
      title: 'Trạng thái',
      dataIndex: 'isShow',
      align: 'center',
      render: (_, data) => {
        let color = '';
        if (data?.STATUS) {
          color = ITEMROWS.find((card) => card.key === data?.STATUS)?.color;
        }
        return (
          <>
            <Dropdown trigger={['click']} placement="bottom" menu={menuProps}>
              <Button
                style={{ color: color, borderColor: color }}
                icon={<CaretDownOutlined />}
                iconPosition="end"
                shape="round"
                size="small"
                onClick={() => {
                  setCurrentDropdown(data?.DEVICE_ID);
                }}
              // type="primary"
              >
                {data?.STATUS ? ITEMROWS.find((item) => item.key === data?.STATUS)?.label : ''}
              </Button>
            </Dropdown>
          </>
        );
      },
      width: isMobile() ? '150px' : '15%'
    },
    {
      key: 'ACTION',
      align: 'center',
      title: '',
      render: (text, data, index) => {
        return (
          <>
            <Dropdown trigger={['click']} placement="bottom" menu={menuPropsCellAction}>
              <Button
                onClick={() => {
                  setCurrentRow(data);
                  setCurrentDropdown(data?.DEVICE_ID);
                }}
                icon={<MoreOutlined />}
                type={'text'}
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

  const getListCategory = async () => {
    const rest = await restApi.post(RouterAPI.findByTypeCategory, { type: 'DEVICE' });
    if (rest?.status === 200) {
      setCategories(rest?.data);
    }
  };
  const getAllDevice = async () => {
    setLoading(true);
    const rest = await restApi.post(RouterAPI.allDevice);
    setLoading(false);
    if (rest?.status === 200) {
      setDevices(rest?.data);
    }
  };
  const handleCloseModalAdd = () => {
    setTypeModal('ADD');
    setCurrentDropdown('');
    setCurrentRow({});
    setOpenModalAdd(false);
  };

  const ITEMS = [
    {
      label: t('btnEdit'),
      key: 'edit',
      icon: <EditOutlined />,
      disabled: false
    },
    {
      label: t('delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
      disabled: false,
      danger: true
    }
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  //   const checkRole = async () => {
  //     setLoading(true);
  //     const rest = await restApi.get(RouterAPI.checkRole);
  //     if (rest?.status === 200) {
  //       setRole(rest?.data);
  //     }
  //     setLoading(false);
  //   };

  const getStatistic = async () => {
    const res = await restApi.get(RouterAPI.statisticDevice);
    if (res?.status === 200) {
      setStatistic(res?.data);
    }
  };

  useEffect(() => {
    // checkRole();
    getStatistic();
    getListCategory();
    getAllDevice();
  }, []);

  //   if (!role?.IS_READ) {
  //     return <ForbidenPage />;
  //   }

  const LIST_CARD = [
    {
      id: TYPE_FILTER?.SUM,
      xs: 12,
      sm: 8,
      md: 4,
      title: 'TỔNG',
      value: statistic?.total,
      color: '#0284c7',
      icon: <PicCenterOutlined style={{ fontSize: FONT_SIZE_ICON_CARD, color: '#0284c7' }} />,
      onclick: () => {
        setFilterValue('SUM');
      }
    },
    {
      id: TYPE_FILTER?.USING,
      xs: 12,
      sm: 8,
      md: 4,
      title: 'ĐANG SỬ DỤNG',
      value: statistic?.statuses?.USING,
      color: '#15803d',
      icon: <FundProjectionScreenOutlined style={{ fontSize: FONT_SIZE_ICON_CARD, color: '#15803d' }} />,
      onclick: () => {
        setFilterValue('USING');
      }
    },

    {
      id: TYPE_FILTER?.FREE,
      xs: 12,
      sm: 8,
      md: 4,
      title: 'RẢNH',
      value: statistic?.statuses?.FREE,
      color: '#818cf8',
      icon: <FundViewOutlined style={{ fontSize: FONT_SIZE_ICON_CARD, color: '#818cf8' }} />,
      onclick: () => {
        setFilterValue('FREE');
      }
    },
    {
      id: TYPE_FILTER?.FIXING,
      xs: 12,
      sm: 8,
      md: 4,
      title: 'ĐANG SỬA CHỮA',
      value: statistic?.statuses?.FIXING,
      color: '#4a044e',
      icon: <ToolOutlined style={{ fontSize: FONT_SIZE_ICON_CARD, color: '#4a044e' }} />,
      onclick: () => {
        setFilterValue('FIXING');
      }
    },
    {
      id: TYPE_FILTER?.FIXING,
      xs: 12,
      sm: 8,
      md: 4,
      title: 'ĐÃ HỎNG',
      value: statistic?.statuses?.NONE,
      color: '#dc2626',
      icon: <WarningOutlined style={{ fontSize: FONT_SIZE_ICON_CARD, color: '#dc2626' }} />,
      onclick: () => {
        setFilterValue('FIXING');
      }
    },
    {
      id: TYPE_FILTER?.EXIPRATION_DATE,
      xs: 12,
      sm: 8,
      md: 4,
      title: 'HẾT BẢO HÀNH 05/2024',
      value: statistic?.expirationCount,
      color: '#f59e0b',
      icon: <HistoryOutlined style={{ fontSize: FONT_SIZE_ICON_CARD, color: '#f59e0b' }} />,
      onclick: () => {
        setFilterValue('EXIPRATION_DATE');
      }
    }
  ];
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
      <Row style={{ marginBottom: '5px', alignItems: 'center' }} gutter={[4, 4]}>
        {LIST_CARD?.map((col, index) => (
          <Col key={col?.id} xs={col?.xs} sm={col?.sm} md={col?.md}>
            <Card
              onClick={col?.onclick}
              style={{
                width: '100%',
                height: '100px'
              }}
              className="card_statistic_device"
            >
              <Row>
                <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} xs={10}>
                  {col?.icon}
                </Col>
                <Col xs={14}>
                  <div style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center', color: `${col?.color}` }}>{col?.value}</div>
                  <div style={{ fontWeight: '700', fontSize: '12px', textAlign: 'center' }}>{col?.title}</div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      <MainCard contentSX={{ p: isMobile() ? 0.5 : 2, minHeight: '83vh' }}>
        <Row gutter={8}>
          <Col xs={0} sm={5} md={3}>
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              onChange={handleChange}
              options={[
                {
                  label: '-Loại thiết bị-',
                  value: 'all'
                },
                {
                  value: 'PC',
                  label: 'PC'
                },
                {
                  value: 'Printer',
                  label: 'Printer'
                },
                {
                  value: 'Router',
                  label: 'Router'
                }
              ]}
            />
          </Col>
          <Col xs={0} sm={5} md={3}>
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              onChange={handleChange}
              options={[
                {
                  value: 'all',
                  label: '-Trạng thái-'
                },
                {
                  label: 'Đang sử dụng',
                  value: 'using'
                },
                {
                  label: 'Rảnh',
                  value: 'free'
                },
                {
                  label: 'Đang sửa chữa',
                  value: 'fixing'
                },
                {
                  label: 'Đã hỏng ',
                  value: 'none'
                }
              ]}
            />
          </Col>
          <Col xs={0} sm={5} md={3}>
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              onChange={handleChange}
              options={[
                {
                  value: 'all',
                  label: '-Bảo hành-'
                },
                {
                  value: 'end_expiration',
                  label: 'Sắp hết hạn'
                },
                {
                  value: 'end_expiration',
                  label: 'Đã hết hạn'
                },
                {
                  value: 'in_expiration',
                  label: 'Còn hạn'
                }
              ]}
            />
          </Col>
          <Col xs={0} sm={5} md={6}>
            <Search style={{ maxWidth: '300px' }} placeholder="Tên thiết bị..." allowClear enterButton="Search" onSearch={() => { }} />
          </Col>
          <Col xs={24} sm={4} md={9}>
            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
              {isMobile() && (
                <Button onClick={() => { }} style={{ marginRight: '5px' }} icon={<FilterOutlined />}>
                  Bộ lọc
                </Button>
              )}
              <Button
                onClick={() => {
                  setTypeModal('ADD');
                  setOpenModalAdd(true);
                }}
                style={{ marginRight: '10px' }}
                icon={<PlusOutlined />}
                type="primary"
              >
                {t('btn_new')}
              </Button>
              <Dropdown menu={menuPropsMore}>
                <Button style={{ marginLeft: '5px' }} icon={<DownOutlined />}>
                  {t('btnMore')}
                </Button>
              </Dropdown>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col xs={24}>
            <Table
              size="small"
              rowKey="DEVICE_ID"
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
                  : { x: null, y: 'calc(100vh - 230px)' }
              }
              columns={columns}
              dataSource={devices}
            //   pagination={{
            //     current: page,
            //     pageSize: rowsPerPage,
            //     showSizeChanger: true,
            //     pageSizeOptions: config.sizePageOption,
            //     total: total,
            //     showTotal: (total, range) => `${range[0]}-${range[1]}/${total}`,
            //     responsive: true,
            //     onChange: (page, pageSize) => {
            //       setSelectedRowKeys([]);
            //       setPage(page);
            //       setRowsPerPage(pageSize);
            //     }
            //   }}
            ></Table>
          </Col>
        </Row>
      </MainCard>
      <ModalAddDevice
        typeModal={typeModal}
        currentRow={detailDevice}
        getAllData={getAllDevice}
        getStatistic={getStatistic}
        setLoading={setLoading}
        open={openModalAdd}
        categories={categories}
        handleClose={handleCloseModalAdd}
      />
    </>
  );
};
export default ManageDevice;
