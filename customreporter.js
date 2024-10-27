const fs = require('fs')
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib')
const pdf = require('html-pdf')

class CustomReporter {
  constructor() {
    this.results = []
  }

  onTestEnd(test, result) {
    this.results.push({
      name: test.title,
      status: result.status,
      duration: result.duration,
    })
  }

  async onEnd(result) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PDF Report</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
          body {
              padding:10px;
            }
            .header {
              position: fixed;
              top: 0;
              width: 100%;
              text-align: center;
              color: #666;
              padding: 10px 0;
              background-color: #f9f9f9;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
              border-bottom: 1px solid #ccc;
              border-radius: 5px;
              transition: background-color 0.3s ease;
            }
            .header:hover {
              background-color: #e5e5e5;
            }
            .table-header {
              background-color: #f3f4f6;
              color: #333;
            }
            .table-row {
              border-bottom: 1px solid #e5e7eb;
            }
            .table-cell {
              padding: 12px;
              text-align: left;
            }
          </style>
      </head>
      <body class="font-sans">
          <div class="cover-page text-center bg-gradient-to-b from-green-500 to-green-700 p-12 text-white">
              <img src="https://www.rezeem.ae/assets/img/stores/ounass.jpg" alt="ounass logo" width="850" height="350">
          </div>
          <div class="container mx-auto mt-8">
              <table class="w-full border-collapse border border-gray-400">
                  <thead class="bg-gray-200">
                      <tr>
                          <th class="border border-gray-400 px-4 py-2">Document Title</th>
                          <th class="border border-gray-400 px-4 py-2">Test Environment Used</th>
                          <th class="border border-gray-400 px-4 py-2">Author (Created By)</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td class="border border-gray-400 px-4 py-2 text-center">Ounass Automation Testing Report</td>
                          <td class="border border-gray-400 px-4 py-2 text-center">Production Environment</td>
                          <td class="border border-gray-400 px-4 py-2 text-center">Rauf</td>
                      </tr>
                  </tbody>
              </table>
              <h1 class="text-2xl mt-8"><strong>Ounass Test Cases Description:</strong></h1>
              <p class="mt-2">The smoke testing phase for the Ounass has been successfully conducted to evaluate its basic functionality and stability. <br>
  This report includes these test cases which are as under:
  <br><br><strong>TC001)</strong> Verify Account Registration Process and verify it is the same email with which you registered the account
  <br>Expected Result: User account should be created successfully and in account details section it should be the same email with which user registered an account.
  <br><br><strong>TC002)</strong> Verify that after logging into the account the “Email-Address” field is un-editable.
  <br>Expected Result: After logging in, User Email should be un-editable; in the edit section, user cannot edit their email address.
  <br><br><strong>TC003)</strong> Verifying Adding different kinds of items into the bags.
  <br>Expected Result: User should select different types of items and should add the items into the bag.
  <br><br><strong>TC004)</strong> Verify that exactly the same items are added into the “Bag”.
  <br>Expected Result: Items should be added to the bag. These items should match with the items which the user added.

  <br><br><strong>TC005)</strong> Verify Subtotal amount is correct after calculating prices of all items in bag.
  <br>Expected Result: SubTotal Price should be correct after Adding prices of all items present in a bag.

  <br><br><strong>TC006)</strong> Verify customer lands to delivery address page on clicking secure checkout button.
  <br>Expected Result: User should be redirected to the delivery address page on clicking the secure checkout button.
  <br><br><strong>TC007)</strong> Verify delivery address information is entered successfully.
  <br>Expected Result: Delivery address information should be entered successfully, including street, apartment, first name, last name, etc.
  <br><br><strong>TC008)</strong> Verify customer lands to credit card page after entering delivery address information.
  <br>Expected Result: After entering valid delivery address information ,User should be redirected to the credit card page on clicking the continue button.
  <br><br><br> <span style="font-size: 20px;"><strong> To see the results of above test cases, visit below tables: </strong></span>
              </p>
          </div>
      </body>
      </html>
    `

const htmlPdfOptions = {
  format: 'A4',
  orientation: 'portrait',
};

const htmlPdf = await new Promise((resolve, reject) => {
  pdf.create(htmlContent, htmlPdfOptions).toBuffer((err, buffer) => {
    if (err) return reject(err);
    resolve(buffer);
  });
});

const htmlPdfDoc = await PDFDocument.load(htmlPdf);

// Create the test results PDF
const testResultsPdfDoc = await PDFDocument.create();
let testResultsPage = testResultsPdfDoc.addPage([600, 2000]);
const { height } = testResultsPage.getSize();
let y = height - 50;

const timesRomanFont = await testResultsPdfDoc.embedFont(StandardFonts.TimesRoman)
const timesRomanBoldFont = await testResultsPdfDoc.embedFont(StandardFonts.TimesRomanBold)

const totalTestCases = this.results.length;
const passedTestCases = this.results.filter(test => test.status === 'passed').length
const failedTestCases = this.results.filter(test => test.status === 'failed').length
const skippedTestCases = this.results.filter(test => test.status === 'skipped').length
const timeoutTestCases = this.results.filter(test => test.status === 'timedOut').length



// Draw summary table header
const drawSummaryTable = (page, y) => {
  const headers = ['Total Test Cases', 'Passed', 'Failed', 'Skipped', 'TimedOut']    //interrupted
  // const values = [totalTestCases.toString(), passedTestCases.toString() ? rgb(0, 0.8, 0)  : failedTestCases.toString() ? rgb(0.8, 0, 0): skippedTestCases.toString() ? rgb(1, 0.5, 0)]
  const values = [
    totalTestCases.toString(),
    passedTestCases.toString(),
    failedTestCases.toString(),
    skippedTestCases.toString(),
    timeoutTestCases.toString()
  ];

  const colors = [
    rgb(0, 0, 0), // Default color for total test cases
    rgb(0, 0.8, 0), // Color for passed
    rgb(0.8, 0, 0), // Color for failed
    rgb(1, 0.5, 0) // Color for skipped
  ];

  // Draw headers
  headers.forEach((header, index) => {
    page.drawText(header, {
      x: 50 + index * 111,
      y,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(1, 1, 1)
    })
  })

  y -= 20;

  values.forEach((value, index) => {
    const color = index === 1 ? colors[1] : // Passed
                index === 2 ? colors[2] : // Failed
                index === 3 ? colors[3] : // Skipped
                colors[0]

    page.drawText(value, {
      x: 60 + index * 111,
      y,
      size: 12,
      font: timesRomanBoldFont,
      color: color
    })
  })

  return y - 20;
}

// Draw summary table
testResultsPage.drawRectangle({
  x: 50,
  y: y - 20,
  width: 500,
  height: 20,
  color: rgb(0.3, 0.3, 0.3),
})
y = drawSummaryTable(testResultsPage, y - 15)

// Space between summary table and detailed results table
y += 9

// Remove the following lines to not draw "Test Results" heading
// testResultsPage.drawText('Test Results', {
//   x: 50,
//   y,
//   size: 20,
//   font: timesRomanFont,
//   color: rgb(0, 0, 0),
// });

// y -= 30;

const addTableHeader = (page, y) => {
  const headers = ['Test Case ID', '                                               Title', 'Status'];
  headers.forEach((header, index) => {
    const xPositions = [50, 150, 500]; // Adjust column positions for better alignment
    page.drawText(header, {
      x: xPositions[index],
      y,
      size: 12,
      font: timesRomanBoldFont,
      color: rgb(1, 1, 1),
    });
  });
};


const addRow = (page, rowData, y) => {
  rowData.forEach((data, index) => {
    const xPositions = [50, 150, 500]; // Adjust column positions for better alignment
    const font = (data === 'passed' || data === 'failed' || data === 'skipped')
                  ? timesRomanBoldFont
                  : timesRomanBoldFont;

    const color = data === 'passed' ? rgb(0, 0.8, 0)  // Green
                : data === 'failed' ? rgb(0.8, 0, 0)  // Red
                : data === 'skipped' ? rgb(1, 0.5, 0) // Orange
                : rgb(0, 0, 0);

    page.drawText(data, {
      x: xPositions[index],
      y,
      size: 12,
      font: font,
      color: color
    });
  });
};

const drawTableBorders = (page, startY, numRows) => {
  const rowHeight = 20;
  const tableWidth = 500;

  // Draw horizontal lines
  for (let i = 0; i <= numRows; i++) {
    const yPosition = startY - i * rowHeight;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: 50 + tableWidth, y: yPosition },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
  }

  // Draw vertical lines
  const cols = [50, 150, 500, 550]; // Adjust column positions for better alignment
  cols.forEach((colX) => {
    page.drawLine({
      start: { x: colX, y: startY },
      end: { x: colX, y: startY - rowHeight * numRows },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
  });
};

testResultsPage.drawRectangle({
  x: 50,
  y: y - 20,
  width: 500, // Adjust table width to accommodate wider columns
  height: 20,
  color: rgb(0.3, 0.3, 0.3),
});
addTableHeader(testResultsPage, y - 15)
y -= 39.99;       // Adjust table height to accommodate line

const maxLength = 65; // Increase max length for the title
const rowsPerPage = Math.floor((height - 100) / 20) - 2

this.results.forEach((testResult, index) => {
  if (index % rowsPerPage === 0 && index !== 0) {
    drawTableBorders(testResultsPage, height - 200, rowsPerPage + 2)
    testResultsPage = testResultsPdfDoc.addPage([600, 800])
    y = height - 50;

    // Remove the following lines to not draw "Test Results" heading
    // testResultsPage.drawText('Test Results', {
    //   x: 50,
    //   y,
    //   size: 20,
    //   font: timesRomanFont,
    //   color: rgb(0, 0, 0),
    // });
    // y -= 30;

    testResultsPage.drawRectangle({
      x: 50,
      y: y - 20,
      width: 500, // Adjust table width to accommodate wider columns
      height: 20,
      color: rgb(0.3, 0.3, 0.3),
    });
    addTableHeader(testResultsPage, y - 15);
    y -= 40;
  }

  const testCaseId = `TC00${index + 1}`
  const truncatedTitle = testResult.name.length > maxLength ? `${testResult.name.substring(0, maxLength)}...` : testResult.name;
  const rowData = [testCaseId, truncatedTitle, testResult.status]

  addRow(testResultsPage, rowData, y)
  y -= 20.03                         //Adjust row lines up and down
})

drawTableBorders(testResultsPage, y + (this.results.length % rowsPerPage + 1) * 20, this.results.length % rowsPerPage + 1);

const finalPdfDoc = await PDFDocument.create()
const [htmlPdfPage] = await finalPdfDoc.copyPages(htmlPdfDoc, [0])
const testResultsPages = await finalPdfDoc.copyPages(testResultsPdfDoc, testResultsPdfDoc.getPageIndices())

finalPdfDoc.addPage(htmlPdfPage)
testResultsPages.forEach(page => finalPdfDoc.addPage(page))

const pdfBytes = await finalPdfDoc.save()
fs.writeFileSync('test-results.pdf', pdfBytes)
console.log('PDF report generated as test-results.pdf')
  }
}

module.exports = CustomReporter



