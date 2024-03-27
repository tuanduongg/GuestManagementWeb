import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Input, Modal, App, Row, Col, message, Table, Typography } from 'antd';
import dayjs from 'dayjs';
const { TextArea, Search } = Input;
const { Link } = Typography;

// assets
import { PlusOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { formatArrDate, formatDateFromDB, isMobile } from 'utils/helper';
import { useTranslation } from 'react-i18next';

const ModalHistoryGuest = ({ open, handleClose, idGuest }) => {
  const { t } = useTranslation();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [guestID, setGuestID] = useState('');
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const columns = [
    {
      align: 'center',
      key: 'no',
      title: '#',
      fixed: 'left',
      width: isMobile() ? 50 : '10%',
      render: (text, object, index) => index + 1
    },
    {
      align: 'left',
      key: 'type',
      title: 'type',
      dataIndex: 'TYPE',
      width: isMobile() ? 100 : '20%'
    },
    {
      align: 'left',
      key: 'VALUE',
      title: 'description',
      dataIndex: 'VALUE',
      width: isMobile() ? 150 : '27%'
    },
    {
      align: 'left',
      key: 'USER',
      title: 'User',
      dataIndex: 'USER',
      width: isMobile() ? 100 : '25%',
      render: (_, data) => (
        <>
          <Link onClick={() => {}}>{data?.USER}</Link>
        </>
      )
    },
    {
      key: 'TIME',
      title: 'time',
      dataIndex: 'TIME',
      align: 'center',
      width: isMobile() ? 100 : '18%',
      render: (text, object, index) => {
        return formatDateFromDB(object?.TIME);
      }
    }
  ].map((col) => {
    return { ...col, title: t(col.title) };
  });
  //  [
  //     {
  //         "NAME_ID": "1AABA74A-E3D6-EE11-A1CF-04D9F5C9D2EB",
  //         "FULL_NAME": "KO DEOK JUN ABC"
  //     }
  // ]
  useEffect(() => {}, [open]);
  const draggleRef = useRef(null);
  const handleOk = (e) => {};
  const handleCancel = (e) => {
    handleClose();
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    });
  };

  useEffect(() => {
    if (open && idGuest) {
      getData();
    }
  }, [open]);
  const getData = async () => {
    setLoading(true);
    const res = await restApi.post(RouterAPI.getHistoryGuest, { data: idGuest });
    if (res?.status === 200) {
      setData(res?.data);
    } else {
      setData([]);
    }
    setLoading(false);
  };
  const onClickCancel = () => {
    setData([]);
    handleCancel();
  };
  return (
    <>
      {contextHolder}
      <Modal
        centered
        width={600}
        // okText="Lưu thông tin"
        cancelText={t('close')}
        zIndex={1300}
        maskClosable={false}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move'
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            {t('history')}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={onClickCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            {/* <OkBtn /> */}
          </>
        )}
        modalRender={(modal) => (
          <Draggable disabled={disabled} bounds={bounds} nodeRef={draggleRef} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Table
              // tableLayout={'auto'}
              // tableLayout={tableData?.length !== 0 ? 'fixed' : 'auto'}
              // rowKey="GUEST_ID"
              bordered
              scroll={{
                x: 'max',
                y: '60vh'
              }}
              columns={columns}
              dataSource={data}
              pagination={false}
            ></Table>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ModalHistoryGuest;
