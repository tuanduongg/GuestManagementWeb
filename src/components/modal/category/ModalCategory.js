import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField } from '@mui/material';
import { message } from 'antd';

import { useState, useTransition } from 'react';
import { useEffect } from 'react';
import TableCategory from './component/TableCategory';
import { CloseOutlined } from '@ant-design/icons';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';
import { useTranslation } from 'react-i18next';
import { isMobile } from 'utils/helper';

const initValidate = { err: false, msg: '' };

// const formatPrice = (value) => {
//   // Xóa các ký tự không phải số từ giá trị nhập vào
//   const sanitizedValue = value.replace(/[^0-9]/g, '');

//   // Kiểm tra xem giá trị sau khi xóa ký tự có bằng không hay không
//   if (sanitizedValue !== '') {
//     if (value) {
//       const sanitizedValue = value.replace(/[^0-9]/g, '');

//       // Chuyển định dạng số thành chuỗi có dấu phẩy ngăn cách hàng nghìn
//       const formattedValue = new Intl.NumberFormat('en-US').format(parseInt(sanitizedValue, 10));

//       return formattedValue.replace(',', '.');
//     }
//     return value;
//   }
//   return '';
// };
const ModalCategory = ({ open, fullScreen, handleClose, afterSave, categories, getAll }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [name, setName] = useState('');
  const [validateName, setValidateName] = useState(initValidate);
  const [type, setType] = useState('');
  const [validateType, setValidateType] = useState(initValidate);

  const onClose = (e, reason) => {
    if (reason != 'backdropClick') {
      setSelectedRow(null);
      setName('');
      setType('');
      handleClose();
    }
  };

  const onChangeSelectedRow = (row) => {
    setSelectedRow(row);
    setName(row?.categoryName ?? '');
    setType(row?.categoryType ?? '');
  };
  const handleSave = async () => {
    let data = {};
    let url = RouterAPI.addCategory;
    let textSucces = '';
    if (selectedRow) {
      textSucces = 'Update category success!';
      data = { categoryID: selectedRow?.categoryID, categoryName: name, categoryType: type };
      url = RouterAPI.updateCategory;
    } else {
      textSucces = 'Add new category success!';
      data = { categoryName: name, categoryType: type };
    }
    const res = await restApi.post(url, data);
    if (res?.status === 200) {
      if (!selectedRow) {
        setName('');
        setType('');
      }
      afterSave();
    }
    message.success(textSucces);
  };
  const handleClickAdd = () => {
    let check = false;
    if (type?.trim() === '') {
      check = true;
      setValidateType({ err: true, msg: 'Type is required.' });
    }
    if (name?.trim() === '') {
      check = true;
      setValidateName({ err: true, msg: 'Category is required.' });
    }
    if (!check) {
      handleSave();
    }
  };
  const handleClickDeleteRow = (row) => {
    // alert(row?.categoryName ?? '');
  };

  return (
    <>
      <Dialog
        disableEscapeKeyDown={true}
        maxWidth={'sm'}
        sx={{ minHeight: '90vh' }}
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: isMobile() ? 'auto' : '500px' }}>
          <DialogTitle fontSize={'15px'} sx={{ padding: '10px' }}>
            {t('category')}
          </DialogTitle>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Box>
        <Divider />
        <DialogContent>
          <Box sx={{ width: '100%', height: '100%', minWidth: isMobile() ? 'auto' : '500px' }}>
            <Grid container spacing={1}>
              <Grid item xs={4} sm={6}>
                <TextField
                  error={validateName?.err}
                  helperText={validateName?.msg}
                  onChange={(e) => {
                    if (validateName?.err) {
                      setValidateName(initValidate);
                    }
                    setName(e?.target?.value);
                  }}
                  sx={{ height: '100%' }}
                  fullWidth
                  placeholder="Typing your name of category..."
                  size="small"
                  value={name}
                  label="Category"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4} sm={3.5}>
                <TextField
                  error={validateType?.err}
                  helperText={validateType?.msg}
                  onChange={(e) => {
                    if (validateType?.err) {
                      setValidateType(initValidate);
                    }
                    setType(e?.target?.value);
                  }}
                  sx={{ height: '100%' }}
                  fullWidth
                  placeholder="Typing your type name of category..."
                  size="small"
                  value={type}
                  label="Type"
                  variant="outlined"
                />
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }} item xs={4} sm={2.5}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleClickAdd}
                  color="primary"
                  autoFocus
                  // endIcon={selectedRow ? <SaveIcon /> : <AddIcon />}
                >
                  {selectedRow ? t('btnEdit') : t(`btn_new`)}
                </Button>
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: '10px' }}>
              <Grid item xs={12}>
                <TableCategory
                  onClickDelete={handleClickDeleteRow}
                  selectedRow={selectedRow}
                  changeSelectedRow={onChangeSelectedRow}
                  listCategory={categories}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalCategory;
