function clearSheetData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("WpAuto V1");
    sheet.getRange('B5').clearContent();
    sheet.getRange('B9').clearContent();
    sheet.getRange('B2').clearContent();
    sheet.getRange('B3').clearContent();
    sheet.getRange('B4').clearContent();
    if(sheet.getRange('B6').getValue() !== ""){
      sheet.getRange('B6').clearContent();
      } 
}
