const validateGorev = (req, res, next) => {
  const { gorev_adi, gorev_detayi, durum, oncelik } = req.body;
  const hataliAlanlar = [];

  // 1. gorev_adi Kontrolü: Boş olamaz, 3 ile 100 karakter arasında olmalı
  if (!gorev_adi || typeof gorev_adi !== 'string' || gorev_adi.trim().length < 3 || gorev_adi.trim().length > 100) {
    hataliAlanlar.push({
      alan: 'gorev_adi',
      mesaj: 'gorev_adi alanı zorunludur ve 3 ile 100 karakter arasında olmalıdır.'
    });
  }

  // 2. gorev_detayi Kontrolü: Boş olamaz, 10 ile 500 karakter arasında olmalı
  if (!gorev_detayi || typeof gorev_detayi !== 'string' || gorev_detayi.trim().length < 10 || gorev_detayi.trim().length > 500) {
    hataliAlanlar.push({
      alan: 'gorev_detayi',
      mesaj: 'gorev_detayi alanı zorunludur ve 10 ile 500 karakter arasında olmalıdır.'
    });
  }

  // 3. oncelik Kontrolü: Sadece 'düşük', 'orta' veya 'yüksek' olabilir
  const gecerliOncelikler = ['düşük', 'orta', 'yüksek'];
  const normalizeOncelik = oncelik ? oncelik.trim().toLowerCase() : '';
  
  if (!oncelik || !gecerliOncelikler.includes(normalizeOncelik)) {
    hataliAlanlar.push({
      alan: 'oncelik',
      mesaj: `oncelik alanı zorunludur ve sadece şu değerlerden biri olabilir: ${gecerliOncelikler.join(', ')}`
    });
  }

  // 4. durum Kontrolü (İsteğe bağlı ek güvenlik): Boş olamaz
  const gecerliDurumlar = ['beklemede', 'devam ediyor', 'tamamlandı'];
  const normalizeDurum = durum ? durum.trim().toLowerCase() : '';

  if (!durum || !gecerliDurumlar.includes(normalizeDurum)) {
    hataliAlanlar.push({
      alan: 'durum',
      mesaj: `durum alanı zorunludur ve şunlardan biri olmalıdır: ${gecerliDurumlar.join(', ')}`
    });
  }

  // Eğer hatalı alan varsa 400 Bad Request dön
  if (hataliAlanlar.length > 0) {
    return res.status(400).json({
      hata: 'Doğrulama (Validation) Hatası',
      detaylar: hataliAlanlar
    });
  }

  next();
};

module.exports = validateGorev;