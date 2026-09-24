# 📋Görev ve Proje Yönetim Sistemi API Geliştirme Projesi

Node.js ve Express.js kullanılarak geliştirilmiş, JSON dosya tabanlı, modüler mimariye sahip bir görev ve not yönetim REST API servisi.

---

## 🏛️ Mimari ve Proje Yapısı

Uygulama, kodun bakımını kolaylaştırmak ve sorumlulukları ayırmak (*Separation of Concerns*) amacıyla modüler bir yapıda kurgulanmıştır:
    
````bash
proje-klasoru/
├── data/
│   ├── logs/
│   │   └── log.json              # Uygulama log kayıtlarının tutulduğu dosya
│   ├── gorevler.json             # Görev verilerinin saklandığı JSON deposu
│   └── calisanlar.json           # Çalışan verilerinin saklandığı JSON deposu
├── src/
│   ├── middleware/               # Ara yazılımların (Middleware) bulunduğu klasör
│   │   └── logger.js             # İstekleri ve hataları loglayan ara yazılım
│   ├── route/                    # REST API rotalarının (Router) bulunduğu klasör
│   │   ├── calisan.js            # Çalışan işlemleri için uç noktalar
│   │   ├── gorev.js              # Görev işlemleri için uç noktalar
│   │   └── rapor.js              # Raporlama işlemleri için uç noktalar
│   └── utils/                    # Yardımcı modüllerin bulunduğu klasör
│       └── dosya.js              # Dosya okuma/yazma (I/O) işlemlerini yöneten modül
├── app.js                        # Express uygulamasının yapılandırıldığı dosya
├── server.js                     # Sunucuyu (port) ayağa kaldıran ana giriş noktası
├── package-lock.json             # Bağımlılıkların kilit versiyonlarını tutan dosya
└── package.json                  # Proje bağımlılıkları ve yapılandırma dosyası
`````
### Katman Sorumlulukları
* **`notlar.js` (Veri Erişim Katmanı):** `fs` ve `path` modüllerini kullanarak `data/notlar.json` dosyasını denetler, klasör/dosya yoksa otomatik üretir ve verileri senkron olarak okur/yazar.
* **`routes/gorev.js` (Yönlendirme Katmanı):** `/gorev` altındaki HTTP isteklerini (`GET`, `POST`, `PUT`, `DELETE`) yöneten Express yönlendiricisidir.
* **`app.js` (Uygulama Giriş Noktası):** `express.json()` gövde çözümleyicisini tanımlar, rotaları bağlar ve sunucuyu belirtilen port üzerinden dinlemeye alır.

---

## 📡 API Uç Noktaları (Endpoints)

Temel URL: `http://localhost:3000/gorev`

| Metot | Uç Nokta | Açıklama | Beklenen İstek Gövdesi |
| :--- | :--- | :--- | :--- |
| `POST` | `/gorev` | Yeni bir görev kaydı oluşturur | `{ "gorev_adi": string, "aciklama": string }` |
| `GET` | `/gorev` | Kayıtlı tüm görevleri listeler | *Yok* |
| `GET` | `/gorev?status=durum&sirala=asc` | Görevleri filtreler, sıralar ve sayfalar | *Yok* |
| `GET` | `/gorev/ara?key=backend` | Belirtilen kelimeye göre görev arar | *Yok* |
| `GET` | `/gorev/:id` | Belirtilen ID'ye sahip görevi getirir | *Yok* |
| `PUT` | `/gorev/:id` | Belirtilen ID'ye sahip görevi günceller | `{ "gorev_adi": string, "aciklama": string }` |
| `PATCH`| `/gorev/:id/ata` | Belirtilen ID'ye sahip göreve çalışan atar | `{ "calisan_id": 101 }` |
| `DELETE`| `/gorev/:id` | Belirtilen ID'ye sahip görevi siler | *Yok* |

---

## 🧪 API Testleri ve Örnek İstekler

Sistemi tarayıcı üzerinden veya **Postman** gibi istemcilerle aşağıdaki şablonlar aracılığıyla test edebilirsiniz:

### 1. Yeni Görev Ekleme (`POST`)
```http
POST http://localhost:3000/gorev
Content-Type: application/json

{
  "baslik": "Rapor Hazırlama",
  "icerik": "Haftalık sprint raporu çıkarılacak."
}
```

### 2. Tüm Görevleri Listeleme (`GET`)
     GET - http://localhost:3000/gorev

### 3. Tekil Görev Detayı (`GET`)
     GET - http://localhost:3000/gorev/1

### 4. Görev Güncelleme (`PUT`)
```http
POST http://localhost:3000/gorev
Content-Type: application/json

{
  "baslik": "Rapor Hazırlama",
  "icerik": "Haftalık sprint raporu çıkarılacak."
}
```

### 5. Görev Silme (`DELETE`)
    DELETE -  http://localhost:3000/gorev/1

---

## 📄 Veri Modeli (`data/gorevler.json`)

Kayıtlar dosya sisteminde JSON formatında şu şema ile saklanır:

    [
      {
        "id": 1,
        "baslik": "Market",
        "icerik": "Süt, ekmek alınacak"
      },
      {
        "id": 2,
        "baslik": "Toplantı",
        "icerik": "Pazartesi 10:00"
      }
    ]
# Çalışan veri modeli ('data/calisanlar.json)
    [
      {
        "id": 1,
        "baslik": "Market",
        "icerik": "Süt, ekmek alınacak"
      },
      {
        "id": 2,
        "baslik": "Toplantı",
        "icerik": "Pazartesi 10:00"
      }
    ]

---

## 🛠️ Kullanılan Teknolojiler

- **Node.js** (Runtime Environment)
- **Express.js** (Web Framework & Routing)
- **fs & path** (Yerleşik Node.js modülleri)

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda ayağa kaldırmak için aşağıdaki adımları uygulayın:

### Gereksinimler
* **Node.js** (v16.0.0 veya üzeri)
* **npm** (v8.0.0 veya üzeri)

### Adım 1: Bağımlılıkların Yüklenmesi
Terminal üzerinden Express kütüphanesini kurun:  

```bash 
       npm install express
```   

### Adım 2: Sunucunun Başlatılması
Express sunucusunu aktif hale getirin:  
```bash
    cd src
    node server.js
```
---
