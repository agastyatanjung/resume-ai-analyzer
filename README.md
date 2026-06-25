# AI Resume Analyzer 🚀

Sebuah platform web modern dan premium yang dirancang untuk membantu pengguna mengoptimalkan dan mengembangkan kualitas resume/CV mereka menggunakan kecerdasan buatan (AI). Platform ini membedah struktur CV, mengukur skor keselarasan dengan lowongan kerja (ATS Score), serta memberikan rekomendasi perbaikan secara instan.

---

## ✨ Fitur Utama

* **AI Resume & ATS Checker**: Membedah struktur kalimat, tata bahasa, dan keterbacaan sistem rekrutmen otomatis.
* **Skor Kecocokan Kerja**: Mengukur persentase keselarasan antara resume pengguna dengan kriteria lowongan (*Job Description*) secara *real-time*.
* **Rekomendasi Pintar**: Memberikan saran perbaikan kata kunci (*keywords*) spesifik untuk meningkatkan nilai jual CV di mata HRD.
* **Desain Sinematik & Premium**: Antarmuka berbasis *Dark Mode* dengan implementasi efek *Glassmorphism* dan animasi latar belakang yang halus.
* **Navigasi Dinamis**: *Navbar* interaktif yang otomatis bertransisi dari transparan menjadi efek kaca buram saat halaman digulirkan (*scroll*).

---

## 🛠️ Tech Stack yang Digunakan

Aplikasi ini dibangun menggunakan teknologi mutakhir berikut:

* **Framework**: React.js (Vite)
* **Styling**: Tailwind CSS
* **Icons**: React Icons (`md` & `io5` packs)
* **Routing**: React Router DOM
* **AI Engine**: Puter.js AI SDK (Inference Model)

---

## 📁 Struktur Dokumen Utama (Komponen Kunci)

Berikut adalah beberapa komponen penting yang mengatur logika tampilan dan interaksi di proyek ini:

1. **`src/pages/Home.jsx`** Halaman pendaratan (*Hero Section*) utama yang berisi teks headline transformatif, tombol interaktif, dan dekorasi 4 lingkaran gradien animasi.
2. **`src/components/Navbar.jsx`** Komponen navigasi atas dengan deteksi posisi *scroll* otomatis (`window.scrollY`) untuk memicu transisi visual *backdrop blur*.
3. **`src/components/Button.jsx`** Tombol kapsul kustom premium yang terintegrasi dengan komponen `<Link>` untuk perpindahan halaman tanpa *reload*.
4. **`src/pages/ResumeUploader.jsx`** Pusat pemrosesan berkas, berisi logika komunikasi dengan API Puter AI dan penanganan *error tracking* (seperti penanganan internal server error 500).

---

## 🚀 Cara Menjalankan Proyek secara Lokal

Ikuti langkah-langkah di bawah ini untuk memasang proyek ini di komputer Anda:

### 1. Clone Repositori
```bash
git clone [https://github.com/username/ai-resume-analyzer.git](https://github.com/username/ai-resume-analyzer.git)
cd ai-resume-analyzer
