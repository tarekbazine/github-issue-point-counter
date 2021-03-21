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

function main() {

    const GITHUB_PROJECT_COLUMN_SELECTOR = 'div.project-column';
    const GITHUB_ISSUE_CARD_SELECTOR = 'article';
    const GITHUB_ISSUE_CARD_LABEL_ATTRIBUTE = 'data-card-label';
    const ESTIMATION_REGX = /time: (?<estimatoin>\d+) hours/i;

    const projectColumns = document.querySelectorAll(GITHUB_PROJECT_COLUMN_SELECTOR);

    log(projectColumns);

    for (let column of projectColumns) {

        const cards = column.querySelectorAll(GITHUB_ISSUE_CARD_SELECTOR);
        for (let card of cards) {
            const cardLabels = JSON.parse(card.getAttribute(GITHUB_ISSUE_CARD_LABEL_ATTRIBUTE));
            log(card, cardLabels);

            if (!cardLabels?.length) {
                callBackNotEstimatedCard(card);
                continue;
            }

            const estimationLabel = cardLabels.map((label) => {
                const found = label.match(ESTIMATION_REGX);
                return found?.groups?.estimatoin;
            }).find((estimation) => estimation != null);

            if (!estimationLabel) {
                callBackNotEstimatedCard(card);
                continue;
            }

            log(estimationLabel, card, cardLabels);
        }

    }


}

setTimeout(main, 5000);