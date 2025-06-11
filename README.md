# Chatbot AI dengan Konteks Dinamis (RAG)

![GitHub Language Count](https://img.shields.io/github/languages/count/GratiaManullang03/ChatBot?style=for-the-badge)
![GitHub Top Language](https://img.shields.io/github/languages/top/GratiaManullang03/ChatBot?style=for-the-badge&color=4f46e5)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

Ini adalah proyek chatbot AI berbasis web yang sederhana namun kuat. Chatbot ini menggunakan 'knowledge base' dinamis dari file JSON untuk memberikan jawaban yang relevan sesuai konteks. Proyek ini mengimplementasikan teknik **Retrieval-Augmented Generation (RAG)** secara sederhana untuk meningkatkan akurasi dan relevansi respons AI.

---

## ✨ Fitur-fitur Utama

- **Arsitektur Aman**: API Key tidak lagi diekspos di frontend. Semua panggilan ke API eksternal ditangani melalui serverless function yang aman.
- **Konteks Dinamis**: Pengetahuan chatbot dimuat dari file `data.json` eksternal, membuatnya mudah untuk diperbarui dan dikelola.
- **Retrieval-Augmented Generation (RAG)**: Secara otomatis mencari data yang relevan dengan pertanyaan pengguna dan menyuntikkannya sebagai konteks ke dalam prompt.
- **Render Markdown**: Respons dari AI yang diformat dalam Markdown ditampilkan dengan benar di antarmuka.
- **UI Responsif**: Tampilan bersih dan modern yang dibuat dengan Tailwind CSS, berfungsi baik di desktop maupun mobile.
- **Siap Deploy**: Dikonfigurasi untuk kemudahan deployment di platform seperti Vercel menggunakan Environment Variables.

---

## 🚀 Tumpukan Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js (via Vercel Serverless Functions)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI API**: [Together.ai](https://together.ai/)
- **Markdown Parser**: [Marked.js](https://marked.js.org/)

---

## 🔧 Instalasi dan Penggunaan

Untuk menjalankan proyek ini di mesin lokal Anda atau mendeploy-nya, ikuti langkah-langkah berikut:

**1. Clone Repositori**

```bash
git clone [https://github.com/GratiaManullang03/ChatBot.git](https://github.com/GratiaManullang03/ChatBot.git)
cd ChatBot
```
