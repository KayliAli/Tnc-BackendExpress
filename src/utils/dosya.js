const fs = require('fs');
const path = require('path');

const dosyaYolu = path.join(__dirname, '../data/gorevler.json');

function gorevleriOku() {
  const veri = fs.readFileSync(dosyaYolu, 'utf8');
  return JSON.parse(veri);
}

function gorevleriYaz(gorevler) {
  const veri = JSON.stringify(gorevler, null, 2);
  fs.writeFileSync(dosyaYolu, veri, 'utf8');
}

module.exports = {
  gorevleriOku,
  gorevleriYaz,
};

function dosyaOlustur(dosyaYolu,dosyaAdi) {
  if (!fs.existsSync(dosyaYolu)) {
    fs.writeFileSync(dosyaYolu, '[]', 'utf8');
  }
  

};
