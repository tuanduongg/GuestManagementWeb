import { Collapse, Row, Col, Checkbox, Divider, Button, Flex, message } from 'antd';
import { CaretRightOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import './permisstion.css';
import ModalRole from 'components/modal/modal-role/ModalRole.js';
import { useState } from 'react';

const SPAN = 3;

const Permisstion = ({ listRole, role, getAllRole }) => {
  const [openModal, setOpenModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const items = listRole?.map((roleItem, index) => {
    return {
      key: index,
      label: (
        <Row>
          <Col span={24}>
            <strong>{roleItem?.ROLE_NAME}</strong>
          </Col>
        </Row>
      ),
      children: roleItem?.permisstions?.map((item, index) => {
        return (
          <>
            <Row key={index}>
              <Col span={9}>{roleItem?.permisstions[index]?.SCREEN}</Col>
              <Col className="center-text" span={SPAN}>
                <Checkbox checked={roleItem?.permisstions[index]?.IS_READ} />
              </Col>
              <Col className="center-text" span={SPAN}>
                <Checkbox checked={roleItem?.permisstions[index]?.IS_CREATE} />
              </Col>
              <Col className="center-text" span={SPAN}>
                <Checkbox checked={roleItem?.permisstions[index]?.IS_UPDATE} />
              </Col>
              <Col className="center-text" span={SPAN}>
                <Checkbox checked={roleItem?.permisstions[index]?.IS_DELETE} />
              </Col>
              <Col className="center-text" span={SPAN}>
                <Checkbox checked={roleItem?.permisstions[index]?.IS_ACCEPT} />
              </Col>
            </Row>
            {index !== roleItem?.permisstions.length - 1 && <Divider style={{ margin: '10px 0px' }} dashed />}
          </>
        );
      })
    };
  });

  const onChange = (key) => {
    console.log(key);
  };
  const onAfterSave = (res) => {
    if (res?.status === 200) {
      messageApi.open({
        type: 'success',
        content: 'Thêm mới thành công!'
      });
      getAllRole();
    } else {
      messageApi.open({
        type: 'warning',
        content: res?.data?.message ?? 'Add role fail!'
      });
    }
  };
  return (
    <>
      {contextHolder}
      <Row style={{ margin: '5px 0px 10px 0px' }}>
        <Flex gap="small" wrap="wrap" style={{ width: '100%' }} justify="right">
          <div>
            {role?.IS_CREATE && (
              <Button
                style={{ marginRight: '5px' }}
                onClick={() => {
                  setOpenModal(true);
                }}
                icon={<PlusOutlined />}
                type="primary"
              >
                Thêm mới
              </Button>
            )}
          </div>
        </Flex>
      </Row>
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
      <Collapse
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        items={items}
        onChange={onChange}
        defaultActiveKey={['0']}
      />
      <Flex gap="small" wrap="wrap" style={{ width: '100%', marginTop: '10px' }} justify="right">
        {role?.IS_UPDATE && (
          <>
            <Button className="btn-success-custom" disabled icon={<SaveOutlined />} type="primary">
              Lưu thay đổi
            </Button>
          </>
        )}
      </Flex>
      <ModalRole
        afterSave={onAfterSave}
        handleClose={() => {
          setOpenModal(false);
        }}
        open={openModal}
      />
    </>
  );
};

export default Permisstion;
