import React, { useEffect, useRef, useState } from 'react';
import { Input, Modal, App, Row, Col, Table, Checkbox, Divider, Upload, message, notification, Space, Button } from 'antd';
import { checkIsExcelFile, checkStringIsDate } from './modal_upload_excel.service';
const { Dragger } = Upload;
import ExcelJS from 'exceljs';
import { InboxOutlined, FileExcelOutlined } from '@ant-design/icons';
import './modal_upload_excel.css';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';

const ModalUploadExcel = ({ open, handleClose }) => {
  const handleCancel = () => {
    handleClose();
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (description) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="link" size="small" onClick={() => api.destroy()}>
          Clear All
        </Button>
      </Space>
    );
    api['error']({
      message: 'Thông báo',
      description: description,
      placement: 'bottomRight',
      duration: 0,
      btn
    });
  };

  const props = {
    showUploadList: false,
    name: 'file',
    multiple: false,
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      handleChange(info);
    },
    onDrop(e) {
      console.log('Dropped files', e?.dataTransfer?.files);
    }
  };
  const upload = (fileToUpload) => {
    readFile(fileToUpload, (data) => readDataFromFile(data));
  };

  const readFile = (fileToUpload, callback) => {
    const reader = new FileReader();
    let data;
    reader.onload = function () {
      data = reader.result;
      callback(data);
    };
    reader.readAsArrayBuffer(fileToUpload);
  };
  const handleSaveGuest = async () => {
    // setLoading(true);
    let url = RouterAPI.addGuest;
    const data = {
      company,
      carNumber,
      personSeowon,
      department,
      reason,
      timeIn,
      timeOut,
      date: formatArrDate(date),
      names
    };
    const rest = await restApi.post(url, data);
    // setLoading(false);
    // afterSave(rest);
    // if (rest?.status === 200) {
    //   handleCancel();
    // }
  };

  const readDataFromFile = (data) => {
    let errFlag = false;
    var workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(data).then((workbook) => {
      const worksheet = workbook.getWorksheet(1);
      const arrDate = [];
      const arrName = [];
      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 5) {
          const values = row.values;
          if (values?.length !== 12) {
            errFlag = true;
            openNotificationWithIcon('Check format file upload!');
          } else {
            let valueCell3 = row.getCell(3).value;
            let valueCell4 = row.getCell(4).value;
            let valueCell5 = row.getCell(5).value;
            let valueCell6 = row.getCell(6).value;
            let valueCell7 = row.getCell(7).value;
            let valueCell8 = row.getCell(8).value;
            let valueCell9 = row.getCell(9).value;
            let valueCell10 = row.getCell(10).value;
            let valueCell11 = row.getCell(11).value;
            if (!valueCell4 || valueCell4?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:4`);
            }
            if (!valueCell6 || valueCell6?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:6`);
            }
            if (!valueCell7 || valueCell7?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:7`);
            }
            if (!valueCell8 || valueCell8?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:8`);
            }
            if (!valueCell9 || valueCell9?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:9`);
            }
            if (!valueCell10 || valueCell10?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:10`);
            }
            if (!valueCell11 || valueCell11?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:11`);
            }
            if (checkStringIsDate(valueCell3)) {
              arrName.push(valueCell3);
            } else {
              errFlag = true;
              openNotificationWithIcon(`Value is not the Date type at row:${rowIndex} column:3`);
            }
          }
        }
      });
      if (errFlag === false) {
        alert('pass');
      }
    });
  };
  const handleChange = async (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file) {
      try {
        upload(info.file.originFileObj);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        message.error('Failed to upload file.');
      }
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        centered
        okText="Lưu thông tin"
        cancelText="Đóng"
        zIndex={1300}
        maskClosable={false}
        title={'Upload File'}
        open={open}
        onOk={() => {}}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
          </>
        )}
      >
        <Upload
          showUploadList={false}
          name="file"
          accept=".xlsx"
          beforeUpload={(file) => {
            console.log('file', file);
            if (!checkIsExcelFile(file?.type)) {
              message.error('Only Excel files (.xlsx) are allowed!');
              return Upload.LIST_IGNORE;
            }
            return true;
          }}
          onChange={handleChange}
        >
          <div
            style={{
              width: '100%',
              height: '100px',
              border: '1px dashed  #cccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button type="link" size="large " icon={<FileExcelOutlined style={{ fontSize: '20px' }} />}>
              <span style={{ fontSize: '15px' }}>Upload excel file</span>
            </Button>
          </div>
        </Upload>
      </Modal>
    </>
  );
};
export default ModalUploadExcel;
