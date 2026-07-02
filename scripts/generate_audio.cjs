// Audio generation script for ElevenLabs API
// Usage: node scripts/generate_audio.cjs

const fs = require('fs');
const https = require('https');
const path = require('path');

const API_KEY = 'sk_7ef27dccb32144843f8ee5068dfd4223a85326c56c14b00a';
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice voice
const MODEL = 'eleven_multilingual_v2';

const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio');
const AUDIO_MAP_PATH = path.join(__dirname, '../src/utils/audioMap.js');

const phrases = [
  { text: "Welcome to Measuring Capacity! Let's explore litres and millilitres together.", style: "statement", key: "intro_welcome" },
  { text: "Hmm... I wonder something!", style: "question", key: "wonder_hmm" },
  { text: "Emma has a two-litre bottle and a five-hundred-millilitre cup. How many cups can she fill?", style: "question", key: "wonder_question" },
  { text: "What if we could measure any liquid — big or small?", style: "thinking", key: "wonder_hint" },
  { text: "We might need to convert litres and millilitres!", style: "emphasis", key: "wonder_teaser" },
  { text: "Let's investigate!", style: "encouragement", key: "wonder_cta" },
  { text: "Uncle James has a big five-litre jug of fresh lemonade at his stand. He wants to fill cups for all the children waiting in line.", style: "statement", key: "story_slide1" },
  { text: "The jug has a scale on the side. It is marked in litres and millilitres. The liquid level is at five litres — that is the same as five thousand millilitres!", style: "statement", key: "story_slide2" },
  { text: "Each cup holds five hundred millilitres. Uncle James pours one cup — the jug now shows four litres five hundred millilitres. He pours again — now it shows four litres. He keeps pouring!", style: "statement", key: "story_slide3" },
  { text: "Uncle James fills all ten cups! Five litres divided by five hundred millilitres equals ten cups. Now you can measure too!", style: "celebration", key: "story_slide4" },
  { text: "Station A: Pour and Fill. Drag the jug to pour water into the cup!", style: "instruction", key: "sim_a_intro" },
  { text: "Station B: Read the Scale. Look at the measuring cylinder and find the volume!", style: "instruction", key: "sim_b_intro" },
  { text: "Station C: Capacity Slider. Drag the slider and watch what happens when millilitres reach one thousand!", style: "instruction", key: "sim_c_intro" },
  { text: "Watch what happens when the millilitres go past one thousand — they become a whole litre!", style: "emphasis", key: "sim_c_hint" },
  { text: "Station D: Spot the Error. Find the wrong step in the working!", style: "instruction", key: "sim_d_intro" },
  { text: "Explore and discover — there are no wrong answers here!", style: "encouragement", key: "sim_explore" },
  { text: "Choose your world and start playing!", style: "encouragement", key: "play_choose" },
  { text: "Perfectly poured! You measured that just right!", style: "celebration", key: "play_correct" },
  { text: "Not quite — check the scale again!", style: "encouragement", key: "play_incorrect" },
  { text: "Amazing streak! Keep going!", style: "celebration", key: "play_streak" },
  { text: "World complete! You earned stars!", style: "celebration", key: "play_world_complete" },
  { text: "One litre equals one thousand millilitres!", style: "emphasis", key: "play_key_fact" },
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
  { text: "Tell me one thing you learned about litres and millilitres today!", style: "question", key: "reflect_prompt" },
  { text: "Wonderful reflection! You have completed the lesson!", style: "celebration", key: "reflect_complete" },
  { text: "Journey complete! You finished all five phases!", style: "celebration", key: "results_complete" },
  { text: "Great job! Try again to improve your score!", style: "encouragement", key: "results_tryagain" },
  { text: "Outstanding! You are a capacity expert!", style: "celebration", key: "results_outstanding" },
];

console.log(`🎙️  Generating ${phrases.length} audio files via ElevenLabs...`);
console.log(`📁 Output: ${OUTPUT_DIR}\n`);

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const audioMap = {};
let queueIndex = 0;
let completed = 0;

function processNext() {
  if (queueIndex >= phrases.length) return;
  const phrase = phrases[queueIndex++];
  generateAudio(phrase).then(() => {
    completed++;
    console.log(`✅ [${completed}/${phrases.length}] ${phrase.key}`);
    if (completed === phrases.length) {
      writeAudioMap();
    } else {
      setTimeout(processNext, 300);
    }
  });
}

// Start with concurrency of 3
processNext();
setTimeout(processNext, 200);
setTimeout(processNext, 400);

function generateAudio(phrase) {
  return new Promise((resolve) => {
    const filename = `audio_${phrase.key}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);

    audioMap[phrase.text] = `/assets/audio/${filename}`;

    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
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
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`❌ Failed: ${phrase.key} (HTTP ${res.statusCode})`);
        res.resume();
        resolve();
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        fs.writeFileSync(filePath, Buffer.concat(chunks));
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Error for ${phrase.key}: ${e.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

function writeAudioMap() {
  let mapStr = `// Auto-generated audio map — maps narration text to .mp3 file paths\n// Generated by scripts/generate_audio.cjs\n\nconst audioMap = {\n`;
  for (const [text, path] of Object.entries(audioMap)) {
    mapStr += `  ${JSON.stringify(text)}: ${JSON.stringify(path)},\n`;
  }
  mapStr += `};\n\nexport default audioMap;\n`;
  fs.writeFileSync(AUDIO_MAP_PATH, mapStr);
  console.log(`\n📝 Audio map updated: ${AUDIO_MAP_PATH}`);
  console.log(`🎉 Done! ${Object.keys(audioMap).length} entries.`);
}
