# 📋Görev ve Proje Yönetim Sistemi (API Geliştirme Projesi)

Node.js ve Express.js kullanılarak geliştirilmiş, JSON dosya tabanlı, modüler mimariye sahip bir görev ve proje yönetim REST API servisi.

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
* **`app.js` (Uygulama Giriş Noktası):** `express.json()` gövde çözümleyicisini tanımlar, rotaları bağlar ve sunucuyu belirtilen port üzerinden dinlemeye alır.
* **`dosya.js` (Veri Erişim Katmanı):** `fs` ve `path` modüllerini kullanarak `data/gorevler.json,data/calisanlar.json` dosyalarını denetler, klasör/dosya yoksa otomatik üretir ve verileri senkron olarak okur/yazar.
* **`routes/gorev.js` (Yönlendirme Katmanı):** `/gorev` altındaki HTTP isteklerini (`GET`, `POST`, `PUT`, `DELETE`) yöneten Express yönlendiricisidir.


---

## 📡 API Uç Noktaları (Endpoints)

Temel URL: `http://localhost:3000/gorev`

| Metot | Uç Nokta | Açıklama | Beklenen İstek Gövdesi |
| :--- | :--- | :--- | :--- |
| `POST` | `/gorev` | Yeni bir görev kaydı oluşturur | `{ gorev_object }` |
| `GET` | `/gorev` | Kayıtlı tüm görevleri listeler | *Yok* |
| `GET` | `/gorev?status=durum&sirala=asc` | Görevleri filtreler, sıralar ve sayfalar | *Yok* |
| `GET` | `/gorev/ara?key=backend` | Belirtilen kelimeye göre görev arar | *Yok* |
| `GET` | `/gorev/:id` | Belirtilen ID'ye sahip görevi getirir | *Yok* |
| `PUT` | `/gorev/:id` | Belirtilen ID'ye sahip görevi günceller | `{ gorev_object }` |
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
    "id": "<integer>",
    "gorev_adi": "<string>",
    "gorev_detayi": "<string>",
    "durum": "<string> ('bekliyor' | 'devam ediyor' | 'tamamlandı')",
    "oncelik": "<string> ('düşük' | 'orta' | 'yüksek')",
    "calisan_id": "<integer>"
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
    "id": "<integer>",
    "gorev_adi": "<string>",
    "gorev_detayi": "<string>",
    "durum": "<string> ('bekliyor' | 'devam ediyor' | 'tamamlandı')",
    "oncelik": "<string> ('düşük' | 'orta' | 'yüksek')",
    "calisan_id": "<integer>"
}
```

### 5. Görev Silme (`DELETE`)
    DELETE -  http://localhost:3000/gorev/1

---

## 📄 Veri Modelleri

Kayıtlar dosya sisteminde JSON formatındaki bu örnek şemalar ile saklanır:
### Görev veri modeli (`data/gorevler.json`)
```http
[
  {
    "id": 1,
    "gorev_adi": "Kullanıcı Giriş Modülü",
    "gorev_detayi": "JWT tabanlı kimlik doğrulama ve refresh token yapısının kurulması.",
    "durum": "tamamlandı",
    "oncelik": "yüksek",
    "calisan_id": 101
  }
]
```
### Çalışan veri modeli ('data/calisanlar.json)
```http
[
  {
    "id": 101,
    "ad_soyad": "Hakan Yılmaz",
    "email": "hakan@example.com",
    "departman": "Backend",
    "unvan": "Node.js Geliştirici"
  }
]
```

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
#### İndirdiğiniz paketleri kontrol etmek için aşağıdaki komutları kullanabilirsiniz;
```bash 
       node --v
       npm --v
```   

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
