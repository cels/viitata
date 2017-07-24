let removeRefererHeader = true;

// log errors
function onError(error) {
  console.log('Error', error);
}

// remove the referer header from each call if set
function rewriteUserAgentHeader(e) {
  if(removeRefererHeader) {
    for(let header of e.requestHeaders) {
      if('referer' === header.name.toLowerCase()) {
        header.value = '';
      }
    }
  }
  return {requestHeaders: e.requestHeaders};
}

// toggle the state
function toggleActiveState() {
  removeRefererHeader = !removeRefererHeader
  // set icon and text
  setIcon();
  setTitle();
  // persist setting
  chrome.storage.local.set({removeRefererHeader});
}

// sets the icon
function setIcon() {
  chrome.browserAction.setIcon({
    path: removeRefererHeader ? 'images/icon.svg' : 'images/icon-disabled.svg'
  });
}

// sets the title
function setTitle() {
  const title = removeRefererHeader ? 'browserActionTitleActive' : 'browserActionTitleInactive'
  chrome.browserAction.setTitle({
    title: chrome.i18n.getMessage(title)
  });
}

// handler for each headers request
chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls:["<all_urls>"]},
  ["blocking", "requestHeaders"]
);

// handler for button clicks
chrome.browserAction.onClicked.addListener(toggleActiveState);

// get stored value on start
chrome.storage.local.get('removeRefererHeader', (storedSetting) => {
  const stored = storedSetting.removeRefererHeader;
  if('undefined' === typeof stored) {
    const setting = chrome.storage.local.set({removeRefererHeader})
    setting.then(null, onError);
  } else if(stored !== removeRefererHeader) {
    toggleActiveState();
  } else {
    setIcon();
    setTitle();
  }
});
