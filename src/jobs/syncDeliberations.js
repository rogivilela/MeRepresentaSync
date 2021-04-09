const SyncController = require('../controllers/SyncController');
import performanceNow from 'performance-now';
const MILLISECONDS = 1000;
let RESPONSE_BODY_CACHE = { /* hashedUrl: response */ };

export const run = async () => {
    /* eslint-disable no-console */
    const start = performanceNow();

    console.log('SyncDeliberations starts');
    try {
        const lastUpdatedProposals = await SyncController.getLastUpdatedProposals();
        const deliberations = await SyncController.getDeliberationsByProprosals(lastUpdatedProposals);
        const deliberationsObject = SyncController.manageDeliberations(deliberations, lastUpdatedProposals);
        // const deliberationsVotes = await SyncController.getVotesFromApiById(deliberationsObject);

        if (1 == 1);
    } catch (erro) {
        console.log(erro);
    } finally {
        // reset the cache for next run
        RESPONSE_BODY_CACHE = {};
    }
    const end = performanceNow(); "'"
    console.log(((end - start) / MILLISECONDS).toFixed(3), 'seconds');
    console.log('SyncDeliberations quits');
    /* eslint-enable */
};

run();