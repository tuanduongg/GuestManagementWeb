import React, { useState } from 'react';
import { Table, Row, Col, Typography, App, Empty, Button, Flex, DatePicker } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ROLE_ACC, STATUS_ACC, formatDateFromDB, getChipStatusAcc } from 'utils/helper';
import ModalAccount from 'components/modal/modal-account/ModalAccount';
const { Title } = Typography;

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    stt: i + 1,
    username: 'username ' + i,
    created_at: '2024-02-29T06:33:07.000Z',
    role: Object.values(ROLE_ACC)[Math.floor(Math.random() * 3)],
    status: Object.values(STATUS_ACC)[Math.floor(Math.random() * 2)]
  });
}

const Account = () => {
  const [tableData, setTableData] = useState(data ?? []);
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState('');
  const columns = [
    {
      align: 'center',
      key: 'stt',
      title: 'STT',
      dataIndex: 'stt',
      width: 70
    },
    {
      align: 'left',
      key: 'username',
      title: 'Tên tài khoản',
      dataIndex: 'username',
      width: 130,
      fixed: 'left',
      render: (_, data) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setTypeModal('EDIT');
              setOpenModal(true);
            }}
          >
            {data?.username}
          </Button>
        </>
      )
    },

    {
      key: 'role',
      title: 'Quyền',
      dataIndex: 'role',
      align: 'center',
      width: 130
    },
    {
      key: 'status',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (_, { status }) => <>{getChipStatusAcc(status)}</>
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      align: 'center',
      width: 130,
      render: (_, { created_at }) => <>{formatDateFromDB(created_at)}</>
    }
  ];
  const onCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={5}>Danh sách tài khoản</Title>
        </Col>
      </Row>
      <Row style={{ margin: '5px 0px 10px 0px' }}>
        <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="end">
          <div>
            <Button
              style={{ marginRight: '5px' }}
              onClick={() => {
                setTypeModal('ADD');
                setOpenModal(true);
              }}
              icon={<PlusOutlined />}
              type="primary"
            >
              Thêm mới
            </Button>
            <Button danger icon={<DeleteOutlined />} type="primary">
              Block
            </Button>
          </div>
        </Flex>
      </Row>
      <Table
        bordered
        scroll={{
          x: 'max-content',
          y: '70vh'
        }}
        columns={columns}
        dataSource={tableData}
        pagination={false}
      >
        {tableData?.length === 0 && <Empty />}
      </Table>
      <ModalAccount typeModal={typeModal} open={openModal} handleClose={onCloseModal} />
    </>
  );
};
export default Account;
