const path = require('path');
const fs = require('fs');
const { dosyaOku, dosyaYaz, dosyaOlustur } = require('../utils/dosya');

const logKlasoru = path.join(__dirname, '..', '..', 'data', 'logs');
const logDosyasi = path.join(logKlasoru, 'log.json');

// Klasör ve dosya yoksa çökmesini engellemek için önce oluştur:
if (!fs.existsSync(logKlasoru)) {
  fs.mkdirSync(logKlasoru, { recursive: true });
}
if (!fs.existsSync(logDosyasi)) {
  fs.writeFileSync(logDosyasi, '[]', 'utf8');
}

const logger = (req, res, next) => {
  const yeniLog = {
    zaman: new Date().toISOString(),
    metod: req.method,
    url: req.originalUrl
  };

  try {
    const loglar = dosyaOku(logDosyasi) || [];
    loglar.push(yeniLog);
    dosyaYaz(logDosyasi, loglar);
  } catch (err) {
    console.error('Log yazma hatası:', err.message);
  }

  next();
};

module.exports = logger;