import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, Card, Pagination, Input, Space, Dropdown, message, Button, FloatButton, Empty } from 'antd';
const { Title, Link, Text } = Typography;
const { Meta } = Card;
import './list-product.css';
const { Search } = Input;

import { DownOutlined, FilterOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';
import MainCard from 'components/MainCard';
import CardProduct from 'components/cards/card-product/CardProduct';
import { isMobile, isTablet } from 'utils/helper';
import ModalCart from 'components/modal/modal-cart/ModalCart';
import ModalDetailProduct from 'components/modal/detail-product/ModalDetailProduct';
import Loading from 'components/Loading';
import config from 'config';
const initialCategory = { key: '', label: 'All' };
import { useSelector } from 'react-redux';

const ListProduct = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [openModalCart, setOpenModalCart] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [listProduct, setListProduct] = useState([]);
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectCategory, setSelectCatgory] = useState(initialCategory);
  const [categories, setCategories] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [dropdownCategory, setDropdownCategory] = useState([]);
  const menu = useSelector((state) => state.menu);

  //   if (!role?.IS_READ) {
  //     return <ForbidenPage />;
  //   }
  const getAllCategory = async () => {
    const res = await restApi.get(RouterAPI.getAllCategory);
    if (res?.status === 200) {
      const data = res?.data;
      setCategories(data);
      const newData = [initialCategory].concat(
        data?.map((cate) => {
          return { key: cate.categoryID, label: cate?.categoryName };
        })
      );
      setDropdownCategory(newData);
    }
  };

  const getAllProduct = async () => {
    setLoading(true);
    const obj = { page: +page - 1, rowsPerPage, search, categoryID: selectCategory?.key };
    const url = RouterAPI.getProductPubic;
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
  }, [page, search, rowsPerPage, selectCategory]);

  useEffect(() => {
    getAllCategory();
  }, []);
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onCloseModalDetail = () => {
    setCurrentProduct(null);
    setOpenModalDetail(false);
  };
  const onClickProduct = (product) => {
    setCurrentProduct(product);
    setOpenModalDetail(true);
  };
  const onClickDropdownItem = ({ key }) => {
    const result = dropdownCategory?.find((item) => item?.key === key)?.label;
    setSelectCatgory({ key, label: result });
  };
  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
      <div style={{ margin: '25px 0px 0px 0px' }}></div>
      {/* <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'left' }}>Danh Sách Vật Tư Tiêu Hao</div> */}
      <div className="wrap-list">
        <Row style={{ margin: '0px 0px 15px 0px', justifyContent: 'space-between', alignItems: 'center' }}>
          <Col sm={10} md={18} xs={15}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button style={{}} type="link" icon={<FilterOutlined style={{ fontSize: '17px' }} />} />
              <div style={{ fontWeight: 'bold', marginRight: '5px' }}>{t('category')}:</div>
              <Dropdown
                menu={{
                  onClick: onClickDropdownItem,
                  items: dropdownCategory ? dropdownCategory : [initialCategory],
                  selectable: true,
                  defaultSelectedKeys: ['3']
                }}
              >
                <Typography.Link>
                  <Space>
                    {selectCategory?.label}
                    <DownOutlined />
                  </Space>
                </Typography.Link>
              </Dropdown>
            </div>
          </Col>
          <Col sm={10} md={6} xs={9}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Search
                onSearch={(value) => {
                  setSearch(value);
                }}
                placeholder={t('searchByProductName')}
                allowClear
                enterButton
              />
            </div>
          </Col>
        </Row>
        <div className="wrap_list_item">
          {listProduct?.length > 0 ? listProduct?.map((item, index) => (
            <div key={index} style={{ width: isMobile() ? `${100 / 2}%` : isTablet() ? `${100 / 4}%` : `${100 / 5}%`, padding: '10px' }}>
              <CardProduct onClickProduct={onClickProduct} product={item} />
            </div>
          )) : (<Empty style={{ width: '100%' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
        </div>
        {listProduct?.length > 0 && (<div className="wrap-pagination">
          <Pagination
            current={page}
            onChange={(page, size) => {
              setPage(page);
              setRowsPerPage(size);
            }}
            total={total}
            showTotal={(total, range) => `${range[0]}-${range[1]}/${total} ${t('product')}`}
            pageSize={rowsPerPage}
            showSizeChanger={true}
            pageSizeOptions={config.sizePageOption}
            responsive={true}
          />
        </div>)}
        <FloatButton
          onClick={() => {
            setOpenModalCart(true);
          }}
          tooltip={<div>Cart</div>}
          type="primary"
          badge={{
            count: menu?.cart?.length
          }}
          icon={<ShoppingCartOutlined />}
        />
        <ModalCart
          open={openModalCart}
          handleClose={() => {
            setOpenModalCart(false);
          }}
        />
      </div>
      {/* <MainCard contentSX={{ p: 2, minHeight: '83vh' }}>

      </MainCard> */}
      <ModalDetailProduct open={openModalDetail} handleClose={onCloseModalDetail} product={currentProduct} />
    </>
  );
};

export default ListProduct;
