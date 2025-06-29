(function() {
  function extractTableData(depth = Infinity) {
    let limit = typeof depth === 'number' ? depth : Infinity;
    let data = [];

    const containerSelector =
      'div[data-qa-type="paragraph-output-tabls"], div[class^="_paragraphOutputTab_"], div[data-testid="output-content"]';

    const table = document.querySelector(`${containerSelector} table`);

    if (table) {
      data = Array.from(table.rows)
        .slice(0, limit)
        .map(row => Array.from(row.cells).map(cell => cell.innerText.trim()));
    } else {
      const container = document.querySelector(containerSelector);
      if (!container) return data;

      const headerRow = container.querySelector('[data-output-table="table-header"]');
      if (headerRow) {
        const headerCells = headerRow.querySelectorAll('[data-output-table="cell"]');
        const headers = Array.from(headerCells)
          .slice(1)
          .map(el => el.textContent.trim());
        data.push(headers);
      }

      const rows = container.querySelectorAll('[data-output-table="row"]');
      rows.forEach((row, index) => {
        if (index >= limit) return;
        const cells = row.querySelectorAll('[data-output-table="cell"]');
        const rowData = Array.from(cells)
          .slice(1)
          .map(cell => cell.textContent.trim());
        data.push(rowData);
      });
    }

    return data;
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractTableData') {
      const data = extractTableData(message.depth);
      sendResponse({ data });
    }
  });
})();
