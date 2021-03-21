// todo
//  1.option , default

const debug = true;

function log(...x) {
    if (debug) {
        console.log('Github-issue-point-counter : ', x);
    }
}

const GITHUB_CARD_TYPE_ATTRIBUTE = 'data-card-is';

function callBackNotEstimatedCard(element) {
    const types = JSON.parse(element.getAttribute(GITHUB_CARD_TYPE_ATTRIBUTE));

    if (!types.includes('issue')) {
        return;
    }

    element.style.background = '#ffebee';
}

function insertAfter(newElement, referenceElement) {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}

function main() {

    const GITHUB_PROJECT_COLUMN_SELECTOR = 'div.project-column';
    const GITHUB_PROJECT_COLUMN_CARDS_COUNTER_SELECTOR = 'span.Counter';
    const ESTIMATION_BADGE_CSS_CLASSLIST = ['ExtensionEstimation__badge', 'position-relative', 'v-align-middle', 'ml-1'];
    // <span title="6"
    //       className="Counter js-column-card-count Counter--secondary position-relative v-align-middle ml-1">6</span>
    const GITHUB_ISSUE_CARD_SELECTOR = 'article';
    const GITHUB_ISSUE_CARD_LABEL_ATTRIBUTE = 'data-card-label';
    const ESTIMATION_REGX = /time: (?<estimatoin>\d+) hours/i;

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
                return found?.groups?.estimatoin;
            }).find((estimation) => estimation != null);

            if (!estimation) {
                callBackNotEstimatedCard(card);
                continue;
            }

            log(estimation, card, cardLabels);

            estimationSum = estimationSum + parseInt(estimation);
        }


        let newElement = document.createElement('span');
        newElement.classList.add(...ESTIMATION_BADGE_CSS_CLASSLIST);
        newElement.innerHTML = estimationSum.toString();
        var myCurrentElement = column.querySelector(GITHUB_PROJECT_COLUMN_CARDS_COUNTER_SELECTOR);
        insertAfter(newElement, myCurrentElement);


    }


}

setTimeout(main, 5000);