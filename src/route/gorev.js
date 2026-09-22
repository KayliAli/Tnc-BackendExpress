const express = require('express');
const router = express.Router();
const path = require('path');
const logger = require('../middleware/logger');

const { dosyaOlustur, dosyaOku, dosyaYaz } = require('../utils/dosya');

const dosyaYolu = path.join(__dirname, '..', '..', 'data', 'gorevler.json');
const calisanlarYolu = path.join(__dirname, '..', '..', 'data', 'calisanlar.json');

// Görev Ekleme - Post
router.post('/gorev', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  gorevler.push(req.body);
  dosyaYaz(dosyaYolu, gorevler);
  res.status(201).json({ mesaj: 'Görev eklendi', veri: req.body });
});

// Görev Listele Öncelikli - Get ("düşük/orta/yüksek")
router.get('/gorev/oncelik/:oncelik', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const gorevlerByPriority = gorevler.filter(g => g.oncelik === req.params.oncelik);
  res.status(200).json(gorevlerByPriority);
});

// Görev Listeleme - Get
router.get('/gorev', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  
  res.status(200).json(gorevler);
});


// Görev Detay - Get
router.get('/gorev/:id', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const gorev = gorevler.find(g => g.id === parseInt(req.params.id));
  
  if (!gorev) {
    return res.status(404).send('Görev bulunamadı');
  }
  
  res.status(200).json(gorev);
});

// Görev Güncelleme - Put
router.put('/gorev/:id', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu) || [];
  const gorevIndex = gorevler.findIndex(g => g.id === parseInt(req.params.id));
  
  if (gorevIndex === -1) {
    return res.status(404).send('Görev bulunamadı');
  }
  
  gorevler[gorevIndex] = { ...gorevler[gorevIndex], ...req.body };
  dosyaYaz(dosyaYolu,gorevler);
  res.status(200).send('Görev güncellendi');
});

// Görev ATA - Patch
router.patch('/gorev/:id/ata', (req, res) => {
  const gorevId = parseInt(req.params.id);
  const { calisan_id } = req.body;

  const calisanlar = dosyaOku(calisanlarYolu) || [];
  const calisanVarMi = calisanlar.some(c => c.id === calisan_id);

  if (!calisanVarMi) {
    return res.status(404).json({ hata: 'Atanmak istenen çalışan bulunamadı.' });
  }

  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const gorev = gorevler.find(g => g.id === gorevId);

  if (!gorev) {
    return res.status(404).json({ hata: 'Görev bulunamadı.' });
  }

  gorev.calisan_id = calisan_id;
  dosyaYaz(dosyaYolu, gorevler);

  res.status(200).json({ mesaj: 'Görev başarıyla atandı.', gorev });
});


// Görev Silme - Delete
router.delete('/gorev/:id', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const gorevIndex = gorevler.findIndex(g => g.id === parseInt(req.params.id));
  
  if (gorevIndex === -1) {
    return res.status(404).send('Görev bulunamadı');
  }
  
  gorevler.splice(gorevIndex, 1);
  dosyaYaz(dosyaYolu, gorevler);
  res.status(200).send('Görev silindi');
});

// Duruma göre görevleri listeleme - Get
router.get('/gorev?status=:durum', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const durum = req.query.durum;
  if (durum) {
    const filtrelenmisGorevler = gorevler.filter(g => g.durum === durum);
    return res.status(200).json(filtrelenmisGorevler);
  }
  else {
    res.status(200).json(gorevler);
  }
});

// Öncelik durumuna göre görevleri listeleme - Get
router.get('/gorev?priority=:oncelik', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const oncelik = req.query.oncelik;
    if (oncelik) {
    const filtrelenmisGorevler = gorevler.filter(g => g.oncelik === oncelik);
    return res.status(200).json(filtrelenmisGorevler);
  }
   else {
    res.status(200).json(gorevler);
  }

});


// Görev Arama - Get
router.get('/gorev/ara?key=:anahtar', (req, res) => {
    const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
    const anahtar = req.query.anahtar;
    if (anahtar) {
        const filtrelenmisGorevler = gorevler.filter(g => g.baslik.includes(anahtar) || g.aciklama.includes(anahtar));
        return res.status(200).json(filtrelenmisGorevler);
    }
    else {
        // Görev Bulunamdı
        res.status(404).json({ mesaj: 'Görev bulunamadı' });
    }
});


module.exports = router;

