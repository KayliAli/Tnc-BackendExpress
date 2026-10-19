# 📋Görev ve Proje Yönetim Sistemi (API Geliştirme Projesi)

Node.js ve Express.js kullanılarak geliştirilmiş, JSON dosya tabanlı, modüler mimariye sahip bir görev ve proje yönetim REST API servisi.

---

## 🏛️ Mimari ve Proje Yapısı

Proje, HTTP sunucusu, Express uygulaması, middleware'ler, rotalar ve JSON dosya işlemlerini ayrı modüllerde tutar. Mevcut klasör ve dosya yapısı şöyledir:

```text
Tnc-BackendExpress/
├── data/
│   ├── calisanlar.json             # Çalışan kayıtları
│   ├── gorevler.json               # Görev kayıtları
│   └── logs/
│       └── log.json                # HTTP istek kayıtları
├── docs/
│   ├── postman/
│   │   ├── Calisan/                # Çalışan uç noktalarına ait örnekler
│   │   ├── Gorev/                  # Görev uç noktalarına ait örnekler
│   │   └── Rapor/                  # Rapor uç noktalarına ait örnekler
│   ├── Detayli_API_Test_Raporu.pdf
│   └── Proje_Tanitimi.pdf
├── src/
│   ├── middleware/
│   │   ├── logger.js               # İstekleri JSON log dosyasına kaydeder
│   │   └── validateGorev.js        # Görev verilerini doğrular
│   ├── route/
│   │   ├── calisan.js              # Çalışan işlemleri
│   │   ├── gorev.js                # Görev işlemleri
│   │   └── rapor.js                # Raporlama işlemleri
│   ├── utils/
│   │   └── dosya.js                # JSON dosyalarını okur ve yazar
│   ├── app.js                      # Express uygulamasını ve rotaları yapılandırır
│   └── server.js                   # Uygulamayı PORT veya 3000 üzerinde başlatır
├── .env                            # Yerel ortam değişkenleri (Git'e eklenmez)
├── .gitignore                      # Git dışında tutulacak dosyalar
├── package-lock.json               # Bağımlılık sürümlerini sabitler
├── package.json                    # Proje bilgileri ve bağımlılıklar
└── README.md
```

### İstek Akışı ve Sorumluluklar

1. `src/server.js`, Express uygulamasını `PORT` ortam değişkeninde belirtilen portta; bu değişken tanımlı değilse `3000` portunda başlatır.
2. `src/app.js`, JSON istek gövdelerini çözümler, istek kayıt middleware'ini ve çalışan, görev ve rapor rotalarını Express uygulamasına ekler.
3. `src/middleware/logger.js`, her isteğin zamanını, HTTP metodunu ve URL'sini `data/logs/log.json` dosyasına yazar. `validateGorev.js`, görev oluşturma ve güncelleme isteklerinde alan doğrulaması yapar.
4. `src/route/` altındaki modüller API işlemlerini yürütür. JSON tabanlı kayıtlar `src/utils/dosya.js` aracılığıyla `data/` altındaki dosyalardan okunur ve bu dosyalara yazılır.

Bu projede kalıcı veri deposu olarak bir veritabanı yerine JSON dosyaları kullanılır. `node_modules/` gibi kurulumla oluşturulan klasörler proje ağacına dahil edilmemiştir.


---

## 📡 API Uç Noktaları

Temel URL: `http://localhost:3000`

| Grup | Metot | Uç nokta |
| :--- | :--- | :--- |
| Görev | `POST` | `/gorev` |
| Görev | `GET` | `/gorev` |
| Görev | `GET` | `/gorev/ara` |
| Görev | `GET` | `/gorev/:id` |
| Görev | `PUT` | `/gorev/:id` |
| Görev | `PATCH` | `/gorev/:id/ata` |
| Görev | `DELETE` | `/gorev/:id` |
| Çalışan | `POST` | `/calisan` |
| Çalışan | `GET` | `/calisan` |
| Çalışan | `GET` | `/calisan/:id/gorevler` |
| Çalışan | `DELETE` | `/calisan/:id` |
| Rapor | `GET` | `/rapor/completed` |
| Rapor | `GET` | `/rapor/pending` |
| Rapor | `GET` | `/rapor/ozet` |
| Rapor | `GET` | `/rapor/log` |

İstek gövdeleri, filtre parametreleri ve örnek yanıtlar için [detaylı API raporuna](docs/Detayli_API_Test_Raporu.pdf) ve [Postman örneklerine](docs/postman/) bakabilirsiniz.

---

## 📄 Veri Modelleri

Kayıtlar dosya sisteminde JSON formatındaki bu örnek şemalar ile saklanır:
### Görev veri modeli (`data/gorevler.json`)
```json
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
### Çalışan veri modeli (`data/calisanlar.json`)
```json
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
- **dotenv** (`.env` dosyasındaki ortam değişkenlerini yükler)
- **fs & path** (Yerleşik Node.js modülleri)

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda ayağa kaldırmak için aşağıdaki adımları uygulayın:

### Gereksinimler
* **Node.js** (v18.0.0 veya üzeri)
* **npm** (v8.0.0 veya üzeri)
Sürümleri kontrol etmek için:

```bash
node --version
npm --version
```

### Adım 1: Bağımlılıkları Yükleme
Proje kök dizininde, `package.json` ve `package-lock.json` dosyalarının bulunduğu yerde çalıştırın:

```bash
npm install
```

### Adım 2: Sunucuyu Başlatma
Yine proje kök dizininde aşağıdaki komutu çalıştırın:

```bash
node src/server.js
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Port Ayarı
`src/server.js` başlatılırken proje kök dizinindeki `.env` dosyası kontrol edilir. Dosya yoksa otomatik oluşturulur ve varsayılan port eklenir:

```env
PORT=3000
```

Dosya zaten varsa içeriği korunur ve `PORT` değeri yüklenir. Başka bir port kullanmak için `.env` içindeki değeri değiştirin. `.env` dosyası `.gitignore` kapsamında olduğundan gizli veya makineye özel değerleri Git'e eklemeyin.

---

## 📚 Ek Dokümantasyonlar ve Raporlar

Projenin test süreçleri, endpoint detayları ve Postman ekran görüntülerini içeren profesyonel kullanım kılavuzlarına aşağıdaki bağlantılardan ulaşabilirsiniz:

- 📄 [Detaylı API Test ve Kullanım Raporu](docs/Detayli_API_Test_Raporu.pdf)
- 📝 [Proje Tanıtım ve Mimari Dokümanı ](docs/Proje_Tanitimi.pdf)


---
