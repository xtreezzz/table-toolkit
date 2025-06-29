// Content script to show a button on Zeppelin output tables
(function() {
  // Create a single reusable button element
  const hoverButton = document.createElement('button');
  hoverButton.textContent = 'Забрать данные';
  hoverButton.style.position = 'absolute';
  hoverButton.style.top = '5px';
  hoverButton.style.right = '5px';
  hoverButton.style.zIndex = '9999';
  hoverButton.style.background = '#569cd6';
  hoverButton.style.color = '#fff';
  hoverButton.style.border = 'none';
  hoverButton.style.borderRadius = '4px';
  hoverButton.style.padding = '4px 6px';
  hoverButton.style.fontSize = '12px';
  hoverButton.style.cursor = 'pointer';
  hoverButton.style.display = 'none';

  let currentContainer = null;

  // Hide button helper
  function hideButton() {
    hoverButton.style.display = 'none';
    if (currentContainer) {
      currentContainer.removeEventListener('mouseleave', hideButton);
      currentContainer = null;
    }
  }

  // Parse table data inside container and store it
  function extractTableData(container) {
    let data = [];

    const table = container.querySelector('table');
    if (table) {
      data = Array.from(table.rows).map(row =>
        Array.from(row.cells).map(cell => cell.innerText.trim())
      );
    } else {
      const rows = container.querySelectorAll('[data-output-table="row"]');
      rows.forEach(row => {
        const cells = row.querySelectorAll('[data-output-table="cell"]');
        const rowData = Array.from(cells).map(cell => cell.textContent.trim());
        data.push(rowData);
      });
    }

    if (data.length === 0) {
      console.log('Table Toolkit: no table found in container');
      return;
    }

    chrome.storage.local.set({ parsedTableData: data }, () => {
      console.log('Table Toolkit: table data saved', data);
    });
  }

  hoverButton.addEventListener('click', () => {
    if (currentContainer) {
      extractTableData(currentContainer);
      // Request to open the extension popup
      chrome.runtime.sendMessage({ action: 'openPopup' });
    }
  });

  document.addEventListener('mouseover', (e) => {
    const container = e.target.closest('div[data-qa-type="paragraph-output-tabls"], div[class^="_paragraphOutputTab_"]');
    if (!container) return;

    // Ensure container has positioning context
    const computedStyle = window.getComputedStyle(container);
    if (computedStyle.position === 'static') {
      container.style.position = 'relative';
    }

    container.appendChild(hoverButton);
    hoverButton.style.display = 'block';
    currentContainer = container;
    container.addEventListener('mouseleave', hideButton);
  });
})();
