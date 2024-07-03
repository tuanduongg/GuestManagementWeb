import React, { useEffect, useRef, useState } from 'react';
import { Table, Row, Col, Typography, Button, message, Input, Card, Select, Modal, notification, Form } from 'antd';
const { Search } = Input;
import { formattingVND, isMobile, truncateString } from 'utils/helper';
import { PlusOutlined, AuditOutlined, EditOutlined } from '@ant-design/icons';
import Loading from 'components/Loading';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';
import config from 'config';
import ModalConcept from 'components/modal/modal-concept/ModalConcept';
import './concept.css';

const { Title, Link } = Typography;

const init = [
  {
    id: '1',
    category: 'ACC',
    model: 'EF-PG770',
    plName: 'R5 ALL LTE',
    code: '010A-000001',
    productName: 'SILICONE;HRS,LSI810/60,BLACK_A',
    registrationDate: '12/01/2024',
    registrant: 'MrBan',
    approval: true
  },
  {
    id: '2',
    category: 'ACC',
    model: 'EF-PA715',
    plName: 'Galaxy-A71 ALL LTE',
    code: '010A-000005',
    productName: 'SILICONE;HRS,LSI810/60,SILVER_A',
    registrationDate: '10/05/2024',
    registrant: 'KimPhung',
    approval: true
  },
  {
    id: '3',
    category: 'RUBBER',
    model: 'SM-R860/R870',
    plName: 'FRESH',
    code: '010A-000015',
    productName: 'VTX-1341D FRESH BLACK',
    registrationDate: '05/05/2024',
    registrant: 'MrQuyen',
    approval: true
  },
  {
    id: '4',
    category: 'INJECTION',
    model: 'SM-G970U',
    plName: 'Beyond ALL LTE',
    code: '010G-000043',
    productName: 'RESIN;TPU,IP-060AS_DG',
    registrationDate: '08/04/2024',
    registrant: 'MrQuy',
    approval: false
  }
];
const initValueForm = {
  category: '',
  model: '',
  plName: '',
  code: '',
  productName: '',
  registrant: '',
  approval: ''
};
const Concept = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [openModalConcept, setOpenModalConcept] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectCategory, setSelectCatgory] = useState('');
  const [filterCategory, setFilterCategory] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [listConcept, setListConcept] = useState(init);
  const [modal] = Modal.useModal();
  const [form] = Form.useForm();

  // số thứ tự = (trang_hiện_tại - 1) * số_bản_ghi_trên_mỗi_trang + số_đang_xem
  const columns = [
    {
      align: 'center',
      key: 'index',
      title: '#',
      // fixed: 'left',
      render: (_, data, index) => <>{index + 1}</>,
      width: isMobile() ? '30px' : '5%'
    },
    {
      align: 'left',
      key: 'category',
      title: '카테고리',
      dataIndex: 'category',
      fixed: 'left',
      width: isMobile() ? '130px' : '8%'
    },
    {
      align: 'left',
      key: 'model',
      title: '모델명',
      dataIndex: 'model',
      width: isMobile() ? '100px' : '12%'
    },
    {
      key: 'PL_NAME',
      title: 'P/L NAME',
      dataIndex: 'plName',
      align: 'left',
      width: isMobile() ? '100px' : '12%'
    },
    {
      key: 'code',
      title: '코드',
      dataIndex: 'code',
      align: 'left',
      width: isMobile() ? '100px' : '12%'
    },
    {
      key: 'productName',
      title: '품명',
      dataIndex: 'productName',
      align: 'left',
      width: isMobile() ? '100px' : '20%'
    },
    {
      key: 'registrationDate',
      title: '등록일자',
      dataIndex: 'registrationDate',
      align: 'center',
      width: isMobile() ? '100px' : '12%'
    },
    {
      key: 'registrant',
      title: '등록자',
      dataIndex: 'registrant',
      align: 'center',
      width: isMobile() ? '100px' : '12%'
    },
    {
      key: 'approval',
      title: '승인원',
      dataIndex: 'approval',
      align: 'left',
      width: isMobile() ? '100px' : '8%'
    }
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
      <Card className="cardConcept">
        <Row>
          <Col xs={24} sm={17}></Col>
          <Col
            xs={24}
            sm={7}
            style={{
              display: 'flex',
              justifyContent: isMobile() ? 'space-between' : 'right',
              alignItems: 'center',
              marginTop: isMobile() ? '10px' : '0px'
            }}
          >
            <div>
              <Button
                onClick={() => { }}
                style={{ marginRight: '5px' }}
                icon={<EditOutlined />}
              // type="primary"
              >
                등 록
              </Button>
              <Button
                onClick={() => { }}
                style={{ marginRight: '5px' }}
                icon={<AuditOutlined />}
              // type="primary"
              >
                조 회
              </Button>
              <Button
                onClick={() => {
                  setOpenModalConcept(true);
                }}
                style={{ marginRight: '5px' }}
                icon={<PlusOutlined />}
                type="primary"
              >
                수 정
              </Button>
            </div>
          </Col>
        </Row>
        <Row >
          <Col style={{ display: 'flex' }} xs={24}>
            <Select
              onChange={(value) => {
                setSelectCatgory(value);
              }}
              value={selectCategory}
              filterOption={(input, option) => {
                return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
              }}
              showSearch
              style={{ width: '180px', maxWidth: '180px',marginRight:'5px' }}
              options={[
                {
                  value: '',
                  label: '---카테고리---'
                },
                {
                  value: 'ACC',
                  label: 'ACC'
                },
                {
                  value: 'RUBBER',
                  label: 'RUBBER'
                },
                {
                  value: 'CONVERTING',
                  label: 'CONVERTING'
                },
                {
                  value: 'INJECTION',
                  label: 'INJECTION'
                },
                {
                  value: 'METAL KEY 5개중 택',
                  label: 'METAL KEY 5개중 택'
                }
              ]}
            ></Select>
            <Input style={{ width: '180x',maxWidth: '180px'}}  placeholder="모델명..." />
          </Col>
        </Row>
      </Card>
      <MainCard contentSX={{ p: isMobile() ? 0.5 : 2, minHeight: '60vh' }}>
        <Row style={{ marginTop: '15px' }}>
          <Col xs={24}>
            <Table
              size="small"
              rowKey="id"
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
              dataSource={listConcept}
              pagination={false}
            ></Table>
          </Col>
        </Row>
      </MainCard>
      <ModalConcept
        open={openModalConcept}
        setListConcept={setListConcept}
        handleClose={() => {
          setOpenModalConcept(false);
        }}
      />
    </>
  );
};
export default Concept;
