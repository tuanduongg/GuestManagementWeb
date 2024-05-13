import { Collapse, Row, Col, Checkbox, Divider, Button, Flex, message, Table } from 'antd';
import { CaretRightOutlined, PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import './permisstion.css';
import { useEffect, useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { useTranslation } from 'react-i18next';

const SPAN = 3;

const Permisstion = ({ listRole, role, getAllRole }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [roles, setRoles] = useState([]);
  const [checkChange, setCheckChange] = useState(false);
  // const [items, setItems] = useState([]);

  useEffect(() => {
    if (listRole) {
      setRoles(listRole);
    }
  }, [listRole]);
  // useEffect(() => {
  //   if (roles) {
  //     const itemsTable = roles?.map((roleItem, index) => {
  //       return {
  //         key: index,
  //         label: (
  //           <Row>
  //             <Col span={24}>
  //               <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="space-between" algin="center">
  //                 <div>
  //                   <strong>{roleItem?.ROLE_NAME}</strong>
  //                 </div>
  //               </Flex>
  //             </Col>
  //           </Row>
  //         ),
  //         children: (
  //           <Table
  //             className={index}
  //             bordered={false}
  //             pagination={false}
  //             rowHoverable={false}
  //             columns={[
  //               {
  //                 fixed: 'left',
  //                 title: 'Screen',
  //                 key: 'name',
  //                 render: (data) => data?.SCREEN,
  //                 width: '100px'
  //               },
  //               {
  //                 title: 'Read',
  //                 key: 'read',
  //                 width: '50px',
  //                 render: (data) => (
  //                   <Checkbox
  //                     onChange={(e) => {
  //                       onChangeCheckbox(e, index, roleItem?.ROLE_ID);
  //                     }}
  //                     name="IS_READ"
  //                     checked={data?.IS_READ}
  //                   />
  //                 )
  //               },
  //               {
  //                 title: 'Create',
  //                 key: 'create',
  //                 width: '50px',
  //                 render: (data) => (
  //                   <Checkbox
  //                     onChange={(e) => {
  //                       onChangeCheckbox(e, index, roleItem?.ROLE_ID);
  //                     }}
  //                     name="IS_CREATE"
  //                     checked={data?.IS_CREATE}
  //                   />
  //                 )
  //               },
  //               {
  //                 title: 'Update',
  //                 key: 'update',
  //                 width: '50px',
  //                 render: (data) => (
  //                   <Checkbox
  //                     onChange={(e) => {
  //                       onChangeCheckbox(e, index, roleItem?.ROLE_ID);
  //                     }}
  //                     name="IS_UPDATE"
  //                     checked={data?.IS_UPDATE}
  //                   />
  //                 )
  //               },
  //               {
  //                 title: 'Delete',
  //                 key: 'delete',
  //                 width: '50px',
  //                 render: (data) => (
  //                   <Checkbox
  //                     onChange={(e) => {
  //                       onChangeCheckbox(e, index, roleItem?.ROLE_ID);
  //                     }}
  //                     name="IS_DELETE"
  //                     checked={data?.IS_DELETE}
  //                   />
  //                 )
  //               },
  //               {
  //                 title: 'Import',
  //                 key: 'import',
  //                 width: '50px',
  //                 render: (data) => (
  //                   <Checkbox
  //                     onChange={(e) => {
  //                       onChangeCheckbox(e, index, roleItem?.ROLE_ID);
  //                     }}
  //                     name="IS_IMPORT"
  //                     checked={data?.IS_IMPORT}
  //                   />
  //                 )
  //               },
  //               {
  //                 title: 'Export',
  //                 key: 'export',
  //                 width: '50px',
  //                 render: (data) => (
  //                   <Checkbox
  //                     onChange={(e) => {
  //                       onChangeCheckbox(e, index, roleItem?.ROLE_ID);
  //                     }}
  //                     name="IS_EXPORT"
  //                     checked={data?.IS_EXPORT}
  //                   />
  //                 )
  //               },
  //               {
  //                 title: 'Accept',
  //                 key: 'accept',
  //                 width: '50px',
  //                 render: (data) => (
  //                   <Checkbox
  //                     onChange={(e) => {
  //                       onChangeCheckbox(e, index, roleItem?.ROLE_ID);
  //                     }}
  //                     name="IS_ACCEPT"
  //                     checked={data?.IS_ACCEPT}
  //                   />
  //                 )
  //               }
  //             ]}
  //             dataSource={roleItem?.permisstions}
  //           />
  //         )
  //       };
  //     });
  //     setItems(itemsTable);
  //   }
  // }, [roles]);
  const onChangeCheckbox = (e, index, ROLE_ID) => {
    const { name, checked } = e.target;
    setCheckChange(true);
    const data = roles?.map((roleItem) => {
      if (roleItem?.ROLE_ID === ROLE_ID) {
        if (roleItem?.permisstions) {
          roleItem.permisstions[index][name] = checked;
        }
      }
      return roleItem;
    });
    setRoles(data);
  };

  const items = roles?.map((roleItem, index) => {
    return {
      key: index,
      label: (
        <Row>
          <Col span={24}>
            <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="space-between" algin="center">
              <div>
                <strong>{roleItem?.ROLE_NAME}</strong>
              </div>
            </Flex>
          </Col>
        </Row>
      ),
      children: (
        <>
          {roleItem?.permisstions?.map((item, index) => {
            return (
              <>
                <Row key={index}>
                  <Col span={3}>{roleItem?.permisstions[index]?.SCREEN}</Col>
                  <Col className="center-text" span={SPAN}>
                    <Checkbox
                      onChange={(e) => {
                        onChangeCheckbox(e, index, roleItem?.ROLE_ID);
                      }}
                      name="IS_READ"
                      checked={roleItem?.permisstions[index]?.IS_READ}
                    />
                  </Col>
                  <Col className="center-text" span={SPAN}>
                    <Checkbox
                      onChange={(e) => {
                        onChangeCheckbox(e, index, roleItem?.ROLE_ID);
                      }}
                      name="IS_CREATE"
                      checked={roleItem?.permisstions[index]?.IS_CREATE}
                    />
                  </Col>
                  <Col className="center-text" span={SPAN}>
                    <Checkbox
                      onChange={(e) => {
                        onChangeCheckbox(e, index, roleItem?.ROLE_ID);
                      }}
                      name="IS_UPDATE"
                      checked={roleItem?.permisstions[index]?.IS_UPDATE}
                    />
                  </Col>
                  <Col className="center-text" span={SPAN}>
                    <Checkbox
                      onChange={(e) => {
                        onChangeCheckbox(e, index, roleItem?.ROLE_ID);
                      }}
                      name="IS_DELETE"
                      checked={roleItem?.permisstions[index]?.IS_DELETE}
                    />
                  </Col>
                  <Col className="center-text" span={SPAN}>
                    <Checkbox
                      onChange={(e) => {
                        onChangeCheckbox(e, index, roleItem?.ROLE_ID);
                      }}
                      name="IS_IMPORT"
                      checked={roleItem?.permisstions[index]?.IS_IMPORT}
                    />
                  </Col>
                  <Col className="center-text" span={SPAN}>
                    <Checkbox
                      onChange={(e) => {
                        onChangeCheckbox(e, index, roleItem?.ROLE_ID);
                      }}
                      name="IS_EXPORT"
                      checked={roleItem?.permisstions[index]?.IS_EXPORT}
                    />
                  </Col>
                  <Col className="center-text" span={SPAN}>
                    <Checkbox
                      onChange={(e) => {
                        onChangeCheckbox(e, index, roleItem?.ROLE_ID);
                      }}
                      name="IS_ACCEPT"
                      checked={roleItem?.permisstions[index]?.IS_ACCEPT}
                    />
                  </Col>
                </Row>
                {index !== roleItem?.permisstions.length - 1 && <Divider style={{ margin: '10px 0px' }} dashed />}
              </>
            );
          })}
          {/* <div style={{ display: 'flex', justifyContent: 'end', margin: '10px 10px 0px 0px', color: 'red', cursor: 'pointer' }}>Delete</div> */}
        </>
      )
    };
  });


  const onClickSave = async () => {
    const data = roles;
    const res = await restApi.post(RouterAPI.updateRole, { data: data });
    if (res?.status === 200) {
      messageApi.open({
        type: 'success',
        content: t('msg_update_success')
      });
      getAllRole();
    } else {
      messageApi.open({
        type: 'warning',
        content: res?.data?.message ?? 'Update role fail!'
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Row style={{ marginBottom: '5px' }}>
        <Col span={SPAN}>
          <strong style={{ marginLeft: '10px' }}></strong>
        </Col>
        <Col className="center-text" span={SPAN}>
          <strong>Read</strong>
        </Col>
        <Col className="center-text" span={SPAN}>
          <strong>Create</strong>
        </Col>
        <Col className="center-text" span={SPAN}>
          <strong>Update</strong>
        </Col>
        <Col className="center-text" span={SPAN}>
          <strong>Delete</strong>
        </Col>
        <Col className="center-text" span={SPAN}>
          <strong>Import</strong>
        </Col>
        <Col className="center-text" span={SPAN}>
          <strong>Export</strong>
        </Col>
        <Col className="center-text" span={SPAN}>
          <strong>Accept</strong>
        </Col>
      </Row>
      <Collapse
        className="collapse_permission"
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        items={items}
        defaultActiveKey={['0']}
      />
      <Flex gap="small" wrap="wrap" style={{ width: '100%', marginTop: '10px' }} justify="right">
        {role?.IS_UPDATE && (
          <>
            <Button
              shape="round"
              disabled={!checkChange}
              onClick={onClickSave}
              className="btn-success-custom"
              icon={<SaveOutlined />}
              type="primary"
            >
              {t('saveButton')}
            </Button>
          </>
        )}
      </Flex>
    </>
  );
};

export default Permisstion;
