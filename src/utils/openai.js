// src/utils/cohere.js
import axios from "axios";

export const generateBlogIdeas = async (topic) => {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    console.warn("Cohere API key is missing or invalid");
    return getFallbackIdeas(topic);
  }

  const prompt = `Generate 5 unique and engaging blog post ideas about: ${topic}`;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command", // Use faster lightweight models when possible
        prompt: `Generate 10 blog post ideas about ${topic}.`,
        max_tokens: 150, // Request only what you need
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        }
      }
    );

    const text = response.data.generations[0].text;
    return text.split("\n").filter((line) => line.trim() !== "");
  } catch (err) {
    console.error("Cohere API error:", err);
    return {
      error: true,
      message: "Couldn't connect to Cohere. Here are some fallback ideas.",
      ideas: getFallbackIdeas(topic),
    };
  }
};

const getFallbackIdeas = (topic) => [
  `The Future of ${topic} in a Digital World`,
  `Top 5 Myths About ${topic}`,
  `How to Get Started with ${topic}`,
  `The Impact of ${topic} on Everyday Life`,
  `${topic} Trends You Should Know About`,
];
