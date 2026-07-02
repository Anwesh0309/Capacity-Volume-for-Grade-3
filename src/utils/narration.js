import { say, ask, celebrate, think, encourage, emphasize } from './audio.js';

export const introNarration = () => [
  say("Welcome to Measuring Capacity! Let's explore litres and millilitres together."),
];

export const wonderNarration = () => [
  ask("Emma has a two-litre bottle and a five-hundred-millilitre cup. How many cups can she fill?"),
  say("What if we could measure any liquid — big or small?"),
  emphasize("We might need to convert litres and millilitres!"),
];

export const getStoryNarration = (slideIndex) => {
  const narrations = [
    [say("Uncle James has a big five-litre jug of fresh lemonade at his stand. He wants to fill cups for all the children waiting in line.")],
    [say("The jug has a scale on the side. It is marked in litres and millilitres. The liquid level is at five litres — that is the same as five thousand millilitres!")],
    [say("Each cup holds five hundred millilitres. Uncle James pours one cup — the jug now shows four litres five hundred millilitres. He pours again — now it shows four litres. He keeps pouring!")],
    [say("Uncle James fills all ten cups! Five litres divided by five hundred millilitres equals ten cups. Now you can measure too!")],
  ];
  return narrations[slideIndex] || narrations[0];
};

export const simulateStationIntro = (station) => {
  const intros = [
    [say("Station A: Pour and Fill. Drag the jug to pour water into the cup!")],
    [say("Station B: Read the Scale. Look at the measuring cylinder and find the volume!")],
    [say("Station C: Capacity Slider. Drag the slider and watch what happens when millilitres reach one thousand!"), think("Watch what happens when the millilitres go past one thousand — they become a whole litre!")],
    [say("Station D: Spot the Error. Find the wrong step in the working!")],
  ];
  return intros[station] || intros[0];
};

export const playWorldNarration = (worldIndex) => {
  const worlds = [
    [say("World one: Bubble Tea Bar! Answer questions about litres and millilitres.")],
    [say("World two: Lemonade Stand! Let's practise converting units.")],
    [say("World three: Fish Tank Depot! Read scales and compare containers.")],
    [say("World four: Juice Stall! Add compound units without regrouping.")],
    [say("World five: Science Lab! Compound units and conversions.")],
    [say("World six: Swimming Pool! Subtraction with regrouping begins!")],
    [say("World seven: Water Park! Hard regrouping challenges.")],
    [say("World eight: Rainwater Tank! Keep solving hard problems.")],
    [say("World nine: Aquarium World! Mixed multi-step problems.")],
    [say("World ten: Capacity Castle! The ultimate challenge!")],
  ];
  return worlds[worldIndex] || worlds[0];
};

export const correctNarration = () => [
  celebrate("Perfectly poured! You measured that just right!"),
];

export const incorrectNarration = () => [
  encourage("Not quite — check the scale again!"),
];

export const streakNarration = () => [
  celebrate("Amazing streak! Keep going!"),
];

export const reflectQuestionNarration = () => [
  ask("Tell me one thing you learned about litres and millilitres today!"),
];

export const resultsNarration = (pct) => {
  if (pct >= 90) return [celebrate("Outstanding! You are a capacity expert!")];
  if (pct >= 70) return [celebrate("Journey complete! You finished all five phases!")];
  return [encourage("Great job! Try again to improve your score!")];
};
