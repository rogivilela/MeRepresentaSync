import { CronJob } from 'cron';

import { run as runSyncDeputados } from './syncDeputados';
import { run as runSyncSenadores } from './syncSenadores';
import { run as runSyncCosts } from './syncCosts';
import { run as runSyncProposals } from './syncProposals';

const TIMEZONE = 'Etc/UTC';
const EVERY_HOUR = '0 * * * *';
const EVERY_2_HOUR = '0 */2 * * *';
const EVERY_SECOND = '* * * * * *';
const EVERY_MINUTE = '0 * * * * *';
const EVERY_5_MINUTE = '0 */5 * * * *';
const EVERY_HALF_HOUR = '*/30 * * * *';
// const EVERY_HOUR = '0 * * * *';

// 1 PM PST
const EVERYDAY_AT_9_PM = '0 21 * * *';
// 5 AM PST
const EVERYDAY_AT_1_PM = '0 13 * * *';
// 5 PM PST
const EVERYDAY_AT_1_AM = '0 1 * * *';
// 11:45 PM PST
const EVERYDAY_AT_7_45_AM = '45 7 * * *';

const deputadosJob = new CronJob(
  EVERY_HOUR,
  async () => {
    try {
      await runSyncDeputados();
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error);
      /* eslint-enable */
      // Raven.captureException(error);
    }
  },
  null,
  false, /* Start the job right now */
  TIMEZONE,
);

const senadoresJob = new CronJob(
  EVERY_HOUR,
  async () => {
    try {
      await runSyncSenadores();
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error);
      /* eslint-enable */
      // Raven.captureException(error);
    }
  },
  null,
  false, /* Start the job right now */
  TIMEZONE,
);

const costsJob = new CronJob(
  EVERY_2_HOUR,
  async () => {
    try {
      await runSyncCosts();
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error);
      /* eslint-enable */
      // Raven.captureException(error);
    }
  },
  null,
  false, /* Start the job right now */
  TIMEZONE,
);

const proposalsJob = new CronJob(
  EVERY_HOUR,
  async () => {
    try {
      await runSyncProposals();
    } catch (error) {
      /* eslint-disable no-console */
      console.log(error);
      /* eslint-enable */
      // Raven.captureException(error);
    }
  },
  null,
  false, /* Start the job right now */
  TIMEZONE,
);

export const run = () => {
  // deputadosJob.start();
  // senadoresJob.start();
  // costsJob.start();
  proposalsJob.start();
};
