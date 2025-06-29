(function() {
  function extractTableData() {
    let data = [];
    const table = document.querySelector('div[data-qa-type="paragraph-output-tabls"] table, div[class^="_paragraphOutputTab_"] table');
    if (table) {
      data = Array.from(table.rows).map(row =>
        Array.from(row.cells).map(cell => cell.innerText.trim())
      );
    } else {
      const rows = document.querySelectorAll('div[data-qa-type="paragraph-output-tabls"] [data-output-table="row"], div[class^="_paragraphOutputTab_"] [data-output-table="row"]');
      rows.forEach(row => {
        const cells = row.querySelectorAll('[data-output-table="cell"]');
        const rowData = Array.from(cells).map(cell => cell.textContent.trim());
        data.push(rowData);
      });
    }
    return data;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractTableData') {
      const data = extractTableData();
      sendResponse({ data });
    }
  });
})();
