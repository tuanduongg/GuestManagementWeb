import React, { useEffect, useRef, useState } from 'react';
import { Modal, Upload, message, notification, Space, Button } from 'antd';
const { Dragger } = Upload;
import ExcelJS from 'exceljs';
import { InboxOutlined, FileExcelOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { createDateWithCurrentDate, formatDate, getAllDatesInRange } from 'utils/helper';
import { useTranslation } from 'react-i18next';
import SAMPLE_EXCEL_FILE from '../../../assets/excel/FileUploadDevice.xlsx';
import './modal-upload-excel-device.css';
import { checkIsExcelFile } from '../modal-upload-excel/modal_upload_excel.service';

const ModalUploadExcelDevice = ({ open, handleClose, afterSave, setLoading }) => {
  const handleCancel = () => {
    handleClose();
  };

  const [api, contextHolder] = notification.useNotification();
  const [messageApi] = message.useMessage();
  const { t } = useTranslation();

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
      message: 'Warning',
      description: description,
      placement: 'bottomRight',
      duration: 0,
      btn
    });
  };

  // const props = {
  //   showUploadList: false,
  //   name: 'file',
  //   multiple: false,
  //   // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  //   onChange(info) {
  //     handleChange(info);
  //   },
  //   onDrop(e) {
  //     console.log('Dropped files', e?.dataTransfer?.files);
  //   }
  // };
  // const upload = (fileToUpload) => {
  //   readFile(fileToUpload, (data) => readDataFromFile(data));
  // };

  // const readFile = (fileToUpload, callback) => {
  //   const reader = new FileReader();
  //   let data;
  //   reader.onload = function () {
  //     data = reader.result;
  //     callback(data);
  //   };
  //   reader.readAsArrayBuffer(fileToUpload);
  // };

  // const readDataFromFile = (data) => {
  //   setLoading(true);
  //   let errFlag = false;
  //   var workbook = new ExcelJS.Workbook();
  //   const rows = [];
  //   workbook.xlsx.load(data).then(async (workbook) => {
  //     const worksheet = workbook.getWorksheet(1);
  //     for (var i = 1; i <= worksheet?.rowCount; i++) {
  //       if (i > 1) {
  //         let row = {};
  //         for (var j = 1; j <= worksheet?.columnCount; j++) {
  //           var header = worksheet.getRow(1).values[j];
  //           var value = worksheet.getRow(i).values[j];
  //           row[header] = value;
  //         }
  //         rows[i] = row;
  //       }
  //     }
  //     const res = await restApi.post(RouterAPI.addMultipleDevice, { data: rows });
  //     setLoading(false);
  //     if (res?.status == 200) {
  //       console.log('res', res);
  //       message.success('Upload file successful!');
  //       handleCancel();
  //       if (res?.notSavedRow) {
  //         message.error('Cannot import at row:', res?.notSavedRow);
  //       }
  //       afterSave();
  //     }
  //   });
  // };
  const handleChange = async (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file) {
      let errMessage = 'Failed to upload file';
      try {
        const formData = new FormData();
        if (info?.file?.originFileObj) {
          formData.append('file', info?.file?.originFileObj);
        } else {
          formData.append('file', info?.file);
        }
        const res = await restApi.post(RouterAPI.uploadExcelDevice, formData);
        setLoading(false);
        if (res?.status == 200) {
          message.success('Upload file successful!');
          const notSaved = res?.data?.notSavedRow;
          if (notSaved) {
            openNotificationWithIcon('Cannot import at row:' + notSaved);
          }
          handleCancel();
          afterSave();
        } else {
          errMessage = res?.data?.message;
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
        message.error(errMessage);
      }
    }
  };
  const handelClickDownloadSampleFile = () => {
    const link = document.createElement('a');
    link.href = SAMPLE_EXCEL_FILE;
    const now = Date.now();
    link.setAttribute('download', `sample${now}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <>
      {contextHolder}
      <Modal
        okButtonProps={{ type: 'link', icon: <VerticalAlignBottomOutlined /> }}
        centered
        okText={t('downloadSampleFile')}
        cancelText="Đóng"
        zIndex={1300}
        maskClosable={false}
        title={'Upload File'}
        open={open}
        onOk={() => {
          handelClickDownloadSampleFile();
        }}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <OkBtn />
              <CancelBtn />
            </div>
          </>
        )}
      >
        <Upload
          showUploadList={false}
          name="file"
          accept=".xlsx"
          beforeUpload={(file) => {
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
              <span style={{ fontSize: '18px' }}>Upload Excel File</span>
            </Button>
          </div>
        </Upload>
      </Modal>
    </>
  );
};
export default ModalUploadExcelDevice;
