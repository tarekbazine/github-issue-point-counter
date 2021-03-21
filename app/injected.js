// TODO : migrate to TS ( to use modules import ..)

const OPTIONS_KEYS = ['isDebug', 'highlightNonEstimated', 'ESTIMATION_REGX_STR'];

async function main() {

    function getOptions() {
        return new Promise(resolve =>
            chrome.storage.sync.get(OPTIONS_KEYS, options => resolve(options))
        );
    }

    const OPTIONS = await getOptions();

    console.log(OPTIONS);

// ------------------------------------------------------------------------

    let log;
    if (OPTIONS.isDebug) {
        log = console.log.bind(window.console, '[Github-issue-point-counter]')
    } else {
        log = function () {
        }
    }

// ------------------------------------------------------------------------

    const GITHUB_CARD_TYPE_ATTRIBUTE = 'data-card-is';

    function callBackNotEstimatedCard(element) {
        if (!OPTIONS.highlightNonEstimated) {
            return;
        }

        const types = JSON.parse(element.getAttribute(GITHUB_CARD_TYPE_ATTRIBUTE));

        if (!types.includes('issue')) {
            return;
        }

        element.style.background = '#ffebee';
    }

// ------------------------------------------------------------------------

    function insertAfter(newElement, referenceElement) {
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
    }

// ------------------------------------------------------------------------

    const GITHUB_PROJECT_COLUMN_SELECTOR = 'div.project-column';
    const GITHUB_PROJECT_COLUMN_CARDS_COUNTER_SELECTOR = 'span.Counter';
    const ESTIMATION_BADGE_CSS_CLASSLIST = ['ExtensionEstimation__badge', 'position-relative', 'v-align-middle', 'ml-1'];
    const GITHUB_ISSUE_CARD_SELECTOR = 'article';
    const GITHUB_ISSUE_CARD_LABEL_ATTRIBUTE = 'data-card-label';
    const ESTIMATION_REGX = new RegExp(OPTIONS.ESTIMATION_REGX_STR, 'i');
    log('regex', ESTIMATION_REGX.toString(), ESTIMATION_REGX)

    const projectColumns = document.querySelectorAll(GITHUB_PROJECT_COLUMN_SELECTOR);

    log(projectColumns);

    for (let column of projectColumns) {

        let estimationSum = 0;

        const cards = column.querySelectorAll(GITHUB_ISSUE_CARD_SELECTOR);
        for (let card of cards) {
            const cardLabels = JSON.parse(card.getAttribute(GITHUB_ISSUE_CARD_LABEL_ATTRIBUTE));
            log(card, cardLabels);

            if (!cardLabels?.length) {
                callBackNotEstimatedCard(card);
                continue;
            }

            const estimation = cardLabels.map((label) => {
                const found = label.match(ESTIMATION_REGX);
                return found?.groups?.estimation;
            }).find((estimation) => estimation != null);

            if (!estimation) {
                callBackNotEstimatedCard(card);
                continue;
            }

            log(estimation, card, cardLabels);

            estimationSum = estimationSum + parseInt(estimation);
        }

        const estimationBadgeElement = document.createElement('span');
        estimationBadgeElement.classList.add(...ESTIMATION_BADGE_CSS_CLASSLIST);
        estimationBadgeElement.innerHTML = estimationSum.toString();
        const oldEstimationBadgeElement = column.querySelector('span.' + ESTIMATION_BADGE_CSS_CLASSLIST[0]);
        oldEstimationBadgeElement?.remove();
        const githubCounterBadgeElement = column.querySelector(GITHUB_PROJECT_COLUMN_CARDS_COUNTER_SELECTOR);
        insertAfter(estimationBadgeElement, githubCounterBadgeElement);
    }

}

// ------------------------------------------------------------------------

// since github loads cards async
setTimeout(main, 5000);

// ------------------------------------------------------------------------

chrome.storage.onChanged.addListener(function (changes) {

    for (var key in changes) {

        if (OPTIONS_KEYS.includes(key)) {
            location.reload();

            break;
        }

    }
});