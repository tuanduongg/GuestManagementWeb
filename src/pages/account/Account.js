import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Typography, App, Empty, Button, Flex, message } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UserSwitchOutlined,
  CheckOutlined,
  StopOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { formatDateFromDB, getChipStatusAcc } from 'utils/helper';
import ModalAccount from 'components/modal/modal-account/ModalAccount';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import ForbidenPage from 'components/403/ForbidenPage';
import { checkDisableBtn } from './account.service';
const { Title } = Typography;
import './account.css';

const Account = () => {
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState('');
  const [dataSelect, setDataSelect] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [role, setRole] = useState(null);
  const [typeBtn, setTypeBtn] = useState('ACTIVE');
  const [listRole, setListRole] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const handleClickEdit = (data) => {
    setDataSelect(data);
    setTypeModal('EDIT');
    setOpenModal(true);
  };
  const columns = [
    {
      align: 'center',
      key: 'stt',
      title: 'STT',
      dataIndex: 'stt',
      width: 70,
      render: (id, record, index) => {
        ++index;
        return index;
      }
    },
    {
      align: 'left',
      key: 'USERNAME',
      title: 'Tên tài khoản',
      dataIndex: 'USERNAME',
      width: 130,
      fixed: 'left',
      render: (_, data) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setDataSelect(data);
              setTypeModal('VIEW');
              setOpenModal(true);
            }}
          >
            {data?.USERNAME}
          </Button>
        </>
      )
    },

    {
      key: 'ROLE_NAME',
      title: 'Quyền',
      render: (_, { role }) => <>{role.ROLE_NAME}</>,
      align: 'center',
      width: 130
    },
    {
      key: 'ACTIVE',
      align: 'center',
      title: 'Trạng thái',
      dataIndex: 'ACTIVE',
      width: 130,
      render: (_, { ACTIVE }) => <>{getChipStatusAcc(ACTIVE)}</>
    },
    {
      key: 'CREATE_AT',
      title: 'Ngày tạo',
      dataIndex: 'CREATE_AT',
      align: 'center',
      width: 130,
      render: (_, { CREATE_AT }) => <>{formatDateFromDB(CREATE_AT)}</>
    },
    {
      key: 'ACTION',
      title: 'Hành động',
      align: 'center',
      width: 80,
      hidden: role?.IS_UPDATE ? false : true,
      render: (_, data) => (
        <>
          <Button
            type="link"
            onClick={() => {
              handleClickEdit(data);
            }}
            icon={<EditOutlined />}
          ></Button>
        </>
      )
    }
  ];

  useEffect(() => {
    let check = checkDisableBtn(selectedRowKeys, tableData);
    setTypeBtn(check);
  }, [selectedRowKeys]);

  const checkRole = async () => {
    const rest = await restApi.get(RouterAPI.checkRole);
    if (rest?.status === 200) {
      setRole(rest?.data);
    }
  };

  const getData = async () => {
    const rest = await restApi.get(RouterAPI.userAll);
    if (rest?.status === 200) {
      setTableData(rest?.data);
    }
  };
  const getAllRole = async () => {
    const rest = await restApi.get(RouterAPI.allRole);
    if (rest?.status === 200) {
      setListRole(rest?.data);
    }
  };
  useEffect(() => {
    checkRole();
    getData();
    getAllRole();
  }, []);
  const onChangeBlock = async () => {
    const url = RouterAPI.changeBlockUser;
    const rst = await restApi.post(url, { type: check });
    console.log(rst);
  };
  const onClickBlock = () => {
    onChangeBlock();
  };
  const onCloseModal = () => {
    setDataSelect(null);
    setOpenModal(false);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onAfterSave = (res) => {
    let text = typeModal === 'EDIT' ? 'Cập nhật thông tin thành công!' : 'Thêm mới thành công!';
    if (res?.status === 200) {
      messageApi.open({
        type: 'success',
        content: text
      });
      getData();
    } else {
      messageApi.open({
        type: 'warning',
        content: res?.data?.message ?? 'Add user fail!'
      });
    }
  };
  if (!role) {
    return <ForbidenPage />;
  }
  return (
    <>
      {contextHolder}
      <Row>
        <Col span={24}>
          <Title level={5}>Danh sách tài khoản</Title>
        </Col>
      </Row>
      <Row style={{ margin: '5px 0px 10px 0px' }}>
        <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="space-between">
          <div>
            <Button style={{ marginRight: '5px' }} onClick={() => {}} icon={<UserSwitchOutlined />} type="primary">
              Phân quyền
            </Button>
          </div>
          <div>
            {role?.IS_CREATE && (
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
            )}
            {role?.IS_UPDATE && (
              <>
                {typeBtn === 'BLOCK' && (
                  <Button danger disabled={selectedRowKeys?.length === 0} onClick={onClickBlock} icon={<StopOutlined />} type="primary">
                    Khoá
                  </Button>
                )}
                {typeBtn === 'ACTIVE' && (
                  <Button
                    onClick={onClickBlock}
                    disabled={selectedRowKeys?.length === 0}
                    className="btn-success-custom"
                    icon={<CheckCircleOutlined />}
                    type="primary"
                  >
                    Mở khoá
                  </Button>
                )}
              </>
            )}
          </div>
        </Flex>
      </Row>
      <Table
        rowKey="USER_ID"
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        bordered
        scroll={{
          x: 'max-content',
          y: '70vh'
        }}
        columns={columns.filter((item) => !item?.hidden)}
        dataSource={tableData}
        pagination={false}
      >
        {tableData?.length === 0 && <Empty />}
      </Table>
      <ModalAccount
        listRole={listRole}
        role={role}
        dataSelect={dataSelect}
        typeModal={typeModal}
        open={openModal}
        handleClose={onCloseModal}
        afterSave={onAfterSave}
      />
    </>
  );
};
export default Account;
