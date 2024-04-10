import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { Table, Row, Col, Typography, Segmented, Space, Button, message, Modal, Input, Dropdown, Select, Switch, Image } from 'antd';
const { Search } = Input;
import { isMobile, truncateString } from 'utils/helper';
import ForbidenPage from 'components/403/ForbidenPage';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import {
  PlusOutlined,
  DownOutlined,
  CloseOutlined,
  MoreOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  FunnelPlotOutlined,
  BarsOutlined,
  OneToOneOutlined
} from '@ant-design/icons';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';
import config from 'config';
import { ITEMROWS, urlFallBack } from './manager-product.service';

const { Title, Link } = Typography;
import './manager-product.css';
import ModalAddProduct from 'components/modal/modal-add-product/ModalAddProduct';
import ModalCategory from 'components/modal/category/ModalCategory';
const ManagerProduct = () => {
  const [role, setRole] = useState(null);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModalCategory, setOpenModalCategory] = useState(false);

  const { t } = useTranslation();

  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'importExcel':
        break;
      case 'cancel':
        break;
      case 'exportExcel':
        Modal.confirm({
          title: t('msg_notification'),
          content: t('msg_confirm_export'),
          okText: t('yes'),
          cancelText: t('close'),
          centered: true,
          icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
          onOk: async () => {}
        });
        break;
      case 'catgory':
        setOpenModalCategory(true);
        break;

      default:
        break;
    }
  };
  const ITEMS = [
    {
      label: 'Danh mục',
      key: 'catgory',
      icon: <BarsOutlined />,
      disabled: false
    },
    {
      label: 'Đơn vị',
      key: 'unit',
      icon: <OneToOneOutlined />,
      disabled: false
    },
    {
      type: 'divider'
    },
    {
      label: 'Import Excel',
      key: 'importExcel',
      icon: <ImportOutlined />,
      disabled: false
    },
    {
      label: 'Delete',
      key: 'cancel',
      icon: <CloseOutlined />,
      disabled: false,
      danger: true
    }
  ];
  const menuProps = {
    items: ITEMS,
    onClick: handleMenuClick
  };
  const menuPropsRow = {
    items: ITEMROWS,
    onClick: handleMenuClick
  };

  const columns = [
    {
      align: 'left',
      key: 'productName',
      title: 'Tên sản phẩm',
      fixed: 'left',

      render: (_, data) => (
        <>
          <Row>
            {!isMobile() && (
              <Col xs={4}>
                <Image width={50} height={50} src={data?.images} fallback={urlFallBack} />
              </Col>
            )}
            <Col xs={24} sm={20}>
              <Link style={{ marginLeft: '5px' }} onClick={() => {}}>
                {data?.productName}
              </Link>
            </Col>
          </Row>
        </>
      ),
      filters: [],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {},
      width: isMobile() ? '130px' : '50%'
    },
    {
      align: 'center',
      key: 'price',
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => {
        console.log('a', a);
      },
      width: isMobile() ? '100px' : '15%'
    },
    {
      key: 'unitID',
      title: 'Đơn vị',
      dataIndex: 'unitID',
      align: 'center',
      render: (_, data) => <>{data?.unitID}</>,
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'inventory',
      title: 'Tồn Kho',
      dataIndex: 'inventory',
      align: 'center',
      filters: [],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {},
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'isShow',
      title: 'Hiển Thị',
      dataIndex: 'isShow',
      align: 'center',
      render: (_, data) => (
        <>
          {' '}
          <Switch size="small" checkedChildren="On" unCheckedChildren="Off" checked={data?.isShow} onChange={() => {}} />
        </>
      ),
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'ACTION',
      align: 'center',
      title: '',
      render: (text, data, index) => {
        return (
          <>
            <Dropdown placement="left" menu={menuPropsRow}>
              <Button type="text" icon={<MoreOutlined />}></Button>
            </Dropdown>
          </>
        );
      },
      width: isMobile() ? '50px' : '5%'
    }
  ].map((item) => {
    return { ...item, title: t(item?.title) };
  });

  const data = [
    {
      productID: '1',

      productName: 'Giấy A4',

      price: '15000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '11',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '2',

      productName: 'Trong xuất bản và thiết kế đồ họa',

      price: '25000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '5',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '3',

      productName: 'Giấy A4 3',

      price: '55000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '12',

      unitID: 'Kg',

      isShow: false,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '1',

      productName: 'Giấy A4',

      price: '15000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '11',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '2',

      productName: 'Trong xuất bản và thiết kế đồ họa',

      price: '25000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '5',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '3',

      productName: 'Giấy A4 3',

      price: '55000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '12',

      unitID: 'Kg',

      isShow: false,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '1',

      productName: 'Giấy A4',

      price: '15000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '11',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '2',

      productName: 'Trong xuất bản và thiết kế đồ họa',

      price: '25000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '5',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '3',

      productName: 'Giấy A4 3',

      price: '55000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '12',

      unitID: 'Kg',

      isShow: false,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '1',

      productName: 'Giấy A4',

      price: '15000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '11',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '2',

      productName: 'Trong xuất bản và thiết kế đồ họa',

      price: '25000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '5',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '3',

      productName: 'Giấy A4 3',

      price: '55000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '12',

      unitID: 'Kg',

      isShow: false,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '1',

      productName: 'Giấy A4',

      price: '15000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '11',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '2',

      productName: 'Trong xuất bản và thiết kế đồ họa',

      price: '25000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '5',

      unitID: 'Kg',

      isShow: true,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    },
    {
      productID: '3',

      productName: 'Giấy A4 3',

      price: '55000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '12',

      unitID: 'Kg',

      isShow: false,

      images: 'https://i.stack.imgur.com/DzAkj.png'
    }
  ];

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

  const onCloseModalCategory = () => {
    setOpenModalCategory(false);
  };
  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
      <Row>
        <Col style={{ marginTop: '5px' }} span={24}>
          <Title level={5}>{t('Quản lý sản phẩm')}</Title>
        </Col>
      </Row>
      <MainCard contentSX={{ p: isMobile() ? 0.5 : 2, minHeight: '83vh' }}>
        <Row>
          <Col xs={24} sm={15} style={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile() && <FunnelPlotOutlined style={{ fontSize: '20px', color: config.colorLogo }} />}
            {<div style={{ fontWeight: 'bold', margin: '0px 5px', minWidth: '71px' }}>Danh mục:</div>}
            <Select
              defaultValue="lucy"
              onChange={() => {}}
              style={{ width: isMobile() ? '30%' : '150px' }}
              options={[
                {
                  value: 'jack',
                  label: 'Văn phòng phẩm'
                },
                {
                  value: 'lucy',
                  label: 'Phục vụ sản xuất'
                },
                {
                  value: 'Yiminghe',
                  label: 'yiminghe'
                }
              ]}
            />
            <Search
              placeholder="Tên sản phẩm..."
              allowClear
              enterButton
              style={{ width: isMobile() ? '50%' : '200px', marginLeft: '5px' }}
              onSearch={(value) => {
                alert(value);
              }}
            />
          </Col>
          <Col
            xs={24}
            sm={9}
            style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: isMobile() ? '5px' : '0px' }}
          >
            <Button
              shape="round"
              onClick={() => {
                setOpenModalAdd(true);
              }}
              style={{ marginRight: '5px' }}
              icon={<PlusOutlined />}
              type="primary"
            >
              {t('createBTN')}
            </Button>
            <Dropdown menu={menuProps}>
              <Button style={{ marginLeft: '5px' }} shape="round" icon={<DownOutlined />}>
                More
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <Col xs={24}>
            <Table
              size="small"
              rowKey="productID"
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
                  : { x: null, y: '55vh' }
              }
              columns={columns}
              dataSource={data}
              pagination={true}
            ></Table>
          </Col>
        </Row>
      </MainCard>
      <ModalAddProduct
        open={openModalAdd}
        handleClose={() => {
          setOpenModalAdd(false);
        }}
      />
      <ModalCategory open={openModalCategory} handleClose={onCloseModalCategory} />
    </>
  );
};
export default ManagerProduct;
