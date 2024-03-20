import { Collapse, Row, Col, Checkbox, Divider, Button, Flex, message } from 'antd';
import { CaretRightOutlined, PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import './permisstion.css';
import { useEffect, useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';

const SPAN = 3;

const Permisstion = ({ listRole, role, getAllRole }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [roles, setRoles] = useState([]);
  const [checkChange, setCheckChange] = useState(false);

  useEffect(() => {
    if (listRole) {
      setRoles(listRole);
    }
  }, [listRole]);
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
                  <Col span={9}>{roleItem?.permisstions[index]?.SCREEN}</Col>
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
        content: 'Cập nhật thông tin thành công!'
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
        <Col span={9}>
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
          <strong>Accept</strong>
        </Col>
      </Row>
      <Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} items={items} defaultActiveKey={['0']} />
      <Flex gap="small" wrap="wrap" style={{ width: '100%', marginTop: '10px' }} justify="right">
        {role?.IS_UPDATE && (
          <>
            <Button
              size="small"
              disabled={!checkChange}
              onClick={onClickSave}
              className="btn-success-custom"
              icon={<SaveOutlined />}
              type="primary"
            >
              Lưu thay đổi
            </Button>
          </>
        )}
      </Flex>
    </>
  );
};

export default Permisstion;
