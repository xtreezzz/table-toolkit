# Zeppelin Data Extractor

## Назначение

Расширение собирает данные из API Apache Zeppelin, позволяет получить их описание и отправить результат на wiki. Основные функции описаны в `manifest.json`.

## Установка и запуск

1. Скачайте или клонируйте этот репозиторий.
2. Откройте Chrome и перейдите на страницу `chrome://extensions/`.
3. Включите режим разработчика.
4. Нажмите **Load unpacked** и выберите каталог репозитория.
5. После загрузки иконка расширения станет доступной на панели браузера. Нажмите на неё, чтобы открыть всплывающее окно.

## Основные файлы

### `manifest.json`

Файл определяет параметры расширения. В нём указано название *"Zeppelin Data Extractor"*, версия, список разрешений и файл всплывающего окна:

```json
{
  "manifest_version": 3,
  "name": "Zeppelin Data Extractor",
  "version": "1.0",
  "description": "Captures data from Zeppelin API, sends to an external API for description, and allows editing and sending to a wiki.",
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "popup.html"
  }
}
```

### `popup.html`

В файле разметки описана кнопка для получения данных и форма для описания таблицы и её столбцов. При нажатии на **Забрать данные** загружается тестовая информация, которую можно отредактировать перед отправкой:

```html
<h1>Zeppelin Data Wiki</h1>
<div class="actions">
  <button id="get-data">Забрать данные</button>
  <button id="describe-data">Описать</button>
</div>
```

### `background.js`

Фоновый скрипт отслеживает сетевые запросы, подходящие под правило из `rules.json`. Если условие выполняется, скрипт загружает данные и сохраняет их в хранилище:

```javascript
chrome.declarativeNetRequest.onRuleMatched.addListener((rule) => {
  if (rule.rule.id === 1) {
    fetch(rule.request.url)
      .then(response => response.json())
      .then(data => {
        chrome.storage.local.set({ zeppelinData: data });
      });
  }
});
```



Дополнительные настройки разрешений описаны в `rules.json`. Этот файл содержит правила для `declarativeNetRequest`, которые определяют, какие сетевые запросы будут перехватываться фоновым скриптом.

### `content.js`

Контент-скрипт добавляет интерактивную кнопку к любому элементу вида
`div[class^="_paragraphOutputTab_"]` или `div[data-qa-type="paragraph-output-tabls"]`.
При наведении курсора на такой блок появляется кнопка **"Забрать данные"**,
которая извлекает содержимое расположенной в нём HTML-таблицы и сохраняет его в
`chrome.storage.local` под ключом `parsedTableData`.

