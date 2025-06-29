chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) => {
  if (info.rule.ruleId === 1) {
    fetch(info.request.url)
      .then((response) => response.json())
      .then((data) => {
        chrome.storage.local.set({ zeppelinData: data });
      });
  }
});
