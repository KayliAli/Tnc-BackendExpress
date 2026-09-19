
const express = require('express');
const router = express.Router();
// Görev Ekleme - Post

router.post('/gorev', (req, res) => {
  // Görev ekleme işlemleri burada yapılacak
  res.send('Görev eklendi');
});

// Görev Listeleme - Get

router.get('/gorev', (req, res) => {
  // Görev listeleme işlemleri burada yapılacak
  res.send('Görevler listelendi');
} );

// Görev Detay - Get

router.get('/gorev/:id', (req, res) => {
  // Görev detay işlemleri burada yapılacak
  res.send('Görev detayları gösterildi');
});

// Görev Güncelleme - Put

router.put('/gorev/:id', (req, res) => {
  // Görev güncelleme işlemleri burada yapılacak
  res.send('Görev güncellendi');
});

// Görev Silme - Delete

router.delete('/gorev/:id', (req, res) => {
  // Görev silme işlemleri burada yapılacak
  res.send('Görev silindi');
});
