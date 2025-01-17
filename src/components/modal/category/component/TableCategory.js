import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button } from '@mui/material';
import { useState } from 'react';
import copy from 'copy-to-clipboard';

import { message } from 'antd';
import { useTranslation } from 'react-i18next';

const TableCategory = ({ listCategory, changeSelectedRow, selectedRow, onClickDelete }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const columns = [
    {
      id: 'STT',
      label: '#',
      // minWidth: 170,
      align: 'center'
    },
    {
      id: 'name',
      label: t('category'),
      // minWidth: 170,
      align: 'left'
    },
    {
      id: 'type',
      label: t('type'),
      // minWidth: 170,
      align: 'center'
    },
    {
      id: 'copy',
      label: '',
      // minWidth: 170,
      align: 'center'
    }
  ];

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(+event.target.value);
  };
  return (
    <>
      {contextHolder}
      <Box sx={{ backgroundColor: 'white' }}>
        <TableContainer sx={{ height: '350px' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listCategory?.length > 0 ? (
                listCategory.map((row, index) => {
                  return (
                    <TableRow
                      sx={{
                        '&.Mui-selected': { backgroundColor: '#3641524f' },
                        '&.Mui-selected:hover': {
                          backgroundColor: '#3641524f'
                        }
                      }}
                      selected={row?.categoryID === selectedRow?.categoryID}
                      onClick={() => {
                        if (selectedRow?.categoryID === row?.categoryID) {
                          changeSelectedRow(null);
                        } else {
                          changeSelectedRow(row);
                        }
                      }}
                      //   hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.categoryID}
                    >
                      <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{index + 1}</TableCell>
                      <TableCell sx={{ padding: '5px', textAlign: 'left' }}>{row?.categoryName}</TableCell>
                      <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{row?.categoryType}</TableCell>
                      <TableCell sx={{ padding: '5px', textAlign: 'center' }}>
                        {row?.categoryID === selectedRow?.categoryID && (
                          <Button
                            onClick={() => {
                              copy(row?.categoryID, { message: false, });
                              message.success('Copy scuccessful!')
                            }}
                            size="small"
                          >
                            Copy Id
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns?.length + 1}>Nodata</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default TableCategory;
