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
  Checkbox
} from 'antd';
const { Search } = Input;
import { formattingVND, isMobile, truncateString } from 'utils/helper';
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
import ExcelJS from 'exceljs';

const ManagerProduct = () => {
  const [role, setRole] = useState(null);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModalCategory, setOpenModalCategory] = useState(false);
  const [openModalUnit, setOpenModalUnit] = useState(false);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listProduct, setListProduct] = useState([]);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCatgory] = useState('');
  const [typeModal, setTypeModal] = useState('');
  const [currentRow, setCurrentRow] = useState(null);
  const [inventoryNegative, setInventoryNegative] = useState(false);
  const [filterCategory, setFilterCategory] = useState([]);
  const inputRef = useRef();
  const [api, contextHolder] = notification.useNotification();

  const getAllProduct = async () => {
    setLoading(true);
    const obj = { page: +page - 1, rowsPerPage, search, categoryID: selectCategory, inventoryNegative };
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
  /**
   *
   * @param  data array string ids
   */
  const handleClickDeleteAll = async (data) => {
    const res = await restApi.post(RouterAPI.deleteProducts, { productIDs: data });
    if (res?.status === 200) {
      message.success('Delete successful');
      getAllProduct();
    } else {
      message.error(res?.data?.message ?? 'Delete fail!');
    }
  };
  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'importExcel':
        inputRef?.current?.click();
        break;
      case 'delete':
        Modal.confirm({
          title: t('msg_notification'),
          content: t('deleteProduct'),
          okText: t('yes'),
          cancelText: t('close'),
          centered: true,
          icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
          onOk: async () => {
            handleClickDeleteAll([currentRow?.productID]);
          }
        });
        break;
      case 'deleteAll':
        Modal.confirm({
          title: t('msg_notification'),
          content: t('deleteProduct'),
          okText: t('yes'),
          cancelText: t('close'),
          centered: true,
          icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
          onOk: async () => {
            handleClickDeleteAll(selectedRowKeys);
          }
        });
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
  const onClickSwitch = async (data) => {
    if (data) {
      const rest = await restApi.post(RouterAPI.changePublicProduct, {
        productID: data?.productID
      });
      if (rest?.status === 200) {
        const dataNew = listProduct.map((item) => {
          if (item?.productID === data?.productID) {
            return { ...item, isShow: rest?.data?.isShow };
          }
          return item;
        });
        setListProduct(dataNew);
        message.success('Change status successful!');
        return;
      }
      message.error(rest?.data?.message ?? 'Change status fail!');
    }
  };
  const onChangeStatus = async (checked) => {};
  const getAllCategory = async () => {
    const res = await restApi.get(RouterAPI.getAllCategory);
    if (res?.status === 200) {
      setCategories(res?.data);
    }
  };
  const openNotificationWithIcon = (description) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="link" size="small" onClick={() => api.destroy()}>
          Clear All
        </Button>
      </Space>
    );
    api['error']({
      message: 'Thông báo',
      description: description,
      placement: 'bottomRight',
      duration: 0,
      btn
    });
  };

  const handleSave = async (data) => {
    const rest = await restApi.post(RouterAPI.upLoadExcelProduct, data);
    console.log('rest', rest);
  };

  const handleFileUploadExcel = async (event) => {
    const file = event.target.files[0];
    event.target.value = '';

    // Ensure a file is selected
    if (!file) {
      return;
    }
    if (file?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      message.error('Không đúng định dạng file excel');
      return;
    }
    var formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    const rest = await restApi.post(RouterAPI.upLoadExcelProduct, formData);
    setLoading(false);
    if (rest?.status === 200) {
      message.success('Upload thành công!');
      getAllProduct();
    } else {
      message.error(rest?.data?.message || 'Upload excel fail!');
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    const arr = [];
    if (listProduct?.length > 0) {
      listProduct?.forEach((item) => {
        const categoryName = item?.category?.categoryName;
        const categoryID = item?.category?.categoryID;
        if (!arr.some((entry) => entry.value === categoryID)) {
          arr.push({
            text: categoryName,
            value: categoryID
          });
        }
      });
    }
    setFilterCategory(arr);
  }, [listProduct]);

  useEffect(() => {
    getAllProduct();
  }, [page, rowsPerPage, search, selectCategory, inventoryNegative]);

  const ITEMS = [
    {
      label: t('category'),
      key: 'catgory',
      icon: <BarsOutlined />,
      disabled: false,
      hidden: false
    },
    {
      type: 'divider'
    },
    {
      label: t('importExcel'),
      key: 'importExcel',
      icon: <ImportOutlined />,
      disabled: false,
      hidden: false
    },
    {
      label: t('delete'),
      key: 'deleteAll',
      icon: <CloseOutlined />,
      disabled: selectedRowKeys?.length === 0,
      danger: true,
      hidden: false
    }
  ].filter((item) => !item.hidden);
  //action of row on table
  const ITEMROWS = [
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
  const menuProps = {
    items: ITEMS,
    onClick: handleMenuClick
  };
  const menuPropsRow = {
    items: ITEMROWS,
    onClick: handleMenuClick
  };
  // số thứ tự = (trang_hiện_tại - 1) * số_bản_ghi_trên_mỗi_trang + số_đang_xem
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
      title: 'product',
      fixed: 'left',

      render: (_, data) => (
        <>
          <Row style={{ display: 'flex', alignItems: 'center' }} gutter={8}>
            {!isMobile() && (
              <Col xs={4} lg={4}>
                <Image
                  width={'100%'}
                  height={50}
                  src={data?.images[0] ? config.urlImageSever + data?.images[0]?.url : ''}
                  fallback={urlFallBack}
                />
              </Col>
            )}
            <Col xs={24} sm={20} lg={20}>
              <Link
                onClick={() => {
                  setCurrentRow(data);
                  setTypeModal('EDIT');
                  setOpenModalAdd(true);
                }}
              >
                {data?.productName}
              </Link>
            </Col>
          </Row>
        </>
      ),
      width: isMobile() ? '130px' : '33%'
    },
    {
      align: 'center',
      key: 'price',
      title: 'price',
      dataIndex: 'price',
      render: (_, data) => <>{formattingVND(data?.price)}</>,
      sorter: (a, b) => a?.price - b?.price,
      width: isMobile() ? '100px' : '15%'
    },
    {
      key: 'unit',
      title: 'unit',
      dataIndex: 'unit',
      align: 'center',
      render: (_, data) => <>{data?.unit}</>,
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'inventory',
      title: 'inventory',
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
      title: 'categoryProduct',
      filters: filterCategory,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.category?.categoryID === value,
      render: (_, data) => <>{data?.category?.categoryName}</>,
      width: isMobile() ? '100px' : '15%'
    },
    {
      key: 'isShow',
      title: 'status_col',
      dataIndex: 'isShow',
      align: 'center',
      render: (_, data) => (
        <>
          {' '}
          <Switch
            onClick={() => {
              onClickSwitch(data);
            }}
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

  if (!role?.IS_READ) {
    return <ForbidenPage />;
  }
  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
      <MainCard contentSX={{ p: isMobile() ? 0.5 : 2, minHeight: '83vh' }}>
        <Row>
          <Col xs={24} sm={15} style={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile() && <FunnelPlotOutlined style={{ fontSize: '23px', color: config.colorLogo }} />}
            {!isMobile() && (
              <Checkbox
                style={{ marginLeft: '5px' }}
                value={inventoryNegative}
                onChange={(e) => {
                  setInventoryNegative(e?.target?.checked);
                  setPage(1);
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{`Âm kho`}</span>
              </Checkbox>
            )}
            {/* {<div style={{ fontWeight: 'bold', margin: '0px 5px', minWidth: '71px' }}>{t('category')}:</div>} */}
            <Select
              value={selectCategory}
              onChange={(value) => {
                setSelectCatgory(value);
              }}
              style={{ width: isMobile() ? '40%' : '150px' }}
              options={
                categories?.length > 0
                  ? [
                      {
                        label: `---${t('category')}---`,
                        value: ''
                      }
                    ].concat(
                      categories?.map((item) => {
                        return {
                          label: item?.categoryName,
                          value: item?.categoryID
                        };
                      })
                    )
                  : []
              }
            />

            <Search
              placeholder={t('searchByProductName')}
              allowClear
              enterButton
              style={{ width: isMobile() ? '60%' : '250px', marginLeft: '5px' }}
              onSearch={(value) => {
                setPage(1);
                setSearch(value);
              }}
            />
          </Col>
          <Col
            xs={24}
            sm={9}
            style={{
              display: 'flex',
              justifyContent: isMobile() ? 'space-between' : 'right',
              alignItems: 'center',
              marginTop: isMobile() ? '10px' : '0px'
            }}
          >
            {isMobile() && (
              <Checkbox
                style={{ marginLeft: '5px' }}
                value={inventoryNegative}
                onChange={(e) => {
                  setInventoryNegative(e?.target?.checked);
                  setPage(1);
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{`Âm kho`}</span>
              </Checkbox>
            )}
            <div>
              <Button
                onClick={() => {
                  setTypeModal('ADD');
                  setOpenModalAdd(true);
                }}
                style={{ marginRight: '5px' }}
                icon={<PlusOutlined />}
                type="primary"
              >
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
                  : { x: null, y: 'calc(100vh - 230px)' }
              }
              columns={columns}
              dataSource={listProduct}
              pagination={{
                current: page,
                pageSize: rowsPerPage,
                showSizeChanger: true,
                pageSizeOptions: config.sizePageOption,
                total: total,
                showTotal: (total, range) => `${range[0]}-${range[1]}/${total}`,
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
      <ModalAddProduct
        currentRow={currentRow}
        afterDeleteImage={afterDeleteImage}
        typeModal={typeModal}
        setLoading={setLoading}
        open={openModalAdd}
        handleClose={() => {
          setOpenModalAdd(false);
        }}
        categories={categories}
        onAfterSave={onAfterSaveProduct}
      />
      <input type="file" ref={inputRef} hidden onChange={handleFileUploadExcel} />
      <ModalCategory
        categories={categories}
        afterSave={() => {
          getAllCategory();
        }}
        open={openModalCategory}
        handleClose={onCloseModalCategory}
      />
    </>
  );
};
export default ManagerProduct;
