// File: api/chat.js

export const config = {
	runtime: 'edge',
};

export default async function handler(req) {
	// Only allow POST requests
	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ message: 'Method not allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		// Get the API key from environment variables
		const apiKey = process.env.TOGETHER_API_KEY;
		if (!apiKey) {
			throw new Error('TOGETHER_API_KEY is not set');
		}

		// Get the chat history from the request body
		const { model, messages } = await req.json();

		// Call the Together.ai API
		const response = await fetch(
			'https://api.together.xyz/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model: model,
					messages: messages,
					temperature: 0.7,
					max_tokens: 512,
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			console.error('API Error:', errorData);
			throw new Error(
				errorData.error?.message || 'Failed to fetch from Together.ai'
			);
		}

		const data = await response.json();

		// Send the AI's response back to the frontend
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Serverless function error:', error);
		return new Response(JSON.stringify({ error: { message: error.message } }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
