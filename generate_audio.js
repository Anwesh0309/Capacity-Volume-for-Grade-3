import fs from 'fs';
import path from 'path';
import https from 'https';
import { questionBank } from './src/data/questionBank.js';

const AUDIO_DIR = path.join(process.cwd(), 'public', 'assets', 'audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const API_KEY = 'sk_7ef27dccb32144843f8ee5068dfd4223a85326c56c14b00a';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL = 'eleven_multilingual_v2';

function downloadAudio(text, filepath) {
  return new Promise((resolve) => {
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 100) {
      return resolve();
    }

    const cleanText = text
      .replace(/→/g, ' means ')
      .replace(/___/g, ' blank ')
      .replace(/−/g, ' minus ')
      .replace(/-/g, ' minus ')
      .replace(/\+/g, ' plus ')
      .replace(/=/g, ' equals ')
      .replace(/\bml\b/g, ' milliliters ')
      .replace(/\bl\b/g, ' liters ');

    const postData = JSON.stringify({
      text: cleanText,
      model_id: MODEL,
      voice_settings: {
        stability: 0.20,
        similarity_boost: 0.55,
        style: 0.50,
        use_speaker_boost: true,
      },
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${text}: ${res.statusCode}`);
        res.resume();
        return resolve();
      }
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error(`Error downloading ${text}: ${err.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log(`Generating clean audio for ${questionBank.length} questions and their hints...`);
  
  // Wipe old question audios to fix glitches
  const files = fs.readdirSync(AUDIO_DIR);
  for (const file of files) {
    if (file.startsWith('q_') && file.endsWith('.mp3')) {
      fs.unlinkSync(path.join(AUDIO_DIR, file));
    }
  }
  console.log('Old question audio files wiped for clean regeneration.');

  for (const q of questionBank) {
    const filepath = path.join(AUDIO_DIR, `q_${q.id}.mp3`);
    await downloadAudio(q.questionText, filepath);

    if (q.hint1) {
      const h1Path = path.join(AUDIO_DIR, `q_${q.id}_hint1.mp3`);
      await downloadAudio(q.hint1, h1Path);
    }
    if (q.hint2) {
      const h2Path = path.join(AUDIO_DIR, `q_${q.id}_hint2.mp3`);
      await downloadAudio(q.hint2, h2Path);
    }
    process.stdout.write('.');
  }
  console.log('\nDone generating all question and hint audios.');
}
main();
