const puppeteer = require("puppeteer");
const devices = require("puppeteer/DeviceDescriptors");
const iPhonex = devices["iPhone X"];

const mainUrl = "https://www.leboncoin.fr/recherche/?category=2&text=tesla";
const urlPage =
  "https://www.leboncoin.fr/recherche/?category=2&text=tesla&page=";

module.exports = {
  run
};

async function run() {
  let numberPage = await getNumberPage(mainUrl);
  console.log("Nombre de pages: " + numberPage);
  var tab = getPages(numberPage);
  let t = [];
  for (var i = 0; i < tab.length; i++) {
    console.log("loading tab: " + tab[i]);
    const b = await getUrls(tab[i]);
    t = t.concat(b);
  }

  let z = [];
  for (var i = 0; i < t.length; i++) {
    z = z.concat(await getFullAnnonce(t[i]));
  }
  console.log("z: " + z);
}

async function getNumberPage(url) {
  const browser = await puppeteer.launch({
    headless: false
  });
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
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.emulate(iPhonex);
      await page.goto(url, { timeout: 300000000 });
      const r = await page.evaluate(() => {
        let results = [];
        results.push({
          title: document.querySelector("._246DF._2S4wz").textContent,
          price: document.querySelector("._1F5u3").textContent,
          description: document.querySelector(".content-CxPmi").textContent
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
          if (item.querySelector("._3-hZF").textContent == "Carburant") {
            results.push({
              carburant: item.querySelector("._3Jxf3").textContent
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
          if (item.querySelector("._3-hZF").textContent == "Référence") {
            results.push({
              reference: item.querySelector("._3Jxf3").textContent
            });
          }
        });
        return results;
      });
      console.log(r);
      await browser.close();
      return resolve(r);
    } catch (error) {
      return reject(error);
    }
  });
}

async function getAllAnnonces(nbrPage) {
  let annonces = [];
  for (var i = 1; i <= nbrPage; i++) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.emulate(iPhonex);
    await page.goto(urlPage + i, { timeout: 300000000 });
    let a = await page.evaluate(() => {
      let tab_annonces = [];
      let items = document.querySelectorAll("._3DFQ-");
      items.forEach(item => {
        let link = item.querySelector("a").href;
        //const annonce = await getFullAnnonce(link);
        console.log("annonce checked: " + annonce);
        tab_annonces.concat(annonce);
      });
      return tab_annonces;
    });
    annonces.concat(a);
    await browser.close();
  }
  return annonces;
}

function getPages(nbrPage) {
  let tab_pages = [];
  for (let i = 1; i <= nbrPage; i++) {
    tab_pages.push(urlPage + i);
  }
  return tab_pages;
}

async function getUrls(url) {
  const browser = await puppeteer.launch({ headless: false });
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
