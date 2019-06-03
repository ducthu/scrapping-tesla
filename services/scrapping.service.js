const puppeteer = require("puppeteer-extra");
const devices = require("puppeteer/DeviceDescriptors");
const iPhonex = devices["iPhone X"];

const mainUrl = "https://www.leboncoin.fr/recherche/?category=2&text=tesla";
const urlPage =
  "https://www.leboncoin.fr/recherche/?category=2&text=tesla&page=";

const Tesla = require("./tesla.service");

const chromeOptions = {
  headless: false,
  defaultViewport: null,
  slowMo: 10
};

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const UserAgentPlugin = require("puppeteer-extra-plugin-anonymize-ua");
puppeteer.use(UserAgentPlugin({ makeWindows: true }));

const TeslaServices = require("./tesla.service");

module.exports = {
  run
};

function sleep(time) {
  console.log("Pause de " + time / 1000 + " secondes ...");
  return new Promise(resolve => setTimeout(resolve, time));
}

async function run() {
  let numberPage = await getNumberPage(mainUrl)
    .then(data => {
      return data;
    })
    .catch(err => {
      console.error("Erreur chargement de la page: " + err);
    });
  console.log("Nombre de pages: " + numberPage);

  var tab = getPages(numberPage);

  let t = [];
  for (var i = 0; i < tab.length; i++) {
    await sleep(5000);
    console.log("\nChargement de la page: " + tab[i]);
    await getAllUrls(tab[i])
      .then(data => {
        t = t.concat(data);
        console.log("Page chargée: " + tab[i]);
        console.log(data.length + " annonces trouvées");
      })
      .catch(err => {
        console.log("Error Page not loaded: " + err);
      });
  }

  Tesla.removeOldLink(t);

  console.log("\nTotal:" + t.length + " annonces trouvées.");
  for (var i = 0; i < t.length; i++) {
    let b = await TeslaServices.checkValidity(t[i]).then(bool => {
      return !bool;
    });
    if (b) {
      await sleep(20000);
      await getFullAnnonce(t[i])
        .then(data => {
          Tesla.create(data)
            .then(data => {
              console.log(
                "[" +
                  (i + 1) +
                  "/" +
                  t.length +
                  "]: " +
                  t[i] +
                  " a été ajoutée à la bdd"
              );
            })
            .catch(err => {
              console.log("Erreur d'ajout: " + err);
            });
        })
        .catch(err => {
          console.log("Error loading Annonce: " + err);
        });
    } else {
      console.log(
        "[" + (i + 1) + "/" + t.length + "]: " + t[i] + " déjà dans la bdd"
      );
    }
  }
  console.log("Scrapping done !");
}

async function getNumberPage(url) {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.emulate(iPhonex);
  await page.goto(url, {
    timeout: 300000000
  });

  let r = await page.evaluate(() => {
    var nbr = document.querySelector("._2JEuf").innerHTML;
    return Number(nbr);
  });
  await browser.close();
  return r;
}

async function getFullAnnonce(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch(chromeOptions);
      const page = await browser.newPage();
      await page.emulate(iPhonex);
      await page.goto(url, { timeout: 300000000 });
      const r = await page.evaluate(() => {
        let results = [];
        results.push({
          titre: document.querySelector("._246DF._2S4wz").textContent,
          prix: document.querySelector("._1F5u3").textContent,
          description: document.querySelector(".content-CxPmi").textContent,
          lien: document.URL
        });

        let items = document.querySelectorAll("._2B0Bw._1nLtd");
        items.forEach(item => {
          if (item.querySelector("._3-hZF").textContent == "Marque") {
            results.push({
              marque: item.querySelector("._3Jxf3").textContent
            });
          }
          if (item.querySelector("._3-hZF").textContent == "Modèle") {
            results.push({
              modele: item.querySelector("._3Jxf3").textContent
            });
          }
          if (item.querySelector("._3-hZF").textContent == "Année-modèle") {
            results.push({
              annee: item.querySelector("._3Jxf3").textContent
            });
          }
          if (item.querySelector("._3-hZF").textContent == "Boîte de vitesse") {
            results.push({
              boite_vitesse: item.querySelector("._3Jxf3").textContent
            });
          }
          if (item.querySelector("._3-hZF").textContent == "Kilométrage") {
            results.push({
              km: item.querySelector("._3Jxf3").textContent
            });
          }
        });
        return results;
      });
      await browser.close();
      return resolve(r[0]);
    } catch (error) {
      return reject(error);
    }
  });
}

function getPages(nbrPage) {
  let tab_pages = [];
  for (let i = 1; i <= nbrPage; i++) {
    tab_pages.push(urlPage + i);
  }
  return tab_pages;
}

async function getAllUrls(url) {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.emulate(iPhonex);
  await page.goto(url, { timeout: 300000000 });
  const a = await page.evaluate(() => {
    let urls = [];
    let items = document.querySelectorAll("._3DFQ-");
    items.forEach(item => {
      let link = item.querySelector("a").href;
      urls.push(link);
    });
    return urls;
  });
  await browser.close();
  return a;
}
