Dokumentasi Integrasi & Troubleshooting Puter.js AI SDK
Dokumen ini merangkum cara penggunaan SDK Puter.js untuk fitur AI Resume Analyzer, kendala infrastruktur yang sering terjadi (seperti pemutusan koneksi WebSocket/Server Error 500), serta solusi implementasi kode pertahanan (robust error handling) agar aplikasi tidak mengalami macet (stuck loading).

1. Cara Penggunaan & Implementasi Dasar
   Puter.js menyediakan akses ke pustaka kecerdasan buatan secara gratis di sisi klien (client-side) tanpa memerlukan kunci API privat.
   Cara Memasang SDK
   Pastikan skrip SDK Puter telah dimuat di dalam file index.html proyek Anda sebelum aplikasi React dieksekusi:
   HTML
   <script src="https://js.puter.com/v2/"></script>
   Implementasi Kode pada Komponen React
   Setelah skrip dimuat, objek puter akan tersedia secara global di dalam jendela browser (window.puter). Berikut adalah contoh fungsi pemanggilan dasarnya:
   JavaScript
   const response = await window.puter.ai.chat(systemPrompt);
   console.log(response.message.content);
2. Masalah yang Sering Terjadi (Infrastruktur & Jaringan)
   Saat mengembangkan aplikasi dengan Puter.js, terdapat dua kendala utama yang sering muncul di konsol pengembang (Developer Console):
   Kendala A: Kegagalan Jabat Tangan WebSocket
   Plaintext
   [Error] WebSocket connection to 'wss://api.puter.com/socket.io/?EIO=4&transport=websocket' failed:
   WebSocket is closed before the connection is established.
   Penyebab: Puter menggunakan protokol WebSocket untuk mempertahankan koneksi real-time. Error ini terjadi karena koneksi terputus di tengah jalan, baik karena rate-limiting dari server Puter (akibat efek auto-refresh HMR dari Vite saat menyimpan kode terlalu sering) atau akibat kebijakan pemblokiran tipe data tertentu oleh ISP lokal.
   Kendala B: Internal Server Error (Status 500)
   Plaintext
   [Error] Failed to load resource: the server responded with a status of 500 (Internal Server Error)
   Penyebab: Karena layanan ini gratis dan tanpa token autentikasi khusus, server Puter terkadang mengalami kelebihan muatan (overload) saat menerima lonjakan permintaan data, sehingga memutus respons sebelum selesai memproses teks dokumen.
3. Solusi Kode Pertahanan (Robust Error Handling)
   Untuk mencegah aplikasi mengalami pembekuan antarmuka (freeze) atau stuck loading saat server Puter mengalami gangguan, logika pemanggilan fungsi wajib dibungkus menggunakan blok try-catch dengan validasi objek yang ketat.
   Berikut adalah kode solusi optimal untuk diterapkan pada file komponen seperti ResumeUploader.jsx:
   JavaScript
   const handleAnalyze = async (e) => {
   e.preventDefault();

// 1. Validasi Input Awal
if (!resumeText || !jobDesc) {
setError('Mohon lengkapi dokumen resume dan deskripsi pekerjaan.');
return;
}

setLoading(true);
setLoadingText('AI sedang menganalisis kecocokan resume...');
setError('');
setResult(null);

const systemPrompt = `
Anda adalah seorang HR Expert dan ATS Analyzer profesional.
Analisis kecocokan antara Teks Resume dan Deskripsi Pekerjaan berikut.
Wajib berikan penilaian dalam format JSON murni:
{
"atsScore": 85,
"summary": "Ringkasan...",
"strengths": ["Kelebihan"],
"weaknesses": ["Kekurangan"],
"suggestions": ["Saran"]
}

    Resume: ${resumeText}
    Job Desc: ${jobDesc}

`;

try {
// 2. Validasi Ketersediaan Objek SDK (Mencegah ReferenceError)
if (!window.puter || !window.puter.ai) {
throw new Error('Layanan Puter AI belum siap atau terblokir. Mohon muat ulang halaman Anda.');
}

    // 3. Eksekusi Request ke API
    const response = await window.puter.ai.chat(systemPrompt);

    // 4. Validasi Keberadaan Konten Respons
    if (!response || !response.message || !response.message.content) {
      throw new Error('Server AI berhasil terhubung namun mengembalikan respons kosong.');
    }

    // 5. Validasi Parsing JSON (Mencegah Crash jika AI mengembalikan teks teks biasa)
    const parsedResult = JSON.parse(response.message.content);
    setResult(parsedResult);

} catch (err) {
console.error("Detail Log Kegagalan:", err);

    // 6. Penanganan Tipe Error Spesifik
    if (err instanceof SyntaxError) {
      setError('Format data yang dikembalikan AI tidak sesuai standar. Silakan klik tombol analisis kembali.');
    } else {
      setError(err.message || 'Gagal terhubung ke server AI (Puter Server Error 500). Silakan coba beberapa saat lagi.');
    }

} finally {
// 7. Memastikan Status Loading Dimatikan Apapun Hasilnya
setLoading(false);
setLoadingText('');
}
}; 4. Langkah Mitigasi Tambahan Bagi Pengembang
Jika kendala WebSocket dan Status 500 terus berulang selama proses pengerjaan kode secara lokal, lakukan langkah-langkah berikut:
Gunakan Hard Refresh (Ctrl + F5 atau Cmd + Shift + R): Ini berguna untuk membersihkan sisa jabat tangan koneksi WebSocket yang menggantung (zombie connections) di memori browser.
Gunakan Hotspot Sementara: Jika rute jaringan internet utama mengalami interferensi dengan server socket.io milik Puter, beralih ke jaringan seluler sementara dapat memulihkan stabilitas jabat tangan WebSocket.
