const express = require('express');
const router = express.Router();
const path = require('path');

const { dosyaOlustur, dosyaOku, dosyaYaz } = require('../utils/dosya');

const dosyaYolu = path.join(__dirname, '..', '..', 'data', 'gorevler.json');


// Tamamlanan Görev Sayısı
router.get('/rapor/completed', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const tamamlananGorevler = gorevler.filter(g => g.durum && g.durum.toString().toLowerCase().trim() === 'tamamlandı');
  res.status(200).json({ tamamlananGorevSayisi: tamamlananGorevler.length });
});

// Bekleyen Görev Sayısı
router.get('/rapor/pending', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const bekleyenGorevler = gorevler.filter(g => g.durum === 'beklemede');
  res.status(200).json({ bekleyenGorevSayisi: bekleyenGorevler.length });
});

// Genel Özet Rapor
router.get('/rapor/ozet', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const toplamGorevSayisi = gorevler.length;
  const tamamlananGorevSayisi = gorevler.filter(g => g.durum === 'tamamlandi').length;
  const bekleyenGorevSayisi = gorevler.filter(g => g.durum === 'beklemede').length;
  res.status(200).json({
    toplamGorevSayisi,
    tamamlananGorevSayisi,
    bekleyenGorevSayisi
  });
});

// Log Raporu
router.get('/rapor/log', (req, res) => {
  const logDosyaYolu = path.join(__dirname, '..', '..', 'data','logs', 'log.json');
  const logIcerigi = dosyaOku(logDosyaYolu, 'log.json') || '';
  res.status(200).json({ log: logIcerigi });
});

module.exports = router;