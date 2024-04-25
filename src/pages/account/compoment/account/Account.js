import React, { useEffect, useState } from 'react';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { Table, Row, Col, Typography, App, Empty, Button, Flex, message, Modal } from 'antd';
import { EditOutlined, InfoCircleOutlined, UnlockOutlined, StopOutlined, UserSwitchOutlined, PlusOutlined } from '@ant-design/icons';
import { formatDateFromDB, getChipStatusAcc, isMobile } from 'utils/helper';
import ModalAccount from 'components/modal/modal-account/ModalAccount';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import ForbidenPage from 'components/403/ForbidenPage';
import { checkDisableBtn, initArrayTab } from './account.service';
const { Title } = Typography;
import './account.css';
import { useTranslation } from 'react-i18next';

const Account = ({ role, listRole, onClickEdit, dataACC, setTypeBtnBlock, setSelectedRowKeys, selectedRowKeys }) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState('');
  const [dataSelect, setDataSelect] = useState(null);
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [typeBtn, setTypeBtn] = useState('ACTIVE');
  const [messageApi, contextHolder] = message.useMessage();
  const { modal } = App.useApp();
  const handleClickEdit = (data) => {
    onClickEdit(data);
  };
  const columns = [
    {
      align: 'center',
      key: 'stt',
      title: '#',
      dataIndex: 'stt',
      width: isMobile() ? 70 : '5%',
      render: (id, record, index) => {
        ++index;
        return index;
      }
    },
    {
      align: 'left',
      key: 'USERNAME',
      title: 'username',
      dataIndex: 'USERNAME',
      width: isMobile() ? 130 : '26%',
      fixed: 'left',
      render: (_, data) => (
        <>
          <span style={{ color: '#1677ff' }}>{data?.USERNAME}</span>
        </>
      )
    },
    {
      align: 'left',
      key: 'department',
      title: 'department',
      width: isMobile() ? 130 : '24%',
      render: (_, data) => <>{data?.department?.departName}</>
    },
    {
      key: 'ROLE_NAME',
      title: 'role',
      render: (_, { role }) => <>{role.ROLE_NAME}</>,
      align: 'center',
      width: isMobile() ? 130 : '12%'
    },
    {
      key: 'ACTIVE',
      align: 'center',
      title: 'status_col',
      dataIndex: 'ACTIVE',
      width: isMobile() ? 130 : '10%',
      render: (_, { ACTIVE }) => <>{getChipStatusAcc(ACTIVE)}</>
    },
    {
      key: 'CREATE_AT',
      title: 'time_create',
      dataIndex: 'CREATE_AT',
      align: 'center',
      width: isMobile() ? 130 : '15%',
      render: (_, { CREATE_AT }) => <>{formatDateFromDB(CREATE_AT)}</>
    },
    {
      key: 'ACTION',
      title: '',
      align: 'center',
      width: isMobile() ? 80 : '7%',
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
  ].map((item) => {
    return { ...item, title: t(item.title) };
  });

  useEffect(() => {
    if (dataACC) {
      setTableData(dataACC);
    }
  }, [dataACC]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  if (!role) {
    return <ForbidenPage />;
  }
  return (
    <>
      {contextHolder}
      <Table
        rowKey="USER_ID"
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        bordered
        scroll={
          isMobile()
            ? {
                x: 'max-content',
                y: '70vh'
              }
            : {
                y: '64vh'
              }
        }
        columns={columns.filter((item) => !item?.hidden)}
        dataSource={tableData}
        pagination={false}
      >
        {tableData?.length === 0 && <Empty />}
      </Table>
    </>
  );
};
export default Account;
