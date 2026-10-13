const express = require('express');
const router = express.Router();
const path = require('path');

const { dosyaOlustur, dosyaOku, dosyaYaz } = require('../utils/dosya');

const dosyaYolu = path.join(__dirname, '..', '..', 'data', 'calisanlar.json');
const gorevlerYolu = path.join(__dirname, '..', '..', 'data', 'gorevler.json');

// Çalışan Ekleme - Post 
router.post('/calisan', (req, res) => {
  const calisanlar = dosyaOku(dosyaYolu, 'calisanlar.json') || [];
  
  // Otomatik ID hesaplama (Eğer hiç çalışan yoksa 101'den başlatır)
  const yeniId = calisanlar.length > 0 ? Math.max(...calisanlar.map(c => c.id || 0)) + 1 : 101;
  
  const yeniCalisan = {
    id: yeniId,
    ...req.body
  };

  calisanlar.push(yeniCalisan);
  dosyaYaz(dosyaYolu, calisanlar);
  
  res.status(201).json({ mesaj: 'Çalışan eklendi', veri: yeniCalisan });
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

// Çalışan Silme - Delete (JSON yanıt formatına çevrildi)
router.delete('/calisan/:id', (req, res) => {
  const calisanId = parseInt(req.params.id);
  const calisanlar = dosyaOku(dosyaYolu, 'calisanlar.json') || [];
  const calisanIndex = calisanlar.findIndex(c => c.id === calisanId);

  if (calisanIndex === -1) {
    return res.status(404).json({ hata: 'Çalışan bulunamadı' });
  }

  // Çalışan silindiğinde, üzerine atanmış görevlerin calisan_id değerini null yap
  const gorevler = dosyaOku(gorevlerYolu, 'gorevler.json') || [];
  let gorevlerGuncellendi = false;
  
  gorevler.forEach(g => {
    if (g.calisan_id === calisanId) {
      g.calisan_id = null;
      gorevlerGuncellendi = true;
    }
  });

  if (gorevlerGuncellendi) {
    dosyaYaz(gorevlerYolu, gorevler);
  }

  // Çalışanı listeden çıkar ve kaydet
  calisanlar.splice(calisanIndex, 1);
  dosyaYaz(dosyaYolu, calisanlar);

  res.status(200).json({ mesaj: 'Çalışan silindi ve üzerine kayıtlı görevler boşa çıkarıldı.' });
});

module.exports = router;