import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useState } from 'react';

const columns = [
  {
    id: 'STT',
    label: '#',
    // minWidth: 170,
    align: 'center'
  },
  {
    id: 'UNIT',
    label: 'Đơn vị',
    // minWidth: 170,
    align: 'left'
  }
];

const TableUnit = ({ listUnit, changeSelectedRow, selectedRow, onClickDelete }) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(+event.target.value);
  };
  return (
    <>
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
              {listUnit?.length > 0 ? (
                listUnit.map((row, index) => {
                  return (
                    <TableRow
                      sx={{
                        '&.Mui-selected': { backgroundColor: '#3641524f' },
                        '&.Mui-selected:hover': {
                          backgroundColor: '#3641524f'
                        }
                      }}
                      selected={row?.id === selectedRow?.id}
                      onClick={() => {
                        if (selectedRow?.id === row?.id) {
                          changeSelectedRow(null);
                        } else {
                          changeSelectedRow(row);
                        }
                      }}
                      //   hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{index + 1}</TableCell>
                      <TableCell sx={{ padding: '5px', textAlign: 'left' }}>{row?.name}</TableCell>
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

export default TableUnit;
