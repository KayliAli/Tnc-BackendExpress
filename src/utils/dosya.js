const fs = require('fs');
const path = require('path');

// Dosya Oluşturma
function dosyaOlustur(dosyaYolu, dosyaAdi) {
  // 1. Eğer dosya adı ayrı geldiyse birleştir, yoksa doğrudan dosyaYolu'nu al
  const tamYol = dosyaAdi ? path.join(dosyaYolu, dosyaAdi) : dosyaYolu;

  // 2. Klasörün var olup olmadığını kontrol et, yoksa oluştur
  const klasor = path.dirname(tamYol);
  if (!fs.existsSync(klasor)) {
    fs.mkdirSync(klasor, { recursive: true });
  }

  // 3. Dosya yoksa sadece 1 kez içine geçerli boş bir JSON dizisi ('[]') yaz
  if (!fs.existsSync(tamYol)) {
    fs.writeFileSync(tamYol, '[]', 'utf8');
    return true; // Dosya yeni oluşturuldu
  }

  return false; // Dosya zaten vardı
};
// Dosya Okuma
function dosyaOku(dosyaYolu) {
  const veri = fs.readFileSync(dosyaYolu, 'utf8');
  if (!veri) {
    return [];
  }

  return JSON.parse(veri);
};
// Dosya Yazma
function dosyaYaz(dosyaYolu, veri) {
  const jsonVeri = JSON.stringify(veri, null, 2);
  fs.writeFileSync(dosyaYolu, jsonVeri, 'utf8');
};

module.exports = {
  dosyaOlustur,
  dosyaOku,
  dosyaYaz
};
