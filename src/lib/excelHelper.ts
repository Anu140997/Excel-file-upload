// /lib/excelHelper.ts
import * as XLSX from 'xlsx';

export const readExcel = (file: File): Promise<XLSX.WorkSheet> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      resolve(worksheet);
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

export const processExcel = (worksheet: XLSX.WorkSheet): XLSX.WorkSheet => {
  const data = XLSX.utils.sheet_to_json(worksheet);
  // Process data here to combine Employee and Activity Code
  const processedData = data.map((row: any) => ({
    // ...row,
    EmployeeActivityCode: `${row.Employee} - ${row.ActivityCode}`
  }));
  console.log(processedData)
  return XLSX.utils.json_to_sheet(processedData);
};

export const writeExcel = (worksheet: XLSX.WorkSheet): Blob => {
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Processed Data');
  const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
