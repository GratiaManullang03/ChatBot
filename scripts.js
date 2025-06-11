document.addEventListener('DOMContentLoaded', function () {
	// === KONSTANTA & VARIABEL GLOBAL ===
	const API_URL = 'https://api.together.xyz/v1/chat/completions';
	const MODEL = 'deepseek-ai/DeepSeek-V3';
	let knowledgeBase = []; // Akan diisi dari data.json
	let conversationHistory = []; // Dikosongkan, diisi setelah inisialisasi

	// === ELEMEN DOM ===
	const chatWindow = document.getElementById('chat-window');
	const chatForm = document.getElementById('chat-form');
	const messageInput = document.getElementById('message-input');
	const sendBtn = document.getElementById('send-btn');
	const clearChatBtn = document.getElementById('clear-chat');

	// === FUNGSI UTAMA ===

	/**
	 * Inisialisasi Aplikasi:
	 * 1. Memuat data dari data.json
	 * 2. Mengatur system prompt
	 * 3. Menampilkan pesan selamat datang
	 * 4. Mengaktifkan input dan event listeners
	 */
	async function initializeApp() {
		try {
			const response = await fetch('data.json');
			if (!response.ok) throw new Error('Gagal memuat data.json');
			knowledgeBase = await response.json();
			console.log('Knowledge base berhasil dimuat:', knowledgeBase);
		} catch (error) {
			console.error(error);
			addMessage(
				`Error: Gagal memuat data pengetahuan. ${error.message}`,
				false
			);
			return;
		}

		// Atur system prompt dengan instruksi penggunaan konteks
		conversationHistory = [
			{
				role: 'system',
				content: `Anda adalah asisten AI dari "Toko Komputer Hebat". Selalu jawab dengan ramah, sopan, dan dalam format Markdown.
            Saat pengguna bertanya, saya mungkin akan memberikan "Konteks Relevan" yang diambil dari database.
            Gunakan informasi dari "Konteks Relevan" tersebut untuk memberikan jawaban yang akurat.
            Jika tidak ada konteks yang diberikan atau konteksnya tidak menjawab pertanyaan, katakan dengan jujur bahwa Anda tidak memiliki informasi tersebut dan sarankan untuk bertanya lebih spesifik.`,
			},
		];

		addMessage(
			'Halo! Saya asisten dari Toko Komputer Hebat. Ada yang bisa saya bantu? Anda bisa tanya tentang produk, harga, atau jam buka.',
			false
		);

		// Aktifkan form input
		messageInput.disabled = false;
		sendBtn.disabled = false;
		messageInput.placeholder = 'Tanya tentang produk kami...';

		// Tambahkan event listeners
		chatForm.addEventListener('submit', handleFormSubmit);
		clearChatBtn.addEventListener('click', handleClearChat);
	}

	/**
	 * Menangani submit form chat
	 */
	async function handleFormSubmit(e) {
		e.preventDefault();
		const userInput = messageInput.value.trim();
		if (!userInput) return;

		// Tampilkan pesan pengguna dan tambahkan ke riwayat
		addMessage(userInput, true);
		conversationHistory.push({ role: 'user', content: userInput });
		messageInput.value = '';

		// Cari konteks relevan dari knowledge base
		const context = findRelevantContext(userInput);

		let finalPrompt = userInput;
		if (context) {
			finalPrompt = `Konteks Relevan:\n${context}\n\n---\n\nPertanyaan Pengguna: "${userInput}"`;
			console.log('Prompt dengan konteks:', finalPrompt);
		}

		// Dapatkan dan tampilkan respons AI
		await getAIResponse(finalPrompt);
	}

	/**
	 * Menangani pembersihan chat
	 */
	function handleClearChat() {
		chatWindow.innerHTML = '';
		initializeApp(); // Re-inisialisasi chat ke kondisi awal
	}

	/**
	 * Mencari konteks yang relevan dari knowledge base berdasarkan input pengguna
	 * @param {string} userInput - Teks dari pengguna
	 * @returns {string} - String berisi konteks yang ditemukan atau string kosong
	 */
	function findRelevantContext(userInput) {
		const keywords = userInput.toLowerCase().split(/\s+/);
		let relevantItems = [];

		knowledgeBase.forEach((item) => {
			const itemText = (item.nama + ' ' + item.tags.join(' ')).toLowerCase();
			if (keywords.some((keyword) => itemText.includes(keyword))) {
				// Format item menjadi string yang mudah dibaca
				let itemInfo = `- Nama: ${item.nama}\n  Deskripsi: ${item.deskripsi}`;
				if (item.harga)
					itemInfo += `\n  Harga: Rp ${item.harga.toLocaleString('id-ID')}`;
				if (item.stok) itemInfo += `\n  Stok: ${item.stok}`;
				relevantItems.push(itemInfo);
			}
		});

		return relevantItems.join('\n\n');
	}

	/**
	 * Mengirim permintaan ke API dan menampilkan respons
	 * @param {string} promptToSend - Prompt yang akan dikirim (bisa dengan atau tanpa konteks)
	 */
	async function getAIResponse(promptToSend) {
		const typingIndicator = showTypingIndicator();
		sendBtn.disabled = true;

		// Buat salinan riwayat sementara untuk dikirim ke API
		const apiHistory = JSON.parse(JSON.stringify(conversationHistory));
		// Ganti pesan pengguna terakhir dengan prompt yang sudah diperkaya konteks
		apiHistory[apiHistory.length - 1].content = promptToSend;

		try {
			const response = await fetch(API_URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${TOGETHER_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: MODEL,
					messages: apiHistory,
					temperature: 0.7,
					max_tokens: 512,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error
						? errorData.error.message
						: `HTTP error! status: ${response.status}`
				);
			}

			const data = await response.json();
			const aiMessage = data.choices[0].message.content;

			// Tambahkan respons AI murni ke riwayat dan tampilkan
			conversationHistory.push({ role: 'assistant', content: aiMessage });
			addMessage(aiMessage, false);
		} catch (error) {
			console.error('Error saat memanggil API:', error);
			addMessage(`Maaf, terjadi kesalahan: ${error.message}.`, false);
		} finally {
			typingIndicator.remove();
			sendBtn.disabled = false;
			messageInput.focus();
		}
	}

	/**
	 * Menambahkan pesan ke jendela chat UI
	 * @param {string} text - Teks pesan
	 * @param {boolean} isUser - True jika pesan dari pengguna
	 */
	function addMessage(text, isUser = false) {
		const messageElement = document.createElement('div');
		messageElement.className = 'flex items-start mb-6 message-enter';

		const name = isUser ? 'You' : 'AI Assistant';
		const iconClass = isUser ? 'fas fa-user' : 'fas fa-robot';
		const bgColor = isUser ? 'bg-indigo-500 text-white' : 'bg-white';
		const alignClass = isUser ? 'ml-auto' : '';
		const avatarBg = isUser
			? 'bg-indigo-200 text-white'
			: 'bg-gray-200 text-indigo-600';

		// Proses dengan marked.js untuk respons AI
		const processedText = isUser
			? `<p>${text}</p>`
			: marked.parse(text, { sanitize: true });

		const messageHTML = `
            <div class="${alignClass} flex items-start w-full">
                ${
									!isUser
										? `<div class="${avatarBg} border-2 border-dashed rounded-xl w-8 h-8 flex-shrink-0 flex items-center justify-center"><i class="${iconClass}"></i></div>`
										: ''
								}
                <div class="mx-3 flex-grow">
                    <div class="font-semibold text-gray-700 ${
											isUser ? 'text-right' : ''
										}">${name}</div>
                    <div class="message-content mt-1 ${bgColor} p-3 rounded-lg shadow-sm max-w-[90%] ${
			isUser ? 'ml-auto' : ''
		}">${processedText}</div>
                    <div class="text-xs text-gray-500 mt-1 ${
											isUser ? 'text-right' : ''
										}">Just now</div>
                </div>
                ${
									isUser
										? `<div class="${avatarBg} border-2 border-dashed rounded-xl w-8 h-8 flex-shrink-0 flex items-center justify-center"><i class="${iconClass}"></i></div>`
										: ''
								}
            </div>
        `;

		messageElement.innerHTML = messageHTML;
		chatWindow.appendChild(messageElement);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}

	/**
	 * Menampilkan indikator pengetikan
	 * @returns {HTMLElement} Elemen indikator
	 */
	function showTypingIndicator() {
		const typingElement = document.createElement('div');
		typingElement.id = 'typing-indicator';
		typingElement.className = 'flex items-start mb-4';
		typingElement.innerHTML = `
            <div class="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center text-indigo-600"><i class="fas fa-robot"></i></div>
            <div class="ml-3"><div class="font-semibold text-gray-700">AI Assistant</div><div class="mt-1 bg-white p-3 rounded-lg shadow-sm"><div class="flex items-center space-x-1"><div class="w-2 h-2 bg-gray-400 rounded-full typing-indicator"></div><div class="w-2 h-2 bg-gray-400 rounded-full typing-indicator" style="animation-delay:0.2s"></div><div class="w-2 h-2 bg-gray-400 rounded-full typing-indicator" style="animation-delay:0.4s"></div></div></div></div>`;
		chatWindow.appendChild(typingElement);
		chatWindow.scrollTop = chatWindow.scrollHeight;
		return typingElement;
	}

	// === MULAI APLIKASI ===
	initializeApp();
});
