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
  var parsedDate = Date.parse(string);

  // You want to check again for !isNaN(parsedDate) here because Dates can be converted
  // to numbers, but a failed Date parse will not.
  if (isNaN(string) && !isNaN(parsedDate)) {
    return true;
  }
  return false;
};
