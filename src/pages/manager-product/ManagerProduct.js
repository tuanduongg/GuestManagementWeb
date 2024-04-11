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
  OneToOneOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';
import config from 'config';
import { urlFallBack } from './manager-product.service';

const { Title, Link } = Typography;
import './manager-product.css';
import ModalAddProduct from 'components/modal/modal-add-product/ModalAddProduct';
import ModalCategory from 'components/modal/category/ModalCategory';
import ModalUnit from 'components/modal/modal-unit/ModalUnit';

const ManagerProduct = () => {
  const [role, setRole] = useState(null);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [openModalUnit, setOpenModalUnit] = useState(false);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [listProduct, setListProduct] = useState([]);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [typeModal, setTypeModal] = useState('');
  const [currentRow, setCurrentRow] = useState(null);

  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'importExcel':
        break;
      case 'cancel':
        break;
      case 'unit':
        setOpenModalUnit(true);
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
      case 'edit':
        setTypeModal('EDIT');
        setOpenModalAdd(true);
        break;

      default:
        break;
    }
  };
  const getAllUnit = async () => {
    const res = await restApi.get(RouterAPI.getAllUnit);
    if (res?.status === 200) {
      setUnits(res?.data);
    }
  };
  const getAllCategory = async () => {
    const res = await restApi.get(RouterAPI.getAllCategory);
    if (res?.status === 200) {
      setCategories(res?.data);
    }
  };
  const getAllProduct = async () => {
    setLoading(true);
    const obj = { page, rowsPerPage, search };
    const url = RouterAPI.getAllProduct;
    const res = await restApi.post(url, obj);
    if (res?.status === 200) {
      setLoading(false);
      const data = res?.data;
      setTotal(data?.count);
      setListProduct(data?.data);
    } else {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllProduct();
    getAllCategory();
    getAllUnit();
  }, []);
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
  const ITEMROWS = [
    {
      label: 'Sửa',
      key: 'edit',
      icon: <EditOutlined />,
      disabled: false
    },
    {
      label: 'Delete',
      key: 'delete',
      icon: <DeleteOutlined />,
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
          <Row style={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile() && (
              <Col xs={4}>
                <Image
                  width={50}
                  height={50}
                  src={data?.images[0] ? config.urlImageSever + data?.images[0]?.url : ''}
                  fallback={urlFallBack}
                />
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
      width: isMobile() ? '130px' : '35%'
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
      key: 'unitName',
      title: 'Đơn vị',
      dataIndex: 'unitName',
      align: 'center',
      render: (_, data) => <>{data?.unit?.unitName}</>,
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
      align: 'center',
      key: 'category',
      title: 'Danh mục',
      render: (_, data) => <>{data?.category?.categoryName}</>,
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
            <Dropdown trigger={['click']} placement="left" menu={menuPropsRow}>
              <Button
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
  const onAfterSaveProduct = () => {
    getAllProduct();
  };
  const onCloseModalCategory = () => {
    setOpenModalCategory(false);
  };
  const afterDeleteImage = (product, image) => {
    const data = listProduct.map((item) => {
      if (item?.productID === product) {
        return {
          ...item,
          images: item.images.filter((img) => img.imageID !== image)
        };
      }
      return item;
    });
    setListProduct(data);
  };
  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
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
                setTypeModal('ADD');
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
              dataSource={listProduct}
              pagination={true}
            ></Table>
          </Col>
        </Row>
      </MainCard>
      <ModalAddProduct
        currentRow={currentRow}
        afterDeleteImage={afterDeleteImage}
        typeModal={typeModal}
        setLoading={setLoading}
        listUnit={units}
        open={openModalAdd}
        handleClose={() => {
          setOpenModalAdd(false);
        }}
        categories={categories}
        onAfterSave={onAfterSaveProduct}
      />
      <ModalCategory open={openModalCategory} handleClose={onCloseModalCategory} />
      <ModalUnit
        open={openModalUnit}
        handleClose={() => {
          setOpenModalUnit(false);
        }}
      />
    </>
  );
};
export default ManagerProduct;
