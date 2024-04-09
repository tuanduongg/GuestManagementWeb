import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { Table, Row, Col, Typography, Segmented, Flex, Button, message, Modal, Input, Dropdown, Select } from 'antd';
const { Search } = Input;
import { isMobile } from 'utils/helper';
import ForbidenPage from 'components/403/ForbidenPage';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import {
  PlusOutlined,
  DownOutlined,
  CloseOutlined,
  UploadOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  FunnelPlotOutlined
} from '@ant-design/icons';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';
import config from 'config';

const { Title, Link } = Typography;

const ManagerProduct = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { t } = useTranslation();

  const columns = [
    {
      align: 'left',
      key: 'productName',
      title: 'Tên sản phẩm',
      fixed: 'left',

      render: (_, data) => (
        <>
          <Link onClick={() => {}}>{data?.productName}</Link>
        </>
      ),
      filters: [],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {}
    },
    {
      align: 'left',
      key: 'price',
      title: 'Giá',
      dataIndex: 'price',
      filters: [],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {}
    },
    {
      key: 'inventory',
      title: 'Tồn Kho',
      dataIndex: 'inventory',
      align: 'center',
      filters: [],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => {}
    },
    {
      key: 'unitID',
      title: 'Đơn vị',
      dataIndex: 'unitID',
      align: 'center',
      render: (_, data) => <>{data?.unitID}</>
    },
    {
      key: 'isShow',
      title: 'Hiển Thị',
      dataIndex: 'isShow',
      align: 'center'
    },
    {
      key: 'ACTION',
      align: 'center',
      title: 'action_col',
      fixed: 'right',
      render: (text, data, index) => {
        return (
          <>
            {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
            <Button onClick={() => {}} size="small" type="link" shape="circle">
              more
            </Button>
            {/* </div> */}
          </>
        );
      }
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

      images: []
    },
    {
      productID: '2',

      productName: 'Giấy A4 2',

      price: '25000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '5',

      unitID: 'Kg',

      isShow: true,

      images: []
    },
    {
      productID: '3',

      productName: 'Giấy A4 3',

      price: '55000',

      inventory: 52,

      description: 'giấy A4 đẹp xịn xò con bò',

      categoryID: '12',

      unitID: 'Kg',

      isShow: true,

      images: []
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

      default:
        break;
    }
  };
  const ITEMS = [
    {
      label: 'Import Excel',
      key: 'importExcel',
      icon: <ImportOutlined />,
      disabled: false
    },
    {
      label: 'Canel',
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
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
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
          <Col xs={24} sm={12}>
            <Row gutter={8}>
              <Col xs={12} sm={10} style={{ display: 'flex', alignItems: 'center' }}>
                {!isMobile() && <FunnelPlotOutlined style={{ fontSize: '20px', color: config.colorLogo }} />}
                {<div style={{ fontWeight: 'bold', margin: '0px 5px' }}>Danh mục:</div>}
                <Select
                  defaultValue="lucy"
                  onChange={() => {}}
                  style={{ width: isMobile() ? '100%' : '50%' }}
                  options={[
                    {
                      value: 'jack',
                      label: 'Jack'
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy'
                    },
                    {
                      value: 'Yiminghe',
                      label: 'yiminghe'
                    },
                    {
                      value: 'disabled',
                      label: 'Disabled',
                      disabled: true
                    }
                  ]}
                />
              </Col>
              <Col style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }} xs={12} sm={10}>
                <Search
                  placeholder="input search text"
                  allowClear
                  onSearch={(value) => {
                    alert(value);
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col
            xs={24}
            sm={12}
            style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: isMobile() ? '5px' : '0px' }}
          >
            <Button shape="round" onClick={() => {}} style={{ marginRight: '5px' }} icon={<PlusOutlined />} type="primary">
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
                      y: '100vh'
                    }
                  : null
              }
              columns={columns}
              dataSource={data}
              pagination={true}
            ></Table>
          </Col>
        </Row>
      </MainCard>
    </>
  );
};
export default ManagerProduct;
