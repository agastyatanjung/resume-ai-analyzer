import React, { useState } from "react";
import { VscFiles } from "react-icons/vsc";

function ResumeUploader() {
  const [fileName, setFileName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Fungsi pengekstrak teks PDF menggunakan global window library
  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const buffer = e.target.result;
          const typedArray = new Uint8Array(buffer);

          // Mengambil pdfjsLib langsung dari objek window browser
          const pdfjsLib = window["pdfjs-dist/build/pdf"];

          if (!pdfjsLib) {
            reject(
              "Library PDF belum termuat sempurna di browser. Mohon refresh halaman.",
            );
            return;
          }

          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          let compiledText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();

              if (textContent && textContent.items) {
                const pageText = textContent.items
                  .map((item) => item.str || "")
                  .join(" ");
                compiledText += pageText + "\n";
              }
            } catch (pageErr) {
              console.warn(`Gagal membaca halaman ${i}:`, pageErr);
              continue;
            }
          }

          if (!compiledText.trim()) {
            reject(
              "Teks tidak ditemukan. PDF mungkin hanya berisi gambar/scan.",
            );
          } else {
            resolve(compiledText);
          }
        } catch (err) {
          console.error("Detail Error:", err);
          reject("Gagal membedah struktur file PDF.");
        }
      };

      reader.onerror = () => reject("Gagal membaca file fisik.");
      reader.readAsArrayBuffer(file);
    });
  };

  // Handler saat memilih file
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isPDFMime = file.type === "application/pdf";
    const isPDFExtension = file.name.toLowerCase().endsWith(".pdf");

    if (!isPDFMime && !isPDFExtension) {
      setError("Format file harus berupa PDF!");
      setFileName("");
      setResumeText("");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setLoadingText("Sedang mengekstrak teks dari PDF...");
    setError("");
    setResult(null);

    try {
      const extractedText = await extractTextFromPDF(file);
      setResumeText(extractedText);
    } catch (err) {
      setError(err);
      setFileName("");
      setResumeText("");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  // Handler kirim ke Puter AI
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText) {
      setError("Mohon unggah file PDF resume Anda terlebih dahulu.");
      return;
    }
    if (!jobDesc) {
      setError("Mohon isi Deskripsi Pekerjaan tujuan terlebih dahulu.");
      return;
    }

    setLoading(true);
    setLoadingText("AI sedang menganalisis kecocokan resume...");
    setError("");
    setResult(null);

    const systemPrompt = `
      Anda adalah seorang HR Expert dan ATS (Applicant Tracking System) Analyzer profesional. 
      Tugas Anda adalah menganalisis kecocokan antara Teks Resume/CV dan Deskripsi Pekerjaan (Job Description) berikut.
      
      Berikan penilaian secara jujur dan objektif dalam format JSON murni. Jangan memberikan teks basa-basi sebelum atau sesudah JSON.
      
      Struktur JSON wajib seperti ini:
      {
        "atsScore": 85,
        "summary": "Ringkasan analisis...",
        "strengths": ["Kelebihan 1", "Kelebihan 2"],
        "weaknesses": ["Kekurangan 1", "Kekurangan 2"],
        "suggestions": ["Saran perbaikan 1", "Saran perbaikan 2"]
      }

      Berikut adalah datanya:
      Teks Resume Pelamar: ${resumeText}
      Deskripsi Lowongan Kerja: ${jobDesc}
    `;

    try {
      const response = await window.puter.ai.chat(systemPrompt);
      const parsedResult = JSON.parse(response.message.content);
      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError("Gagal menganalisis resume menggunakan AI. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* --- CONTAINER UTAMA BACKGROUND ANIMASI --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* 1. Lingkaran Biru & Ungu (Kiri Atas) - Efek Berdenyut Lambat */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 blur-[130px] opacity-40 animate-pulse z-[-99]" />

        {/* 2. Lingkaran Fuchsia & Merah Muda (Kanan Tengah) - Efek Berputar Sinematik */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 blur-[110px] opacity-30 animate-[spin_25s_linear_infinite] z-[-99]" />

        {/* 3. Lingkaran Sian & Toska (Kiri Bawah) - Efek Berdenyut Intens */}
        <div className="absolute bottom-1/3 -left-20 w-80 h-80 rounded-full bg-gradient-to-bl from-cyan-400 to-emerald-400 blur-[100px] opacity-25 animate-[pulse_5s_ease-in-out_infinite] z-[-99]" />

        {/* 4. Lingkaran Indigo & Violet Deep (Kanan Bawah) - Efek Glow Lembut */}
        <div className="absolute -bottom-40 right-10 w-[550px] h-[550px] rounded-full bg-gradient-to-r from-indigo-700 to-violet-600 blur-[140px] opacity-35 animate-[pulse_8s_ease-in-out_infinite] z-[-99]" />
      </div>
      {/* --- AKHIR BACKGROUND UTAMA --- */}

      <form
        onSubmit={handleAnalyze}
        className="bg-blue-700 backdrop-blur-md border border-white/20 p-10 rounded-2xl shadow-xl space-y-6"
      >
        <h2 className="text-4xl font-bold text-center text-white mb-4">
          AI PDF Resume Analyzer
        </h2>

        <div className="grid grid-row-1 md:grid-row-2 gap-6">
          {/* Upload Area */}
          <div className="flex flex-col justify-center">
            <label className="block text-sm text-center italic font-medium text-slate-200 mb-2">
              Unggah CV/Resume (PDF)
            </label>
            <div className="border-2 border-dashed border-slate-600 hover:border-cyan-500 rounded-xl p-8 text-center bg-slate-900/40 transition-all relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <div className="space-y-2">
                <VscFiles className="text-white text-5xl justify-center mx-auto" />
                <p className="text-sm text-slate-300">
                  {fileName
                    ? `File terpilih: ${fileName}`
                    : "Klik atau seret file PDF Anda ke sini"}
                </p>
                <p className="text-xs text-slate-500">
                  Maksimal 1 file (Format .pdf)
                </p>
              </div>
            </div>
            {resumeText && (
              <p className="text-xs text-emerald-400 mt-2">
                ✓ Berhasil membaca konten teks PDF
              </p>
            )}
          </div>

          {/* Job Desc Input */}
          <div>
            <label className="block text-sm font-medium text-center italic text-slate-200 mb-2">
              Deskripsi Pekerjaan (Job Desc)
            </label>
            <textarea
              className="w-full h-48 p-4 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all resize-none text-sm"
              placeholder="Tempel syarat lowongan kerja di sini..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || !resumeText}
          className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? loadingText : "Mulai Tinjau PDF"}
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl animate-pulse text-center text-slate-300">
          <p>{loadingText}</p>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="mt-8 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-2xl text-white space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-cyan-400">
              Hasil Peninjauan AI
            </h3>
            <span
              className={`text-2xl font-black px-3 py-1 rounded-lg ${result.atsScore >= 75 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
            >
              {result.atsScore}%
            </span>
          </div>
          <p className="text-slate-300">
            <span className="font-semibold text-white">Ringkasan:</span>{" "}
            {result.summary}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl">
              <h4 className="font-bold text-emerald-400 mb-2">👍 Kekuatan</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                {result.strengths.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-xl">
              <h4 className="font-bold text-rose-400 mb-2">⚠️ Kekurangan</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                {result.weaknesses.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-blue-950/30 border border-blue-900/50 p-4 rounded-xl">
            <h4 className="font-bold text-blue-400 mb-2">
              💡 Langkah Perbaikan
            </h4>
            <ul className="list-decimal list-inside space-y-2 text-slate-300 text-sm">
              {result.suggestions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeUploader;
