const express = require('express');
const router = express.Router();
const path = require('path');


const { dosyaOlustur, dosyaOku, dosyaYaz } = require('../utils/dosya');

const dosyaYolu = path.join(__dirname, '..', '..', 'data', 'calisanlar.json');
const gorevlerYolu = path.join(__dirname, '..', '..', 'data', 'gorevler.json');

// Çalışan Ekleme - Post
router.post('/calisan', (req, res) => {
  const calisanlar = dosyaOku(dosyaYolu, 'calisanlar.json') || [];
  calisanlar.push(req.body);
  dosyaYaz(dosyaYolu, calisanlar);
  res.status(201).json({ mesaj: 'Çalışan eklendi', veri: req.body });
});

// Çalışan Listeleme - Get
router.get('/calisan', (req, res) => {
  const calisanlar = dosyaOku(dosyaYolu, 'calisanlar.json') || [];
  res.status(200).json(calisanlar); 
});

// Çalışan Görevleri Listeleme - Get
router.get('/calisan/:id/gorevler', (req, res) => {
  const calisanId = parseInt(req.params.id);
  const gorevler = dosyaOku(gorevlerYolu, 'gorevler.json') || [];

  // Çalışana ait görevleri filtrele
  const calisanGorevleri = gorevler.filter(g => g.calisan_id === calisanId);

  res.status(200).json(calisanGorevleri);
});

// Çalışan Silme - Delete
router.delete('/calisan/:id', (req, res) => {
  const calisanlar = dosyaOku(dosyaYolu, 'calisanlar.json') || [];
  const calisanIndex = calisanlar.findIndex(c => c.id === parseInt(req.params.id));

    if (calisanIndex === -1) {
    return res.status(404).send('Çalışan bulunamadı');
    }

    calisanlar.splice(calisanIndex, 1);
    dosyaYaz(dosyaYolu, calisanlar);
    res.status(200).send('Çalışan silindi');
});

module.exports = router;
