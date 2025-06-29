chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  if (info.rule.ruleId === 1) {
    fetch(info.request.url)
      .then((response) => response.json())
      .then((data) => {
        chrome.storage.local.set({ zeppelinData: data });
      })
      .catch(err => console.error('Fetch failed', err));
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
    chrome.action.openPopup();
  }
});
