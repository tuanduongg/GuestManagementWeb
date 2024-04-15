import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField } from '@mui/material';
import { message } from 'antd';

import { useState } from 'react';
import { useEffect } from 'react';
import TableCategory from './component/TableCategory';
import { CloseOutlined } from '@ant-design/icons';
import { RouterAPI } from 'utils/routerAPI';
import restApi from 'utils/restAPI';

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
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [name, setName] = useState('');
  const [validateName, setValidateName] = useState(initValidate);

  const onClose = (e, reason) => {
    if (reason != 'backdropClick') {
      setSelectedRow(null);
      setName('');
      handleClose();
    }
  };

  const onChangeSelectedRow = (row) => {
    setSelectedRow(row);
    setName(row?.categoryName ?? '');
  };
  const handleSave = async () => {
    let data = {};
    let url = RouterAPI.addCategory;
    let textSucces = '';
    if (selectedRow) {
      textSucces = 'Update category success!';
      data = { categoryID: selectedRow?.categoryID, categoryName: name };
      url = RouterAPI.updateCategory;
    } else {
      textSucces = 'Add new category success!';
      data = { categoryName: name };
    }
    const res = await restApi.post(url, data);
    if (res?.status === 200) {
      if (!selectedRow) {
        setName('');
      }
      afterSave();
    }
    message.success(textSucces);
  };
  const handleClickAdd = () => {
    if (name?.trim() === '') {
      setValidateName({ err: true, msg: 'Category is required.' });
    } else {
      handleSave();
    }
  };
  const handleClickDeleteRow = (row) => {
    alert(row?.categoryName ?? '');
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '500px' }}>
          <DialogTitle fontSize={'15px'} sx={{ padding: '10px' }}>
            Danh mục
          </DialogTitle>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Box>
        <Divider />
        <DialogContent>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Grid container spacing={1}>
              <Grid item xs={8} sm={9}>
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
              <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }} item xs={4} sm={3}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleClickAdd}
                  color="primary"
                  autoFocus
                  // endIcon={selectedRow ? <SaveIcon /> : <AddIcon />}
                >
                  {selectedRow ? 'Cập nhật' : `Thêm mới`}
                </Button>
              </Grid>
            </Grid>
            <Grid container sx={{marginTop:'10px'}}>
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
