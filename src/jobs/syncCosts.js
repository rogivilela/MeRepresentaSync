const SyncController = require('../controllers/SyncController');
import performanceNow from 'performance-now';
const MILLISECONDS = 1000;
let RESPONSE_BODY_CACHE = { /* hashedUrl: response */ };

export const run = async () => {
  /* eslint-disable no-console */
  const start = performanceNow();

  console.log('SyncCosts starts');
  try {
    const aCosts = [];
    const deputados = await SyncController.getDeputadosFromDb();
    for (const deputado of deputados) {
      if (await SyncController.checkThereAreCostById(deputado.PersonId)) {
        const date = new Date();
        const dateToProcess = {
          month: date.getMonth() + 1,
          year: date.getFullYear()
        }
        const costs = await SyncController.getCostsByExternalIdFromApi(deputado.ExternalId, dateToProcess);
        // aCosts = [].concat(aCosts, SyncController.fillCostsByIdV2(deputado.PersonId, costs, "10000"));
        aCosts.push(SyncController.fillCostsByIdV2(deputado.PersonId, costs, "10000"));
      }
      else {
        const date = new Date();
        const dateToProcess = { year: date.getFullYear() }
        const costs = await SyncController.getCostsByExternalIdFromApi(deputado.ExternalId, dateToProcess);
        // aCosts = [].concat(aCosts, SyncController.fillCostsByIdV2(deputado.PersonId, costs, "10000"));
        aCosts.push(SyncController.fillCostsByIdV2(deputado.PersonId, costs, "10000"));
      }
    }
    const date = new Date();
    const JSONCostsSenadores = await SyncController.getCSVFileFromSenadoByYear(date.getFullYear());

    const senadores = await SyncController.getSenadoresFromDb();
    for (const senador of senadores) {

      const costs = JSONCostsSenadores.filter(x => x.SENADOR === senador.Name.toUpperCase());
      if (costs.length > 0) {
        // aCosts = [].concat(aCosts, SyncController.fillCostsByIdV2(senador.PersonId, costs, "20000"));
        aCosts.push(SyncController.fillCostsByIdV2(senador.PersonId, costs, "20000"));
      }
    }

    if (aCosts.length > 0) {
      await SyncController.saveCostsFromObject(aCosts);
    }

  } catch (erro) {
    console.log(erro);
  } finally {
    // reset the cache for next run
    RESPONSE_BODY_CACHE = {};
  }
  const end = performanceNow(); "'"
  console.log(((end - start) / MILLISECONDS).toFixed(3), 'seconds');
  console.log('SyncCosts quits');
  /* eslint-enable */
};

// run();