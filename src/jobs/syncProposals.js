const SyncController = require('../controllers/SyncController');
import performanceNow from 'performance-now';
const MILLISECONDS = 1000;
let RESPONSE_BODY_CACHE = { /* hashedUrl: response */ };

export const run = async () => {
    /* eslint-disable no-console */
    const start = performanceNow();

    console.log('SyncProposals starts');
    try {
        var Proposals = [];
        var Authors = [];
        const proposals = await SyncController.getCurrentProposals();
        for (const proposal of proposals) {
            const detailedProposal = await SyncController.getDetailedProposalByLink(proposal.uri);
            if (detailedProposal != null) {
                Proposals.push(detailedProposal);
                Authors = [].concat(Authors, detailedProposal.authors);
            }

        }
        await SyncController.fillCurrentProposals(Proposals, Authors, '10000');
        if (1 == 1);

    } catch (erro) {
        console.log(erro);
    } finally {
        // reset the cache for next run
        RESPONSE_BODY_CACHE = {};
    }
    const end = performanceNow(); "'"
    console.log(((end - start) / MILLISECONDS).toFixed(3), 'seconds');
    console.log('SyncProposals quits');
    /* eslint-enable */
};

// run();