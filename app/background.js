const DEFAULT_OPTIONS = {
    isDebug: false,
    highlightNonEstimated: true,
    ESTIMATION_REGX_STR: "time: (?<estimation>\\d+) hour.*"
}

// export const DEFAULT_OPTIONS_KEYS = Object.keys(DEFAULT_OPTIONS);

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set(DEFAULT_OPTIONS);
    console.log('Default options are set', `options: ${DEFAULT_OPTIONS}`);
});