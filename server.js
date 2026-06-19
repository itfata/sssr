const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/lead', async (req, res) => {
  const { name = '', phone = '', service = '', message = '' } = req.body || {};

  if (!phone.trim()) {
    return res.status(400).json({ ok: false, error: 'Phone is required' });
  }

  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Telegram is not configured' });
  }

  const text = [
    'Нова заявка з сайту Radio SSSR',
    '',
    `Категорія: ${service || 'Не вказано'}`,
    `Ім'я: ${name || 'Не вказано'}`,
    `Телефон: ${phone}`,
    `Коментар: ${message || 'Без коментаря'}`,
    '',
    `Дата: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`,
  ].join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error(`Telegram error: ${telegramResponse.status}`);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Could not send lead' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Radio SSSR site is running on port ${PORT}`);
});
