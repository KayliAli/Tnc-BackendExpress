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

// Görev Arama - Get
router.get('/gorev/ara', (req, res) => {
    const gorevler = dosyaOku(dosyaYolu, 'gorevler.json') || [];
    const key = req.query.key; // ?key= kelimesini alır
    
    if (key) {
        // null veya undefined olma ihtimaline karşı optional chaining (?) kullandık
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
  
  // Gelen tüm query parametrelerini alıyoruz
  const { status, priority, sirala, sayfa, limit } = req.query;

  // 1. Duruma (status) Göre Filtreleme
  if (status) {
    gorevler = gorevler.filter(g => g.durum === status);
  }

  // 2. Önceliğe (priority) Göre Filtreleme
  if (priority) {
    gorevler = gorevler.filter(g => g.oncelik === priority);
  }

  // 3. Sıralama (sirala)
  if (sirala) {
    if (sirala === 'asc') {
      gorevler = gorevler.sort((a, b) => a.gorev_adi.localeCompare(b.gorev_adi));
    } else if (sirala === 'desc') {
      gorevler = gorevler.sort((a, b) => b.gorev_adi.localeCompare(a.gorev_adi));
    } else {
      return res.status(400).json({ mesaj: 'Geçersiz sıralama. "asc" veya "desc" olmalı.' });
    }
  }

  // 4. Sayfalama (sayfa ve limit)
  if (sayfa || limit) {
    const sayfaNo = parseInt(sayfa) || 1;
    const limitNo = parseInt(limit) || 10;
    const startIndex = (sayfaNo - 1) * limitNo;
    const endIndex = startIndex + limitNo;
    
    gorevler = gorevler.slice(startIndex, endIndex);
  }

  // Tüm işlemlerden geçen veriyi döndür
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
  dosyaYaz(dosyaYolu, gorevler);
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

module.exports = router;