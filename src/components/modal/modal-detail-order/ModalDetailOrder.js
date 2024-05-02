import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal, App, Row, Col, Typography, Card, Flex, Table, message, Steps } from 'antd';
const { Title } = Typography;
import { UserOutlined, SolutionOutlined, LoadingOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import config from 'config';
import './modal_detail_order.css';

const ModalDetailOrder = ({ open, handleClose, orderID }) => {
  const { t } = useTranslation();

  const handleOk = (e) => {};
  const handleCancel = (e) => {
    handleClose();
  };

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
      render: (_, data, index) => <a>{data?.product}</a>
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
  const data = [
    {
      key: '1',
      product: 'John Brown',
      quantity: 32,
      price: '15,000',
      total: '25,000'
    },
    {
      key: '2',
      product: 'Jim Green',
      quantity: 42,
      price: '15,000',
      total: '25,000'
    },
    {
      key: '3',
      product: 'Joe Black',
      quantity: 32,
      price: '15,000',
      total: '25,000'
    }
  ];

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
            <span style={{ color: '#1677ff', fontSize: '14px ', marginLeft: '5px' }}>#OD-1714107275258</span>
          </>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ minWidth: '100%', height: 'auto', minHeight: '400px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card size="small" title="Trạng thái">
                <Steps
                  size="small"
                  items={[
                    {
                      title: 'New',
                      status: 'finish',
                      icon: <PlusOutlined />
                    },
                    {
                      title: 'MrPark',
                      status: 'finish'
                      //   icon: <UserOutlined />
                    },
                    {
                      title: 'MrJung',
                      status: 'finish'
                      //   icon: <UserOutlined />
                    },
                    {
                      title: 'MrSong',
                      status: 'wait'
                      //   icon: <UserOutlined />
                    },
                    {
                      title: 'Done',
                      status: 'wait',
                      icon: <CheckCircleOutlined />
                    }
                  ]}
                />
              </Card>
            </Col>
            <Col xs={24}>
              <Card className="card-table" size="small">
                <Table
                  bordered
                  size="small"
                  footer={() => <div style={{ display: 'flex', justifyContent: 'end', fontWeight: 'bold' }}>Tổng tiền: 123.000.00đ</div>}
                  pagination={false}
                  columns={columns}
                  dataSource={data}
                />
              </Card>
            </Col>
            <Col xs={24}>
              <Card size="small" title="Thông tin chung">
                <p>Card content</p>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};
export default ModalDetailOrder;
