const SyncController = require('../controllers/SyncController');
import performanceNow from 'performance-now';
const MILLISECONDS = 1000;
let RESPONSE_BODY_CACHE = { /* hashedUrl: response */ };

export const run = async () => {
  /* eslint-disable no-console */
  const start = performanceNow();

  console.log('SyncSenadores starts');
  try {
    const aPeople = [];
    const senadores = await SyncController.getSenadores()
    const { Parlamentar } = senadores.data.ListaParlamentarEmExercicio.Parlamentares;
    for (const linha of Parlamentar) {
      const { Parlamentar } = await SyncController.getSenador(linha);
      aPeople.push(SyncController.fillOPerson(Parlamentar, '20000'));
      // SyncController.checkPerson(Parlamentar, '20000');

    }
    if (aPeople.length > 0) {
      await SyncController.checkPersonV2(aPeople, '20000');
    }

    await SyncController.updateActualListParlamentares(Parlamentar, '20000');

  } catch (erro) {
    console.log(erro);
  } finally {
    // reset the cache for next run
    RESPONSE_BODY_CACHE = {};
  }
  const end = performanceNow(); "'"
  console.log(((end - start) / MILLISECONDS).toFixed(3), 'seconds');
  console.log('SyncSenadores quits');
  /* eslint-enable */
};

run();