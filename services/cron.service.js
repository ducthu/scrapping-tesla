const CronJob = require("cron").CronJob;
const ScrappingTesla = require("../services/scrapping.service");
module.exports = {
  initCron
};

function initCron() {
  const job = new CronJob("0 */30 * * * *", function() {
    console.log("Scrapping launched !");
    ScrappingTesla.run();
  });
  job.start();
}
