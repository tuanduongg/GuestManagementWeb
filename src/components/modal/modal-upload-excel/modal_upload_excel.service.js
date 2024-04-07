import ExcelJS from 'exceljs';

export const checkIsExcelFile = (type) => {
  return type?.toLocaleLowerCase() === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
};
export function handleFileUpload(event) {
  console.log('event', event);
  const file = event;
  const reader = new FileReader();

  reader.onload = function (e) {
    const buffer = e.target.result;

    // Read the Excel file buffer
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx
      .load(buffer)
      .then(function () {
        const worksheet = workbook.getWorksheet(1); // Assuming the data is on the first worksheet

        // Iterate over rows
        worksheet.eachRow(function (row, rowNumber) {
          // Iterate over cell values in each row
          row.eachCell(function (cell, colNumber) {
            console.log(`Row ${rowNumber}, Column ${colNumber} = ${cell.value}`);
          });
        });
      })
      .catch(function (error) {
        console.error('Error reading Excel file:', error);
      });
  };

  reader.readAsArrayBuffer(file);
}
export const checkStringIsDate = (string) => {
  // Regular expression to match common date formats (MM/DD/YYYY, YYYY/MM/DD, DD/MM/YYYY)
  var dateFormatRegex =
    /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$|^((19|20)\d{2})-(0?[1-9]|1[0-2])-(0?[1-9]|1\d|2\d|3[01])$|^(0?[1-9]|1\d|2\d|3[01])-(0?[1-9]|1[0-2])-(19|20)\d{2}$/;

  return dateFormatRegex.test(string);
};

export const checkDateContaintInArr = (arr, date) => {};
