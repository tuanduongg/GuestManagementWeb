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
  notification
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
  const inputRef = useRef();
  const [api, contextHolder] = notification.useNotification();

  const getAllProduct = async () => {
    setLoading(true);
    const obj = { page: +page - 1, rowsPerPage, search, categoryID: selectCategory };
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
          content: t('Bạn có muốn xóa sản phẩm này ?'),
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
          content: t('Bạn có muốn xóa sản phẩm này ?'),
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
          onOk: async () => { }
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
  const onChangeStatus = async (checked) => { };
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
    console.log('rest', rest)
  }

  const handleFileUploadExcel = (event) => {
    const file = event.target.files[0];
    event.target.value = '';

    // Ensure a file is selected
    if (!file) {
      return;
    }
    // Read the uploaded Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      let filesUpload = e.target.result;
      const data = new Uint8Array(filesUpload);

      // Parse the Excel file
      const workbook = new ExcelJS.Workbook();
      workbook.xlsx.load(data).then(async () => {
        var formData = new FormData();
        const worksheet = workbook.getWorksheet(1);
        // workbook.eachSheet((worksheet, sheetId) => {
        for (const image of worksheet.getImages()) {
          // fetch the media item with the data (it seems the imageId matches up with m.index?)
          const img = workbook.model.media.find((m) => m.index === image.imageId);
          img.name = image.range.tl.nativeRow + '_' + img.name;
          console.log('img',img)
          // Chuyển đổi dữ liệu buffer của ảnh thành Uint8Array
          const imageData = new Uint8Array(img.buffer.data);

          // Tạo Blob từ Uint8Array
          const imageBlob = new Blob(imageData, { type: `image/${img.extension}` }); // Tạo Blob từ Uint8Array

          // Thêm blob vào FormData
          formData.append('files', imageBlob, `${img.name}.jpg`);

          // console.log(`${image.range.tl.nativeRow}.${image.range.tl.nativeCol}.${img.name}.${img.extension}`, img.buffer);
        }
        // console.log('count', worksheet.rowCount)
        const rowData = [];

        for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
          const row = worksheet.getRow(rowNumber);
          const values = row.values;
          let check = true;

          if (rowNumber >= 6) {
            if (values?.length === 9) {
              const nameProduct = row.getCell('B').value; //4
              const unit = row.getCell('C').value; //3
              const price = parseFloat(row.getCell('D').value); //5
              const inventory = parseInt(row.getCell('E').value); //8
              // const image = row.getCell('F').value; //6
              const desciption = row.getCell('G').value; //7
              const category = row.getCell('H').value; //7
              if (isNaN(price)) {
                openNotificationWithIcon(`Sai định dạng tại cột D,Hàng ${rowNumber}`);
                check = false;
                return false;
              }
              if (isNaN(inventory)) {
                openNotificationWithIcon(`Sai định dạng tại cột E,Hàng ${rowNumber}`);
                check = false;
                return false;
              }
              rowData.push({
                productName: nameProduct,
                price: `${price}`,
                description: desciption,
                inventory: +inventory,
                categoryID: category,
                unit: unit,
                isShow: true
              });
            } else {
              openNotificationWithIcon(`File không đúng định dạng tại Hàng ${rowNumber}`);
              return;
            }

          }
          if (!check) {
            break;
          }
          // sai format
        }
        formData.append('data', JSON.stringify(rowData));
        const rest = await restApi.post(RouterAPI.upLoadExcelProduct, formData);
        console.log('rest', rest)
      });
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    // getAllProduct();
    getAllCategory();
  }, []);
  useEffect(() => {
    getAllProduct();
  }, [page, rowsPerPage, search, selectCategory]);
  const ITEMS = [
    {
      label: 'Danh mục',
      key: 'catgory',
      icon: <BarsOutlined />,
      disabled: false,
      hidden: false
    },
    {
      type: 'divider'
    },
    {
      label: 'Import Excel',
      key: 'importExcel',
      icon: <ImportOutlined />,
      disabled: false,
      hidden: false
    },
    {
      label: 'Delete',
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
              <Col xs={6}>
                <Image
                  width={50}
                  height={50}
                  src={data?.images[0] ? config.urlImageSever + data?.images[0]?.url : ''}
                  fallback={urlFallBack}
                />
              </Col>
            )}
            <Col xs={24} sm={18}>
              <Link onClick={() => { }}>{data?.productName}</Link>
            </Col>
          </Row>
        </>
      ),
      width: isMobile() ? '130px' : '35%'
    },
    {
      align: 'center',
      key: 'price',
      title: 'Giá',
      dataIndex: 'price',
      render: (_, data) => <>{formattingVND(data?.price)}</>,
      sorter: (a, b) => a?.price - b?.price,
      width: isMobile() ? '100px' : '15%'
    },
    {
      key: 'unit',
      title: 'Đơn vị',
      dataIndex: 'unit',
      align: 'center',
      render: (_, data) => <>{data?.unit}</>,
      width: isMobile() ? '100px' : '10%'
    },
    {
      key: 'inventory',
      title: 'Tồn Kho',
      dataIndex: 'inventory',
      align: 'center',
      sorter: (a, b) => a?.inventory - b?.inventory,
      width: isMobile() ? '100px' : '10%'
    },
    {
      align: 'center',
      key: 'category',
      title: 'Danh mục',
      filters:
        categories?.length > 0
          ? categories?.map((item) => {
            return {
              text: item?.categoryName,
              value: item?.categoryID
            };
          })
          : [],
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record?.category?.categoryID === value,
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
          <Switch
            onClick={() => {
              onClickSwitch(data);
            }}
            size="small"
            checkedChildren="On"
            unCheckedChildren="Off"
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
              value={selectCategory}
              onChange={(value) => {
                setSelectCatgory(value);
              }}
              style={{ width: isMobile() ? '35%' : '150px' }}
              options={
                categories?.length > 0
                  ? [
                    {
                      label: 'All',
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
              placeholder="Tên sản phẩm..."
              allowClear
              enterButton
              style={{ width: isMobile() ? '45%' : '200px', marginLeft: '5px' }}
              onSearch={(value) => {
                setSearch(value);
              }}
            />
          </Col>
          <Col
            xs={24}
            sm={9}
            style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginTop: isMobile() ? '10px' : '0px' }}
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
                Khác
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
              pagination={{
                current: page,
                pageSize: rowsPerPage,
                showSizeChanger: true,
                pageSizeOptions: config.sizePageOption,
                total: total,
                responsive: true,
                onChange: (page, pageSize) => {
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
