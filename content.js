(function() {
  function extractTableData(depth = Infinity) {
    let limit = typeof depth === 'number' ? depth : Infinity;
    console.log('extractTableData invoked with limit:', limit);
    let data = [];

    const containerSelector =
      'div[data-qa-type="paragraph-output-tabls"], div[class^="_paragraphOutputTab_"], div[data-testid="output-content"]';
    console.log('Searching containers using selector:', containerSelector);

    const table = document.querySelector(`${containerSelector} table`);
    if (table) {
      console.log('Found HTML <table> with', table.rows.length, 'rows');
    }


    if (table) {
      data = Array.from(table.rows)
        .slice(0, limit)
        .map(row => Array.from(row.cells).map(cell => cell.innerText.trim()));
    } else {
      const container = document.querySelector(containerSelector);
      if (!container) {
        console.warn('No table container found');
        return data;
      }
      console.log('Container found, searching for custom table rows');

      const headerRow = container.querySelector('[data-output-table="table-header"]');
      if (headerRow) {
        console.log('Header row detected');

        const headerCells = headerRow.querySelectorAll('[data-output-table="cell"]');
        const headers = Array.from(headerCells)
          .slice(1)
          .map(el => el.textContent.trim());
        data.push(headers);
      } else {
        console.log('No custom header row found');
      }

      const rows = container.querySelectorAll('[data-output-table="row"]');
      console.log('Found', rows.length, 'custom data rows');

      rows.forEach((row, index) => {
        if (index >= limit) return;
        const cells = row.querySelectorAll('[data-output-table="cell"]');
        const rowData = Array.from(cells)
          .slice(1)
          .map(cell => cell.textContent.trim());
        data.push(rowData);
      });
    }
    console.log('Extraction result length:', data.length);

    return data;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractTableData') {
      const data = extractTableData(message.depth);
      sendResponse({ data });
    }
  });
})();