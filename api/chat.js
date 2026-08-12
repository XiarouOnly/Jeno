// Memakai KV Store bawaan Vercel (Upstash Redis)
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Empty' });

    // Ambil data chat lama, tambah chat baru
    const oldChats = (await kv.get('jenobf_messages')) || [];
    const newChat = { user, text, time: Date.now() };
    
    // Simpan maksimal 100 pesan terakhir biar cepat
    const updatedChats = [...oldChats, newChat].slice(-100);
    await kv.set('jenobf_messages', updatedChats);

    return res.status(200).json({ success: true });
  } 
  
  if (req.method === 'GET') {
    const chats = (await kv.get('jenobf_messages')) || [];
    return res.status(200).json(chats);
  }
}
