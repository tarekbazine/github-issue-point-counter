const OPTIONS_KEYS = ['isDebug', 'highlightNonEstimated', 'ESTIMATION_REGX_STR'];

async function main() {

    function getOptions() {
        return new Promise(resolve =>
            chrome.storage.sync.get(OPTIONS_KEYS, options => resolve(options))
        );
    }

    const OPTIONS = await getOptions();

    const labelRegexInputElement = document.getElementById('labelRegex');
    labelRegexInputElement.value = OPTIONS.ESTIMATION_REGX_STR;
    labelRegexInputElement.addEventListener("change", function (event) {
        syncLocalStorage('ESTIMATION_REGX_STR', this.value);
    });

    const showInConsoleCheckboxElement = document.getElementById('showInConsole');
    showInConsoleCheckboxElement.checked = OPTIONS.isDebug;
    showInConsoleCheckboxElement.addEventListener("change", function (event) {
        syncLocalStorage('isDebug', this.checked);
    });

    const highlightNonEstimatedCheckboxElement = document.getElementById('highlightNonEstimated');
    highlightNonEstimatedCheckboxElement.checked = OPTIONS.highlightNonEstimated;
    highlightNonEstimatedCheckboxElement.addEventListener("change", function (event) {
        syncLocalStorage('highlightNonEstimated', this.checked);
    });
}

function syncLocalStorage(key, val) {
    console.log(key, val)
    chrome.storage.sync.set({
        [key]: val
    });
}

main();