import {
  Box,
  Button,
  CardMedia,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import TableCategory from './component/TableCategory';
import { CloseOutlined } from '@ant-design/icons';

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
const DATA = [
  { categoryID: 1, categoryName: 'Văn phòng phẩm' },
  { categoryID: 2, categoryName: 'Hàng sản xuất' },
  { categoryID: 3, categoryName: 'Đồ ăn/Thức uống' }
];
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
    // let data = {};
    // let url = DefineRouteApi.addCategory;
    // let textSucces = '';
    // if (selectedRow) {
    //   textSucces = 'Update category success!';
    //   data = { categoryID: selectedRow?.categoryID, categoryName: name };
    //   url = DefineRouteApi.updateCategory;
    // } else {
    //   textSucces = 'Add new category success!';
    //   data = { categoryName: name };
    // }
    // const res = await restApi.post(url, data);
    // if (res?.status === 200) {
    //   if (!selectedRow) {
    //     setName('');
    //   }
    //   // getAll();
    // }
    // afterSave(res, textSucces);
  };
  const handleClickAdd = () => {
    // if (name?.trim() === '') {
    //   setValidateName({ err: true, msg: 'Category is required.' });
    // } else {
    //   ShowQuestion({
    //     content: `Do you want to ${selectedRow ? 'update' : 'add new'} category?`,
    //     titleProp: 'Category',
    //     icon: 'warning',
    //     onClickYes: () => {
    //       handleSave();
    //     }
    //   });
    // }
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle fontSize={'20px'} sx={{ padding: '10px' }}>
            Category
          </DialogTitle>
          <IconButton onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Box>
        <Divider />
        <DialogContent>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={9.5}>
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
              <Grid item xs={2.5}>
                <Button
                  sx={{ height: '40px' }}
                  size="medium"
                  variant="contained"
                  onClick={handleClickAdd}
                  color="primary"
                  autoFocus
                  // endIcon={selectedRow ? <SaveIcon /> : <AddIcon />}
                >
                  {selectedRow ? 'Save' : `Add`}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TableCategory
                  onClickDelete={handleClickDeleteRow}
                  selectedRow={selectedRow}
                  changeSelectedRow={onChangeSelectedRow}
                  listCategory={DATA}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        {/* <DialogActions>
          <Button size="small" variant="contained" color="primary" autoFocus endIcon={<SaveIcon />} onClick={handleClickSave}>
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default ModalCategory;
