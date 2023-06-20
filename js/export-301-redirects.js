/* Export a CSV of 301 redirects from the Webflow site settings */
/* To run:
    1. Navigate to https://webflow.com/dashboard/sites/MYSITENAME/publishing
    2. Select the text 301 redirects with your cursor (this is necessary because there's very little for us to hook off in the DOM to find the actual redirects list)
    3. Run the below in dev tools.
*/

// Get the highlighted text
const selection = window.getSelection();
if (selection.rangeCount > 0) {
  const range = selection.getRangeAt(0);  
  
    // Find the closest parent section element
    const sectionElement = range.commonAncestorContainer.closest('section');
    
    // Find the table element within the section element
    const tableElement = sectionElement.querySelector('table');
    if (tableElement) {
		// Call the function to generate the CSV
		generateCSV(tableElement);
	}
    
  }

// Assuming you have a global variable named 'tableElement' which references the <table> element

function generateCSV(tableElement) {
  let csvContent = "";

  // Loop through all rows in the table
  const rows = tableElement.getElementsByTagName('tr');
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const spans = row.querySelectorAll('span[data-sc="BodyLarge Text"]');

    // Get the contents of the first and second spans in the row
    const firstSpanContent = spans[0].textContent.trim().replace(/"/g, '""');
    const secondSpanContent = spans[1].textContent.trim().replace(/"/g, '""');

    // Add the values to the CSV content
    csvContent += `"${firstSpanContent}","${secondSpanContent}"\n`;
  }

  // Create a link element to download the CSV file
  const link = document.createElement("a");
  const csvData = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const csvUrl = URL.createObjectURL(csvData);
  link.setAttribute("href", csvUrl);
  link.setAttribute("download", "table_data.csv");
  document.body.appendChild(link);

  // Click the link to trigger the download
  link.click();

  // Clean up the created URL
  URL.revokeObjectURL(csvUrl);
}


