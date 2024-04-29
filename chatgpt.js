const openai = require("openai");
require("dotenv").config();

const openaiInstance = new openai({
	apiKey: process.env.OPENAI_API_KEY,
});

async function makeRequestLogic(userMessage, max_tokens) {
  try {
    const response = await openaiInstance.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [     {
        "role": "system",
        "content": "You are named Samuee, you are from seville, respond in Spanish, tipical andalusian words, don't swear."
      },
	  { role: "user", 
	  	content: userMessage 
	  }
	],
	  max_tokens: max_tokens,
    });

    return response['choices'][0]['message']['content'] || "";
  } catch (error) {
    console.error('Error:', error);
    return "Parece que algo ha ido mal :(";
  }
}

async function makeRequest(userMessage) {
	try {
	  const result = await makeRequestLogic(userMessage);
	  return result;
	} catch (error) {
	  console.error('Error:', error);
	}
  }

module.exports = makeRequest;
