import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { Table, Row, Col, Typography, Segmented, Flex, Button, message, Modal } from 'antd';
import { isMobile } from 'utils/helper';
import ForbidenPage from 'components/403/ForbidenPage';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import { TeamOutlined, SafetyOutlined, InfoCircleOutlined, PlusOutlined, UnlockOutlined, StopOutlined } from '@ant-design/icons';
import Loading from 'components/Loading';
import Account from './compoment/account/Account';
import Permisstion from './compoment/permisstion/permisstion';
import ModalAccount from 'components/modal/modal-account/ModalAccount';
import ModalRole from 'components/modal/modal-role/ModalRole';
import { checkDisableBtn } from './compoment/account/account.service';
import MainCard from 'components/MainCard';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const AccountPage = () => {
  const [role, setRole] = useState(null);
  const [listRole, setListRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valueTab, setValueTab] = useState('account');
  const [openModalAcc, setOpenModalAcc] = useState(false);
  const [openModalRole, setOpenModalRole] = useState(false);
  const [typeModalAcc, setTypeModalAcc] = useState('');
  const [typeBtnBlock, setTypeBtnBlock] = useState('ACTIVE');
  const [dataACC, setDataAcc] = useState([]);
  const [dataSelectAcc, setDataSelectAcc] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { t } = useTranslation();

  const checkRole = async () => {
    setLoading(true);
    const rest = await restApi.get(RouterAPI.checkRole);
    if (rest?.status === 200) {
      setRole(rest?.data);
    }
    setLoading(false);
  };

  const getDataACC = async () => {
    const rest = await restApi.get(RouterAPI.userAll);
    if (rest?.status === 200) {
      setDataAcc(rest?.data);
    }
  };

  useEffect(() => {
    checkRole();
    getAllRole();
    getDataACC();
  }, []);
  useEffect(() => {
    let check = checkDisableBtn(selectedRowKeys, dataACC);
    setTypeBtnBlock(check);
  }, [dataACC]);
  const getAllRole = async () => {
    const rest = await restApi.get(RouterAPI.allRole);
    if (rest?.status === 200) {
      setListRole(rest?.data);
    }
  };
  const onCloseModal = async () => {
    setOpenModalAcc(false);
    setDataSelectAcc(null);
  };
  const onClickAdd = () => {
    switch (valueTab) {
      case 'account':
        setTypeModalAcc('ADD');
        setOpenModalAcc(true);

        break;
      case 'role':
        setOpenModalRole(true);

        break;

      default:
        break;
    }
  };
  const onClickEditAcc = (data) => {
    setDataSelectAcc(data);
    setTypeModalAcc('EDIT');
    setOpenModalAcc(true);
  };

  const onAfterSaveAcc = (res) => {
    let text = typeModalAcc === 'EDIT' ? t('msg_update_success') : t('msg_add_success');
    if (res?.status === 200) {
      messageApi.open({
        type: 'success',
        content: text
      });
      getDataACC();
    } else {
      messageApi.open({
        type: 'warning',
        content: res?.data?.message ?? 'Add user fail!'
      });
    }
  };
  useEffect(() => {
    let check = checkDisableBtn(selectedRowKeys, dataACC);
    setTypeBtnBlock(check);
  }, [selectedRowKeys]);
  const onAfterSaveRole = (res) => {
    if (res?.status === 200) {
      messageApi.open({
        type: 'success',
        content: t('msg_add_success')
      });
      getAllRole();
    } else {
      messageApi.open({
        type: 'warning',
        content: res?.data?.message ?? 'Add role fail!'
      });
    }
  };
  const onChangeBlock = async () => {
    setLoading(true);
    const url = RouterAPI.changeBlockUser;
    const rst = await restApi.post(url, { type: typeBtnBlock, listID: selectedRowKeys });
    setLoading(false);
    if (rst?.status === 200) {
      getDataACC();
      messageApi.open({
        type: 'success',
        content: t('msg_update_success')
      });
    }
  };
  const onClickBlock = () => {
    Modal.confirm({
      title: t('msg_notification'),
      content: `Are you sure you want to ${typeBtnBlock === 'BLOCK' ? 'block' : 'unlock'} this account ?`,
      okText: t('yes'),
      cancelText: t('close'),
      centered: true,
      icon: <InfoCircleOutlined style={{ color: '#4096ff' }} />,
      onOk: async () => {
        onChangeBlock();
      }
    });
  };
  if (!role?.IS_READ) {
    return <ForbidenPage />;
  }
  return (
    <>
      <Loading loading={loading} />
      {contextHolder}
      <Row>
        <Col span={24}>
          <Title level={5}>{t('title_page_role_user')}</Title>
        </Col>
      </Row>
      <MainCard contentSX={{ p: isMobile() ? 0.5 : 2, minHeight: '83vh' }}>
        <Row>
          <Col xs={24} sm={6} style={{ marginBottom: '10px' }}>
            <Segmented
              block
              value={valueTab}
              onChange={(value) => {
                setValueTab(value);
              }}
              options={[
                {
                  label: 'sibar_acc',
                  value: 'account',
                  icon: <TeamOutlined />
                },
                {
                  label: 'role',
                  value: 'role',
                  icon: <SafetyOutlined />
                }
              ].map((col) => {
                return { ...col, label: t(col.label) };
              })}
            />
          </Col>
          <Col xs={24} sm={18} style={{ marginBottom: '10px' }}>
            <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="end">
              <div>
                {role?.IS_CREATE && (
                  <Button shape="round" onClick={onClickAdd} style={{ marginRight: '5px' }} icon={<PlusOutlined />} type="primary">
                    {t('btn_new')}
                  </Button>
                )}
                {role?.IS_UPDATE && valueTab === 'account' && (
                  <>
                    {typeBtnBlock === 'BLOCK' && (
                      <Button
                        shape="round"
                        disabled={selectedRowKeys?.length === 0}
                        danger
                        onClick={onClickBlock}
                        icon={<StopOutlined />}
                        type="primary"
                      >
                        {t('btn_lock')}
                      </Button>
                    )}
                    {typeBtnBlock === 'ACTIVE' && (
                      <Button
                        shape="round"
                        disabled={selectedRowKeys?.length === 0}
                        onClick={onClickBlock}
                        className={selectedRowKeys?.length === 0 ? '' : 'btn-success-custom'}
                        icon={<UnlockOutlined />}
                        type="primary"
                      >
                        {t('btn_unlock')}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Flex>
          </Col>
        </Row>
        {valueTab === 'account' && (
          <Account
            dataACC={dataACC}
            setLoading={setLoading}
            role={role}
            listRole={listRole}
            onClickEdit={onClickEditAcc}
            setTypeBtnBlock={setTypeBtnBlock}
            setSelectedRowKeys={setSelectedRowKeys}
            selectedRowKeys={selectedRowKeys}
          />
        )}
        {valueTab === 'role' && <Permisstion setLoading={setLoading} role={role} listRole={listRole} getAllRole={getAllRole} />}
      </MainCard>
      {/* <Tabs
        size="middle"
        items={[
          {
            key: 1,
            label: 'Tài khoản',
            icon: <TeamOutlined />,
            children: <Account setLoading={setLoading} role={role} listRole={listRole} />
          },
          {
            key: 2,
            label: 'Phân quyền',
            icon: <SafetyOutlined />,
            children: <Permisstion setLoading={setLoading} role={role} listRole={listRole} getAllRole={getAllRole} />
          }
        ]}
      /> */}
      <ModalAccount
        listRole={listRole}
        role={role}
        dataSelect={dataSelectAcc}
        typeModal={typeModalAcc}
        open={openModalAcc}
        handleClose={onCloseModal}
        afterSave={onAfterSaveAcc}
      />
      <ModalRole
        afterSave={onAfterSaveRole}
        handleClose={() => {
          setOpenModalRole(false);
        }}
        open={openModalRole}
      />
    </>
  );
};
export default AccountPage;
