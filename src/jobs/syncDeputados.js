const SyncController = require('../controllers/SyncController');
import performanceNow from 'performance-now';
const MILLISECONDS = 1000;
let RESPONSE_BODY_CACHE = { /* hashedUrl: response */ };

export const run = async () => {
  /* eslint-disable no-console */
  const start = performanceNow();

  console.log('SyncDeputados starts');
  try {
    const deputados = await SyncController.getDeputados();
    const { dados } = deputados.data;
    for (const linha of dados) {
      const { dados } = await SyncController.getDeputado(linha.uri);
      SyncController.checkPerson(dados, '10000');
    }
    await SyncController.updateActualListParlamentares(dados, '10000');

  } catch (erro) {
    console.log(erro);
  } finally {
    // reset the cache for next run
    RESPONSE_BODY_CACHE = {};
  }
  const end = performanceNow(); "'"
  console.log(((end - start) / MILLISECONDS).toFixed(3), 'seconds');
  console.log('SyncDeputados quits');
  /* eslint-enable */
};

// run();