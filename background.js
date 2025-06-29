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
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'openPopup') {
    const tabId = sender.tab ? sender.tab.id : undefined;
    chrome.action
      .openPopup({ tabId })
      .catch(err => console.error('Failed to open popup', err));
  }
});
