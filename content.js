(function() {
  function extractTableData(depth = Infinity) {
    const limit = typeof depth === 'number' ? depth : Infinity;
    const result = { headers: [], data: [] };

    const container = document.querySelector(
      'div[data-testid="output-content"], div[data-qa-type="paragraph-output-tabls"], div[class^="_paragraphOutputTab_"]'
    );

    if (!container) {
      console.log('Table container not found');
      return [result.headers, ...result.data];
    }

    console.log('Table container found');

    const table = container.querySelector('table');
    if (table) {
      console.log('Native table detected');
      const headerRow = table.querySelector('thead tr') || table.rows[0];
      if (headerRow) {
        result.headers = Array.from(headerRow.cells)
          .slice(1)
          .map(cell => cell.innerText.trim());
        console.log('Headers:', result.headers);
      }

      const rows = Array.from(table.querySelectorAll('tbody tr'));
      rows.slice(0, limit).forEach(row => {
        const cells = Array.from(row.cells)
          .slice(1)
          .map(cell => cell.innerText.trim());
        result.data.push(cells);
      });
      console.log('Rows collected:', result.data.length);
    } else {
      console.log('Native table not found, scanning custom output rows');

      const headerRow = container.querySelector('[data-output-table="table-header"]');
      if (headerRow) {
        const headerCells = headerRow.querySelectorAll('[data-output-table="cell"], [class^="_tableCellContentHeader_"]');
        result.headers = Array.from(headerCells)
          .slice(1)
          .map(el => el.textContent.trim());
        console.log('Headers:', result.headers);
      } else {
        console.log('Header row not found');
      }

      const rows = container.querySelectorAll('[data-output-table="row"]');
      rows.forEach((row, index) => {
        if (index >= limit) return;
        const cells = row.querySelectorAll('[data-output-table="cell"], [class^="_tableCellContent_"]');
        const rowData = Array.from(cells)
          .slice(1)
          .map(el => el.textContent.trim());
        result.data.push(rowData);
      });
      console.log('Rows collected:', result.data.length);
    }

    return [result.headers, ...result.data];
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractTableData') {
      const data = extractTableData(message.depth);
      sendResponse({ data });
    }
  });
})();
