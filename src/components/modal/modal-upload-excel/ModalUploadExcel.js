import React, { useEffect, useRef, useState } from 'react';
import { Modal, Upload, message, notification, Space, Button } from 'antd';
import { checkIsExcelFile, checkStringIsDate } from './modal_upload_excel.service';
const { Dragger } = Upload;
import ExcelJS from 'exceljs';
import { InboxOutlined, FileExcelOutlined } from '@ant-design/icons';
import './modal_upload_excel.css';
import restApi from 'utils/restAPI';
import { RouterAPI } from 'utils/routerAPI';
import { createDateWithCurrentDate, formatDate, getAllDatesInRange } from 'utils/helper';
import { useTranslation } from 'react-i18next';

const ModalUploadExcel = ({ open, handleClose, afterSave, setLoading }) => {
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
  const handleSaveGuest = async (data) => {
    setLoading(true);
    let url = RouterAPI.addGuest;
    const rest = await restApi.post(url, data);
    setLoading(false);
    handleClose();
    if (rest?.status === 200) {
      afterSave(rest);
    }
  };

  const readDataFromFile = (data) => {
    let errFlag = false;
    var workbook = new ExcelJS.Workbook();
    workbook.xlsx.load(data).then((workbook) => {
      const worksheet = workbook.getWorksheet(1);
      const arrDate = [];
      const guest = {
        company: '',
        carNumber: '',
        personSeowon: '',
        department: '',
        reason: '',
        timeIn: '',
        timeOut: '',
        date: [],
        names: []
      };

      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 5) {
          const values = row.values;
          if (values?.length !== 12) {
            errFlag = true;
            openNotificationWithIcon('Check format file upload!');
          } else {
            let valueCell3 = row.getCell('C').value; //3
            let valueCell4 = row.getCell('D').value; //4
            let valueCell5 = row.getCell('E').value; //5
            let valueCell6 = row.getCell('F').value; //6
            let valueCell7 = row.getCell('G').value; //7
            let valueCell8 = row.getCell('H').value; //8
            let valueCell9 = row.getCell('I').value; //9
            let valueCell10 = row.getCell('J').value; //10
            let valueCell11 = row.getCell('K').value; //11
            if (!valueCell3.includes('~')) {
              let dateFormat = formatDate(valueCell3);
              if (dateFormat) {
                if (!arrDate.includes(dateFormat)) {
                  guest.date.push(dateFormat);
                }
              } else {
                errFlag = true;
                openNotificationWithIcon(`Value is not the Date type at row:${rowIndex} column:C`);
                return false;
              }
            } else {
              const dates = valueCell3.split('~');
              if (dates.length !== 2) {
                errFlag = true;
                openNotificationWithIcon(`Check format Date ${valueCell3} at row:${rowIndex} column:C`);
                return false;
              } else {
                let checkDate1 = formatDate(dates[0]);
                let checkDate2 = formatDate(dates[1]);
                if (checkDate1 && checkDate2) {
                  if(guest.date.length <= 0) {
                    guest.date = getAllDatesInRange(checkDate1, checkDate2);
                  }
                } else {
                  errFlag = true;
                  openNotificationWithIcon(`Check format Date ${valueCell3} at row:${rowIndex} column:C`);
                  return false;
                }
              }
            }

            if (!valueCell4 || valueCell4?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:D`);
              return false;
            }
            if (!valueCell6 || valueCell6?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:F`);
              return false;
            }
            if (!valueCell7 || valueCell7?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:G`);
              return false;
            }
            if (!valueCell8 || valueCell8?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:H`);
              return false;
            }
            if (!valueCell9 || valueCell9?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:I`);
              return false;
            }
            if (!valueCell10 || valueCell10?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:J`);
              return false;
            }
            if (!valueCell11 || valueCell11?.trim() === '') {
              errFlag = true;
              openNotificationWithIcon(`Not empty content at row:${rowIndex} column:K`);
              return false;
            }

            guest.company = valueCell6;
            if (valueCell5?.trim() !== '') {
              guest.carNumber = valueCell5;
            }
            guest.personSeowon = valueCell10;
            guest.department = valueCell11;
            guest.reason = valueCell7;
            guest.timeIn = createDateWithCurrentDate(valueCell8);
            guest.timeOut = createDateWithCurrentDate(valueCell9);
            if (!guest.names.find((item) => item?.FULL_NAME.toLocaleLowerCase() === valueCell4.trim().toLocaleLowerCase())) {
              guest.names.push({
                FULL_NAME: valueCell4.trim(),
                NAME_ID: '',
                isShow: true
              });
            }
          }
        }
      });
      if (!errFlag) {
        handleSaveGuest(guest);
        // console.log(guest);
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
              <span style={{ fontSize: '18px' }}>Upload Excel File</span>
            </Button>
          </div>
        </Upload>
      </Modal>
    </>
  );
};
export default ModalUploadExcel;
