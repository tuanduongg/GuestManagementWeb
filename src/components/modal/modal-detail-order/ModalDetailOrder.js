import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal, App, Row, Col, Typography, Card, Flex, Table, message, Steps, Button } from 'antd';
const { Title, Text } = Typography;
import { PrinterOutlined, CloseOutlined, CheckOutlined, StopOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import config from 'config';
import './modal_detail_order.css';
import { formatDateFromDB, formattingVND, isMobile } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';

const ModalDetailOrder = ({ open, handleClose, detailOrder, ItemProp, roleAccept, handleMenuClick }) => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState([]);
  const [itemSteps, setItemSteps] = useState([]);
  const { t } = useTranslation();

  const handleOk = (e) => {};
  const handleCancel = (e) => {
    handleClose();
    setProducts([]);
  };
  useEffect(() => {
    if (detailOrder) {
      const dataDetail = detailOrder?.orderDetail ?? [];
      const data = dataDetail.map((item) => {
        return {
          productID: item?.productID,
          price: formattingVND(item?.price, ''),
          quantity: item?.quantity,
          unit: item?.unit,
          productName: item?.product?.productName,
          total: formattingVND(item?.price * item?.quantity)
        };
      });

      setProducts(data);
    }
  }, [detailOrder]);
  // useEffect(() => {
  //   if (open) {
  //     setItemSteps(ItemProp);
  //   }
  // }, [ItemProp]);

  const columns = [
    {
      title: '#',
      align: 'center',
      key: '#',
      render: (_, data, index) => index + 1
    },
    {
      title: 'product',
      align: 'left',
      key: 'product',
      dataIndex: 'product',
      render: (_, data, index) => {
        return data?.productName;
      }
    },
    {
      title: 'quantity',
      align: 'center',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'price',
      align: 'center',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'totalCol',
      align: 'right',
      dataIndex: 'total',
      key: 'total'
    }
  ].map((col) => {
    return { ...col, title: t(col?.title) };
  });
  // const data = [
  //   {
  //     key: '1',
  //     product: 'John Brown',
  //     quantity: 32,
  //     price: '15,000',
  //     total: '25,000'
  //   },
  //   {
  //     key: '2',
  //     product: 'Jim Green',
  //     quantity: 42,
  //     price: '15,000',
  //     total: '25,000'
  //   },
  //   {
  //     key: '3',
  //     product: 'Joe Black',
  //     quantity: 32,
  //     price: '15,000',
  //     total: '25,000'
  //   }
  // ];

  return (
    <>
      <Modal
        centered
        okText={t('saveButton')}
        cancelText={t('close')}
        width={800}
        zIndex={1300}
        maskClosable={false}
        title={<>{t('order_detail')}</>}
        footer={[
          <Button icon={<PrinterOutlined />} key="1">
            {t('print')}
          </Button>,
          roleAccept?.cancel ? (
            <Button
              onClick={() => {
                handleMenuClick({ key: 'cancel' });
              }}
              icon={<StopOutlined />}
              key="2"
              danger
            >
              {t('cancel')}
            </Button>
          ) : null,
          roleAccept?.accept ? (
            <Button
              onClick={() => {
                handleMenuClick({ key: 'accept' });
              }}
              icon={<CheckOutlined />}
              key="3"
              type="primary"
            >
              {t('accept')}
            </Button>
          ) : null,
          !isMobile() && (
            <Button key={'4'} onClick={handleCancel}>
              {t('close')}
            </Button>
          )
        ]}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ minWidth: '100%', height: 'auto', minHeight: '400px' }}>
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Card size="small" title={t('status')}>
                <Steps
                  // progressDot
                  size="small"
                  items={ItemProp}
                />
              </Card>
            </Col>
            <Col xs={24}>
              <Card size="small" title={t('general_info')}>
                <Row gutter={[5, 5]}>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        {t('order_number_col')}:
                      </Text>
                      <Text>{detailOrder?.code}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        {t('time')}:
                      </Text>
                      <Text>{formatDateFromDB(detailOrder?.created_at)}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        {t('username')}:
                      </Text>
                      <Text>{detailOrder?.created_by}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        {t('name')}:
                      </Text>
                      <Text>{detailOrder?.reciever}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        {t('department')}:
                      </Text>
                      <Text>{detailOrder?.department?.departName}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        {t('note')}:
                      </Text>
                      <Text>{detailOrder?.note}</Text>
                    </Flex>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24}>
              <Card className="card-table" size="small">
                <Table
                  bordered
                  size="small"
                  footer={() => (
                    <div style={{ display: 'flex', justifyContent: 'end', fontWeight: 'bold' }}>
                      {t('total')}: {formattingVND(detailOrder?.total)}
                    </div>
                  )}
                  pagination={false}
                  columns={columns}
                  dataSource={products}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};
export default ModalDetailOrder;
