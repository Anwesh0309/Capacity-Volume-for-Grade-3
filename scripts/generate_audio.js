// Audio generation script for ElevenLabs API
// Usage: node scripts/generate_audio.js

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'sk_7ef27dccb32144843f8ee5068dfd4223a85326c56c14b00a';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice voice
const MODEL = 'eleven_multilingual_v2';

const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio');
const AUDIO_MAP_PATH = path.join(__dirname, '../src/utils/audioMap.js');

const phrases = [
  // Intro
  { text: "Welcome to Measuring Capacity! Let's explore litres and millilitres together.", style: "statement", key: "intro_welcome" },

  // Wonder phase
  { text: "Hmm... I wonder...", style: "question", key: "wonder_hmm" },
  { text: "Emma has a two-litre bottle and a five-hundred-millilitre cup. How many cups can she fill?", style: "question", key: "wonder_question" },
  { text: "What if we need to measure and compare different amounts of liquid?", style: "thinking", key: "wonder_hint" },
  { text: "We have to convert litres and millilitres!", style: "emphasis", key: "wonder_teaser" },
  { text: "Let's investigate!", style: "encouragement", key: "wonder_cta" },

  // Story phase
  { text: "Uncle James has a big five-litre jug of fresh lemonade at his stand. He wants to fill cups for all the children waiting in line.", style: "statement", key: "story_slide1" },
  { text: "The jug has a scale on the side. It is marked in litres and millilitres. The liquid level is at five litres — that is the same as five thousand millilitres!", style: "statement", key: "story_slide2" },
  { text: "Each cup holds five hundred millilitres. Uncle James pours one cup — the jug now shows four litres five hundred millilitres. He pours again — now it shows four litres. He keeps pouring!", style: "statement", key: "story_slide3" },
  { text: "Uncle James fills all ten cups! Five litres divided by five hundred millilitres equals ten cups. Now you can measure too!", style: "celebration", key: "story_slide4" },

  // Simulate phase
  { text: "Station A: Pour and Fill. Drag the jug to pour water into the cup!", style: "instruction", key: "sim_a_intro" },
  { text: "Station B: Read the Scale. Look at the measuring cylinder and find the volume!", style: "instruction", key: "sim_b_intro" },
  { text: "Station C: Capacity Slider. Drag the slider and watch what happens when millilitres reach one thousand!", style: "instruction", key: "sim_c_intro" },
  { text: "Watch what happens when the millilitres go past one thousand — they become a whole litre!", style: "emphasis", key: "sim_c_hint" },
  { text: "Station D: Spot the Error. Find the wrong step in the working!", style: "instruction", key: "sim_d_intro" },
  { text: "Explore and discover — there are no wrong answers here!", style: "encouragement", key: "sim_explore" },

  // Play phase
  { text: "Choose your world and start playing!", style: "encouragement", key: "play_choose" },
  { text: "That's Correct keep going", style: "celebration", key: "pop_correct" },
  { text: "Not Quite lets try again", style: "encouragement", key: "pop_incorrect" },
  { text: "Perfectly poured! You measured that just right!", style: "celebration", key: "play_correct" },
  { text: "Not quite — check the scale again!", style: "encouragement", key: "play_incorrect" },
  { text: "Amazing streak! Keep going!", style: "celebration", key: "play_streak" },
  { text: "World complete! You earned stars!", style: "celebration", key: "play_world_complete" },
  { text: "One litre equals one thousand millilitres!", style: "emphasis", key: "play_key_fact" },

  // World narrations
  { text: "World one: Bubble Tea Bar! Answer questions about litres and millilitres.", style: "statement", key: "world_1" },
  { text: "World two: Lemonade Stand! Let's practise converting units.", style: "statement", key: "world_2" },
  { text: "World three: Fish Tank Depot! Read scales and compare containers.", style: "statement", key: "world_3" },
  { text: "World four: Juice Stall! Add compound units without regrouping.", style: "statement", key: "world_4" },
  { text: "World five: Science Lab! Compound units and conversions.", style: "statement", key: "world_5" },
  { text: "World six: Swimming Pool! Subtraction with regrouping begins!", style: "statement", key: "world_6" },
  { text: "World seven: Water Park! Hard regrouping challenges.", style: "statement", key: "world_7" },
  { text: "World eight: Rainwater Tank! Keep solving hard problems.", style: "statement", key: "world_8" },
  { text: "World nine: Aquarium World! Mixed multi-step problems.", style: "statement", key: "world_9" },
  { text: "World ten: Capacity Castle! The ultimate challenge!", style: "statement", key: "world_10" },

  // Reflect phase
  { text: "Tell me one thing you learned about litres and millilitres today!", style: "question", key: "reflect_prompt" },
  { text: "Wonderful reflection! You have completed the lesson!", style: "celebration", key: "reflect_complete" },

  // Results
  { text: "Journey complete! You finished all five phases!", style: "celebration", key: "results_complete" },
  { text: "Great job! Try again to improve your score!", style: "encouragement", key: "results_tryagain" },
  { text: "Outstanding! You are a capacity expert!", style: "celebration", key: "results_outstanding" },
];

console.log(`🎙️  Generating ${phrases.length} audio files...`);
console.log(`📁 Output: ${OUTPUT_DIR}\n`);

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Wipe specific wonder phase old files
['wonder_hmm', 'wonder_hint', 'wonder_teaser'].forEach(key => {
  const p = path.join(OUTPUT_DIR, `audio_${key}.mp3`);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

const audioMap = {};
let completed = 0;

phrases.forEach((phrase, i) => {
  setTimeout(() => {
    generateAudio(phrase).then(() => {
      completed++;
      if (completed === phrases.length) {
        writeAudioMap();
      }
    });
  }, i * 500); // Stagger requests
});

function generateAudio(phrase) {
  return new Promise((resolve) => {
    const filename = `audio_${phrase.key}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);

    // Check if already exists
    if (fs.existsSync(filePath)) {
      console.log(`✅ [${completed + 1}/${phrases.length}] ${filename} (exists)`);
      audioMap[phrase.text] = `/assets/audio/${filename}`;
      resolve();
      return;
    }

    const postData = JSON.stringify({
      text: phrase.text,
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
        console.error(`❌ Failed: ${phrase.key} (${res.statusCode})`);
        res.resume();
        resolve();
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(filePath, buffer);
        audioMap[phrase.text] = `/assets/audio/${filename}`;
        console.log(`✅ [${completed + 1}/${phrases.length}] ${filename}`);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Error: ${phrase.key}`, e.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

function writeAudioMap() {
  const mapContent = `// Auto-generated audio map — maps narration text to .mp3 file paths\n// Generated by scripts/generate_audio.js\n\nconst audioMap = ${JSON.stringify(audioMap, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync(AUDIO_MAP_PATH, mapContent);
  console.log(`\n✅ Audio map written to ${AUDIO_MAP_PATH}`);
  console.log(`✅ All ${phrases.length} audio files generated!`);
}
