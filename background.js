chrome.declarativeNetRequest.onRuleMatched.addListener((rule) => {
  if (rule.rule.id === 1) {
    fetch(rule.request.url)
      .then(response => response.json())
      .then(data => {
        chrome.storage.local.set({ zeppelinData: data });
      })
      .catch(err => console.error('Fetch failed', err));
  }
});
