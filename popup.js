document.addEventListener('DOMContentLoaded', () => {
  const getDataButton = document.getElementById('get-data');
  const describeDataButton = document.getElementById('describe-data');
  const tableDescription = document.getElementById('table-description');
  const columnsContainer = document.getElementById('columns-container');
  const sendToWikiButton = document.getElementById('send-to-wiki');

  let tableHistory = {
    history: [''],
    index: 0
  };
  let columnHistories = {};

  // --- Mock Data ---
  const mockEmployeeData = [
    { "employee_id": 101, "name": "Alice Smith", "department": "Sales", "hire_date": "2019-03-15", "salary": 70000, "performance_score": 4.5, "bonus_eligibility": true },
    { "employee_id": 102, "name": "Bob Johnson", "department": "Engineering", "hire_date": "2020-07-22", "salary": 95000, "performance_score": 4.8, "bonus_eligibility": true },
    { "employee_id": 103, "name": "Carol Lee", "department": "HR", "hire_date": "2018-11-05", "salary": 60000, "performance_score": 4.2, "bonus_eligibility": false },
    { "employee_id": 104, "name": "David Brown", "department": "Marketing", "hire_date": "2021-01-10", "salary": 65000, "performance_score": 4.1, "bonus_eligibility": true }
  ];

  const mockDescriptions = {
    "employee_id": { "description": "Уникальный числовой идентификатор сотрудника", "example": 103 },
    "name": { "description": "Полное имя сотрудника", "example": "Carol Lee" },
    "department": { "description": "Название отдела, в котором работает сотрудник", "example": "HR" },
    "hire_date": { "description": "Дата приёма на работу (формат YYYY-MM-DD)", "example": "2018-11-05" },
    "salary": { "description": "Годовая базовая зарплата сотрудника в долларах США", "example": 60000 },
    "performance_score": { "description": "Оценка эффективности сотрудника по шкале от 1 до 5", "example": 4.2 },
    "bonus_eligibility": { "description": "Признак права на получение бонуса (логическое значение)", "example": false },
    "table_description": "Таблица Employee Performance Data содержит информацию о сотрудниках за определённый период: уникальный идентификатор, ФИО, отдел, дату приёма на работу, базовую годовую зарплату, оценку эффективности и признак права на бонус."
  };

  // --- Event Listeners ---

  getDataButton.addEventListener('click', () => {
    columnsContainer.innerHTML = ''; // Clear previous content
    tableDescription.value = ''; // Clear description

    if (mockEmployeeData.length === 0) return;

    const headers = Object.keys(mockEmployeeData[0]);

    headers.forEach((header, index) => {
      columnHistories[header] = {
        history: [''],
        index: 0
      };
      const rowDiv = document.createElement('div');
      rowDiv.className = 'column-row';
      rowDiv.dataset.columnName = header;

      const values = mockEmployeeData.map(row => row[header]).join('\n');

      rowDiv.innerHTML = `
        <div class="column-number">${index + 1}</div>
        <div class="column-name"><b>${header}</b></div>
        <div class="column-values">${values}</div>
        <div class="column-description">
          <textarea placeholder="Введите точное описание или задайте контекст поля..."></textarea>
          <div class="description-actions">
            <input type="checkbox" id="exact-description-${header}" class="exact-description-checkbox">
            <label for="exact-description-${header}">Точное описание</label>
            <button class="revert-btn">revert</button>
            <button class="forward-btn">forward</button>
          </div>
        </div>
        <div class="column-actions">
          <button class="like-btn">👍</button>
          <button class="dislike-btn">👎</button>
        </div>
      `;
      columnsContainer.appendChild(rowDiv);
    });
  });

  describeDataButton.addEventListener('click', () => {
    const newDescription = mockDescriptions.table_description;
    tableDescription.value = newDescription;
    tableHistory.history = tableHistory.history.slice(0, tableHistory.index + 1);
    tableHistory.history.push(newDescription);
    tableHistory.index++;

    const columnRows = columnsContainer.querySelectorAll('.column-row');
    columnRows.forEach(row => {
      const columnName = row.dataset.columnName;
      const descriptionTextarea = row.querySelector('textarea');
      if (mockDescriptions[columnName]) {
        const newDescription = mockDescriptions[columnName].description;
        descriptionTextarea.value = newDescription;

        const historyData = columnHistories[columnName];
        if (historyData) {
          historyData.history = historyData.history.slice(0, historyData.index + 1);
          historyData.history.push(newDescription);
          historyData.index++;
        }
      }
    });
  });

  sendToWikiButton.addEventListener('click', () => {
    console.log('Data sent to wiki!');
    alert('Data sent to Wiki!');
  });

  columnsContainer.addEventListener('click', (e) => {
    const columnRow = e.target.closest('.column-row');
    if (!columnRow) return;
    const columnName = columnRow.dataset.columnName;

    if (e.target.classList.contains('like-btn') || e.target.classList.contains('dislike-btn')) {
      console.log(`Action on column \"${columnName}\"`);
      alert(`Action on: ${columnName}`);
    } else if (e.target.classList.contains('revert-btn')) {
      const historyData = columnHistories[columnName];
      if (historyData && historyData.index > 0) {
        historyData.index--;
        const descriptionTextarea = columnRow.querySelector('textarea');
        descriptionTextarea.value = historyData.history[historyData.index];
      }
    } else if (e.target.classList.contains('forward-btn')) {
      const historyData = columnHistories[columnName];
      if (historyData && historyData.index < historyData.history.length - 1) {
        historyData.index++;
        const descriptionTextarea = columnRow.querySelector('textarea');
        descriptionTextarea.value = historyData.history[historyData.index];
      }
    }
  });

  document.getElementById('revert-table-description').addEventListener('click', () => {
    if (tableHistory.index > 0) {
      tableHistory.index--;
      tableDescription.value = tableHistory.history[tableHistory.index];
    }
  });

  document.getElementById('forward-table-description').addEventListener('click', () => {
    if (tableHistory.index < tableHistory.history.length - 1) {
      tableHistory.index++;
      tableDescription.value = tableHistory.history[tableHistory.index];
    }
  });

  document.getElementById('like-table-description').addEventListener('click', () => {
    console.log('Liked table description');
    alert('Liked table description');
  });

  document.getElementById('dislike-table-description').addEventListener('click', () => {
    console.log('Disliked table description');
    alert('Disliked table description');
  });

  tableDescription.addEventListener('input', () => {
    const value = tableDescription.value;
    tableHistory.history = tableHistory.history.slice(0, tableHistory.index + 1);
    tableHistory.history.push(value);
    tableHistory.index++;
  });

  columnsContainer.addEventListener('input', (e) => {
    if (e.target.tagName === 'TEXTAREA') {
      const columnRow = e.target.closest('.column-row');
      const columnName = columnRow.dataset.columnName;
      const historyData = columnHistories[columnName];
      const value = e.target.value;

      historyData.history = historyData.history.slice(0, historyData.index + 1);
      historyData.history.push(value);
      historyData.index++;
    }
  });

});
