# Chatbot AI dengan Konteks Dinamis (RAG)

![GitHub Language Count](https://img.shields.io/github/languages/count/GratiaManullang03/ChatBot?style=for-the-badge)
![GitHub Top Language](https://img.shields.io/github/languages/top/GratiaManullang03/ChatBot?style=for-the-badge&color=4f46e5)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

Ini adalah proyek chatbot AI berbasis web yang sederhana namun kuat. Chatbot ini menggunakan 'knowledge base' dinamis dari file JSON untuk memberikan jawaban yang relevan sesuai konteks. Proyek ini mengimplementasikan teknik **Retrieval-Augmented Generation (RAG)** secara sederhana untuk meningkatkan akurasi dan relevansi respons AI.

---

## ✨ Fitur-fitur Utama

- **Konteks Dinamis**: Pengetahuan chatbot dimuat dari file `data.json` eksternal, membuatnya mudah untuk diperbarui dan dikelola.
- **Retrieval-Augmented Generation (RAG)**: Secara otomatis mencari data yang relevan dengan pertanyaan pengguna dan menyuntikkannya sebagai konteks ke dalam prompt API.
- **Render Markdown**: Respons dari AI yang diformat dalam Markdown (seperti daftar, teks tebal, atau blok kode) ditampilkan dengan benar di antarmuka.
- **Persona Kustom**: Kepribadian dan aturan AI dapat dengan mudah diubah melalui _System Prompt_ di `script.js`.
- **UI Responsif**: Tampilan bersih dan modern yang dibuat dengan Tailwind CSS, berfungsi baik di desktop maupun mobile.
- **Mudah Dikonfigurasi**: Cukup ganti API key dan edit file `data.json` untuk menyesuaikan dengan kebutuhan Anda.

---

## 🚀 Tumpukan Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI API**: [Together.ai](https://together.ai/)
- **Markdown Parser**: [Marked.js](https://marked.js.org/)

---

## 🔧 Instalasi dan Penggunaan

Untuk menjalankan proyek ini di mesin lokal Anda, ikuti langkah-langkah berikut:

**1. Clone Repositori**

```bash
git clone [https://github.com/GratiaManullang03/ChatBot.git](https://github.com/GratiaManullang03/ChatBot.git)
cd ChatBot
```
