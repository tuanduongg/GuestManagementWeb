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
      title: 'Sản phẩm',
      align: 'left',
      key: 'product',
      dataIndex: 'product',
      render: (_, data, index) => {
        return data?.productName;
      }
    },
    {
      title: 'Số lượng',
      align: 'center',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Đơn giá',
      align: 'center',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Thành tiền',
      align: 'right',
      dataIndex: 'total',
      key: 'total'
    }
  ];
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
        title={
          <>
            Chi tiết hóa đơn
            {/* <span style={{ color: '#1677ff', fontSize: '14px ', margin: '0px' }}>#OD-1714107275258</span> */}
          </>
        }
        footer={[
          <Button icon={<PrinterOutlined />} key="1">
            In
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
              Hủy
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
              Duyệt
            </Button>
          ) : null,
          <Button key={'4'} onClick={handleCancel}>
            Close
          </Button>
        ]}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ minWidth: '100%', height: 'auto', minHeight: '400px' }}>
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Card size="small" title="Trạng thái">
                <Steps
                  // progressDot
                  size="small"
                  items={ItemProp}
                />
              </Card>
            </Col>
            <Col xs={24}>
              <Card size="small" title="Thông tin chung">
                <Row gutter={[5, 5]}>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        Mã hoá đơn:
                      </Text>
                      <Text>{detailOrder?.code}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        Thời gian tạo:
                      </Text>
                      <Text>{formatDateFromDB(detailOrder?.created_at)}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        Tài khoản:
                      </Text>
                      <Text>{detailOrder?.created_by}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        Họ và Tên:
                      </Text>
                      <Text>{detailOrder?.reciever}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        Bộ phận:
                      </Text>
                      <Text>{detailOrder?.department?.departName}</Text>
                    </Flex>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Flex>
                      <Text strong style={{ marginRight: '5px' }}>
                        Ghi chú:
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
                      Tổng tiền: {formattingVND(detailOrder?.total)}
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
