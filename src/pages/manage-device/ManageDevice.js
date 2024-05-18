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
import { formattingVND, isMobile, truncateString } from 'utils/helper';
import ForbidenPage from 'components/403/ForbidenPage';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import { PlusOutlined, DownOutlined, FilterOutlined, EditOutlined, DeleteOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';
import config from 'config';
import './manage_device.css';

const { Title, Link } = Typography;

const ManageDevice = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listProduct, setListProduct] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentRow, setCurrentRow] = useState(null);
  const inputRef = useRef();
  const [api, contextHolder] = notification.useNotification();

  const columns = [
    {
      align: 'center',
      key: 'index',
      title: '#',
      // fixed: 'left',

      render: (_, data, index) => <>{(page - 1) * rowsPerPage + index + 1}</>,
      width: isMobile() ? '30px' : '5%'
    },
    {
      align: 'left',
      key: 'productName',
      title: 'Tên thiết bị',
      fixed: 'left',

      render: (_, data) => (
        <>
          <Row style={{ display: 'flex', alignItems: 'center' }} gutter={8}>
            <Col xs={24} sm={20} lg={20}>
              <Link onClick={() => { }}>{data?.productName}</Link>
            </Col>
          </Row>
        </>
      ),
      width: isMobile() ? '130px' : '18%'
    },
    {
      align: 'center',
      key: 'price',
      title: 'Loại',
      dataIndex: 'price',
      render: (_, data) => <>{formattingVND(data?.price)}</>,
      sorter: (a, b) => a?.price - b?.price,
      width: isMobile() ? '100px' : '15%'
    },
    {
      key: 'unit',
      title: 'Giá',
      dataIndex: 'unit',
      align: 'center',
      render: (_, data) => <>{data?.unit}</>,
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'inventory',
      title: 'Người sử dụng',
      render: (_, data) => (
        <>
          <span style={{ color: data?.inventory <= 0 ? 'red' : 'rgba(0, 0, 0, 0.88)', fontWeight: data?.inventory <= 0 ? 'bold' : '' }}>
            {data?.inventory}
          </span>
        </>
      ),
      align: 'center',
      sorter: (a, b) => a?.inventory - b?.inventory,
      width: isMobile() ? '100px' : '10%'
    },
    {
      align: 'center',
      key: 'category',
      title: 'Cấu hình',
      filterMode: 'tree',
      filterSearch: true,
      width: isMobile() ? '100px' : '15%'
    },
    {
      align: 'center',
      key: 'expiration_date',
      title: 'Bảo hành',
      filterMode: 'tree',
      filterSearch: true,
      width: isMobile() ? '100px' : '15%'
    },
    {
      key: 'isShow',
      title: 'Trạng thái',
      dataIndex: 'isShow',
      align: 'center',
      render: (_, data) => (
        <>
          {' '}
          <Switch
            onClick={() => { }}
            size="small"
            checkedChildren="Show"
            unCheckedChildren="Hide"
            checked={data?.isShow}
            onChange={onChangeStatus}
          />
        </>
      ),
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'ACTION',
      align: 'center',
      title: '',
      render: (text, data, index) => {
        return <></>;
      },
      width: isMobile() ? '50px' : '5%'
    }
  ].map((item) => {
    return { ...item, title: t(item?.title) };
  });

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
  const handleMenuClick = () => { };
  const menuProps = {
    items: ITEMS,
    onClick: handleMenuClick
  };
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

  //   useEffect(() => {
  //     checkRole();
  //   }, []);

  //   if (!role?.IS_READ) {
  //     return <ForbidenPage />;
  //   }

  const LIST_CARD = [
    {
      xs: 1,
      sm: 1,
      md: 1,
      title: 'Tổng',
      value: '1000',
      color: '#3d0789'
    }
  ]
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
      <Row style={{ marginBottom: '5px', alignItems: 'center' }} gutter={[8, 8]}>
        <Col xs={12} sm={8} md={4}>
          <Card
            style={{
              width: '100%',
              height: '100px'
            }}
            className="card_statistic_device"
          >
            <Row>
              <Col style={{ display: 'flex', alignItems: 'center' }} xs={5}>

                <FundProjectionScreenOutlined style={{ fontSize: '50px' }} />
              </Col>
              <Col xs={19}>
                <div style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>1000</div>
                <div style={{ fontWeight: '500', fontSize: '13px', textAlign: 'center' }}>TỔNG</div>
                <div></div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card
            style={{
              width: '100%',
              height: '100px'
            }}
            className="card_statistic_device"
          >
            <Row>
              <Col style={{ display: 'flex', alignItems: 'center' }} xs={5}>
                {/* <Button type="link" size="large" icon={}></Button> */}

                <FundProjectionScreenOutlined style={{ fontSize: '50px' }} />
              </Col>
              <Col xs={14}>
                <div style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>1000</div>
                <div style={{ fontWeight: '500', fontSize: '13px', textAlign: 'center' }}>ĐANG SỬ DỤNG</div>
                <div></div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card
            style={{
              width: '100%',
              height: '100px'
            }}
            className="card_statistic_device"
          >
            <Row>
              <Col style={{ display: 'flex', alignItems: 'center' }} xs={5}>
                {/* <Button type="link" size="large" icon={}></Button> */}

                <FundProjectionScreenOutlined style={{ fontSize: '50px' }} />
              </Col>
              <Col xs={19}>
                <div style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>1000</div>
                <div style={{ fontWeight: '500', fontSize: '13px', textAlign: 'center' }}>ĐÃ HỎNG</div>
                <div></div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={5}>
          <Card
            style={{
              width: '100%',
              height: '100px'
            }}
            className="card_statistic_device"
          >
            <Row>
              <Col style={{ display: 'flex', alignItems: 'center' }} xs={5}>
                {/* <Button type="link" size="large" icon={}></Button> */}

                <FundProjectionScreenOutlined style={{ fontSize: '50px' }} />
              </Col>
              <Col xs={19}>
                <div style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>1000</div>
                <div style={{ fontWeight: '500', fontSize: '13px', textAlign: 'center' }}>RẢNH</div>
                <div></div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={5}>
          <Card
            style={{
              width: '100%',
              height: '100px'
            }}
            className="card_statistic_device"
          >
            <Row>
              <Col style={{ display: 'flex', alignItems: 'center' }} xs={5}>
                {/* <Button type="link" size="large" icon={}></Button> */}

                <FundProjectionScreenOutlined style={{ fontSize: '50px' }} />
              </Col>
              <Col xs={19}>
                <div style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>1000</div>
                <div style={{ fontWeight: '500', fontSize: '13px', textAlign: 'center' }}>HẾT BẢO HÀNH 04/2024</div>
                <div></div>
              </Col>
            </Row>
          </Card>
        </Col>
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
              <Button onClick={() => { }} style={{ marginRight: '10px' }} icon={<PlusOutlined />} type="primary">
                {t('btn_new')}
              </Button>
              <Dropdown menu={menuProps}>
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
              //   rowKey="productID"
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
              dataSource={[]}
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
    </>
  );
};
export default ManageDevice;
