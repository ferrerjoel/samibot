const OpenAi = require("openai");
require("dotenv").config();

const openai = new OpenAi({
	apiKey: process.env.OPENAI_API_KEY,
});

async function makeRequest() {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [{ role: "user", content: "Say this is a test" }],
			max_tokens: 10,
		});

		console.log(response.data.choices[0]?.message?.content || "");
	} catch (error) {
		console.error('Error:', error);
	}
}

export default makeRequest();