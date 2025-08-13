const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  const { temperature, humidity, moisture } = req.body;

  const prompt = `
You are a Smart Plant Agent. Your goal is to provide clear, actionable recommendations for growing Bak Choi based on the provided environmental data.

Current Environmental Readings:
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Soil Moisture: ${moisture}

Provide 5-7 specific recommendations for growing Bak Choi based on these exact readings. Each recommendation should reference the current conditions and be actionable.

Format your response as bullet points starting with "- " for each recommendation. Do not include any introduction or summary, only the recommendations.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });
    const aiResponse = completion.choices[0].message.content;
    
    // Manually prepend the current readings to ensure they're always shown
    const currentReadings = `Based on current readings: Temperature ${temperature}°C, Humidity ${humidity}%, Soil Moisture ${moisture}\n\n`;
    const fullResponse = currentReadings + aiResponse;
    
    console.log('Current readings:', currentReadings);
    console.log('AI Response:', aiResponse);
    console.log('Full Response:', fullResponse);
    
    res.json({ recommendations: fullResponse });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Failed to get recommendations.' });
  }
});

module.exports = router; 