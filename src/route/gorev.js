const express = require('express');
const router = express.Router();
const path = require('path');
//Middleware
const logger = require('../middleware/logger');
const validateGorev = require('../middleware/validateGorev');

const { dosyaOlustur, dosyaOku, dosyaYaz } = require('../utils/dosya');

const dosyaYolu = path.join(__dirname, '..', '..', 'data', 'gorevler.json');
const calisanlarYolu = path.join(__dirname, '..', '..', 'data', 'calisanlar.json');

// Görev Ekleme - Post (Otomatik ID eklendi)
router.post('/gorev', validateGorev, (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  
  // Otomatik ID hesaplama
  const yeniId = gorevler.length > 0 ? Math.max(...gorevler.map(g => g.id || 0)) + 1 : 1;
  
  const yeniGorev = {
    id: yeniId,
    ...req.body,
    calisan_id: req.body.calisan_id || null
  };

  gorevler.push(yeniGorev);
  dosyaYaz(dosyaYolu, gorevler);
  
  res.status(201).json({ mesaj: 'Görev eklendi', veri: yeniGorev });
});

// Görev Arama - Get
router.get('/gorev/ara', (req, res) => {
    const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
    const key = req.query.key;
    
    if (key) {
        const filtrelenmisGorevler = gorevler.filter(g => 
            (g.gorev_adi && g.gorev_adi.includes(key)) || 
            (g.gorev_detayi && g.gorev_detayi.includes(key))
        );
        return res.status(200).json(filtrelenmisGorevler);
    } else {
        return res.status(400).json({ mesaj: 'Arama için "key" parametresi eksik.' });
    }
});

/* --------------------------------------------------------------------------
   GÖREV LİSTELEME, FİLTRELEME, SIRALAMA VE SAYFALAMA
-------------------------------------------------------------------------- */
router.get('/gorev', (req, res) => {
  let gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  
  const { status, priority, sirala, sayfa, limit } = req.query;

  if (status) {
    gorevler = gorevler.filter(g => g.durum === status);
  }

  if (priority) {
    gorevler = gorevler.filter(g => g.oncelik === priority);
  }

  if (sirala) {
    if (sirala === 'asc') {
      gorevler = gorevler.sort((a, b) => a.gorev_adi.localeCompare(b.gorev_adi));
    } else if (sirala === 'desc') {
      gorevler = gorevler.sort((a, b) => b.gorev_adi.localeCompare(a.gorev_adi));
    } else {
      return res.status(400).json({ mesaj: 'Geçersiz sıralama. "asc" veya "desc" olmalı.' });
    }
  }

  if (sayfa || limit) {
    const sayfaNo = parseInt(sayfa) || 1;
    const limitNo = parseInt(limit) || 10;
    const startIndex = (sayfaNo - 1) * limitNo;
    const endIndex = startIndex + limitNo;
    
    gorevler = gorevler.slice(startIndex, endIndex);
  }

  res.status(200).json(gorevler);
});

/* --------------------------------------------------------------------------
   ID'YE BAĞLI İŞLEMLER
-------------------------------------------------------------------------- */

// Görev Detay - Get
router.get('/gorev/:id', (req, res) => {
  const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
  const gorev = gorevler.find(g => g.id === parseInt(req.params.id));
  
  if (!gorev) {
    return res.status(404).json({ hata: 'Görev bulunamadı' });
  }
  
  res.status(200).json(gorev);
});

// Görev Güncelleme - Put
router.put('/gorev/:id', validateGorev, (req, res) => {
  const gorevler = dosyaOku(dosyaYolu) || [];
  const gorevIndex = gorevler.findIndex(g => g.id === parseInt(req.params.id));
  
  if (gorevIndex === -1) {
    return res.status(404).json({ hata: 'Görev bulunamadı' });
  }
  
  gorevler[gorevIndex] = { ...gorevler[gorevIndex], ...req.body };
  dosyaYaz(dosyaYolu, gorevler);
  
  res.status(200).json({ mesaj: 'Görev güncellendi', veri: gorevler[gorevIndex] });
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
    return res.status(404).json({ hata: 'Görev bulunamadı' });
  }
  
  gorevler.splice(gorevIndex, 1);
  dosyaYaz(dosyaYolu, gorevler);
  
  res.status(200).json({ mesaj: 'Görev silindi' });
}); 

module.exports = router;