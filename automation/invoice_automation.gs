function checkInvoices() {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Finance");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var invoiceCol = headers.indexOf("Invoice_ID");
  var orderCol = headers.indexOf("Order_ID");
  var expenceCol = headers.indexOf("Expence_Category");
  var amountCol = headers.indexOf("Amount");
  var budget = headers.indexOf("Budget");
  var statusCol = headers.indexOf("Payment_Status");
  var dueDateCol = headers.indexOf("Due_Date");
  var expenceTypeCol = headers.indexOf("Expense_Type");
  var lastPaymentCol = headers.indexOf("Last_Payment_Type");
  var remaiderCol = headers.indexOf("Remainder_Sent");

  var today = new Date();
  today.setHours(0,0,0,0);

  var overdueList = [];
  var upcomingList = [];

  var backgrounds = sheet.getDataRange().getBackgrounds();

  for (var i = 1; i < data.length; i++) {

    var dueDate = new Date(data[i][dueDateCol]);
    var status = data[i][statusCol];

    if (!dueDate || isNaN(dueDate)) continue;

    dueDate.setHours(0,0,0,0);
    var diffDays = (dueDate - today) / (1000 * 60 * 60 * 24);

    for (var c = 0; c < backgrounds[i].length; c++) {
      backgrounds[i][c] = "#ffffff";
    }
    
    if (status.toString().toLowerCase() !== "paid") {

      if (diffDays < 0) {
        backgrounds[i].fill("pink");
        overdueList.push(
          data[i][invoiceCol] + " | " +
          data[i][orderCol] + " | ₹" +
          data[i][amountCol] + " | Due: " +
          dueDate.toDateString()
        );
      }

      else if (diffDays <= 5) {
        backgrounds[i].fill("#fff2cc"); // yellow
        upcomingList.push(
          data[i][invoiceCol] + " | " +
          data[i][vendorCol] + " | ₹" +
          data[i][amountCol] + " | Due: " +
          dueDate.toDateString()
        );
      }
    }
  }

  sheet.getDataRange().setBackgrounds(backgrounds);

  if (overdueList.length > 0) {
    var emailBody =
      "Overdue Invoices:\n\n" + overdueList.join("\n") +
      "\n\nInvoices Due in Next 5 Days:\n\n" + upcomingList.join("\n");

    GmailApp.sendEmail(
      "your_email@gmail.com",
      "Invoice Alert: Overdue & Upcoming Payments",
      emailBody
    );
  }
}

