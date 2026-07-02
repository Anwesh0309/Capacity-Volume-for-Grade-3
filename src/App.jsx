import React, { useReducer, useEffect } from 'react';
import { Volume2, VolumeX, Home } from 'lucide-react';
import './App.css';
import IntroScreen from './components/IntroScreen.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PlayPhase from './components/phases/PlayPhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';
import { setAudioEnabled, stopNarration } from './utils/audio.js';
import { generateSessionQuestions } from './utils/shuffle.js';
import questionBank from './data/questionBank.js';

const PHASES = [
  { id: 'wonder',   label: 'Wonder',   icon: '🔮', num: '01' },
  { id: 'story',    label: 'Story',    icon: '📖', num: '02' },
  { id: 'simulate', label: 'Simulate', icon: '🧪', num: '03' },
  { id: 'play',     label: 'Play',     icon: '🎮', num: '04' },
  { id: 'reflect',  label: 'Reflect',  icon: '📝', num: '05' },
];

const initialState = {
  phase: 'intro',
  currentSimStation: 0,
  simStationsComplete: [false, false, false, false],
  questionSet: [],
  currentQuestion: 0,
  currentWorld: 0,
  worldScores: Array(10).fill(null),
  hintsUsed: 0,
  attemptCount: 0,
  hearts: 3,
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  phaseComplete: { wonder: false, story: false, simulate: false, play: false, reflect: false },
  audioEnabled: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'COMPLETE_PHASE': {
      const updated = { ...state.phaseComplete, [action.phase]: true };
      return { ...state, phaseComplete: updated };
    }
    case 'ADVANCE_SIM_STATION':
      return { ...state, currentSimStation: Math.min(3, state.currentSimStation + 1) };
    case 'COMPLETE_SIM_STATION': {
      const updated = [...state.simStationsComplete];
      updated[action.station] = true;
      return { ...state, simStationsComplete: updated };
    }
    case 'LOAD_QUESTIONS':
      return { ...state, questionSet: action.questions, currentQuestion: 0, currentWorld: 0 };
    case 'NEXT_QUESTION':
      return { ...state, currentQuestion: state.currentQuestion + 1, hintsUsed: 0, attemptCount: 0 };
    case 'USE_HINT':
      return { ...state, hintsUsed: state.hintsUsed + 1 };
    case 'ATTEMPT':
      return { ...state, attemptCount: state.attemptCount + 1 };
    case 'ANSWER_CORRECT': {
      const newStreak = state.streak + 1;
      const xpGain = action.xpGain || 10;
      return {
        ...state, streak: newStreak, maxStreak: Math.max(state.maxStreak, newStreak),
        xp: state.xp + xpGain,
      };
    }
    case 'ANSWER_INCORRECT':
      return { ...state, streak: 0 };
    case 'LOSE_HEART':
      return { ...state, hearts: Math.max(0, state.hearts - 1) };
    case 'SET_WORLD_SCORE': {
      const updated = [...state.worldScores];
      updated[action.world] = action.score;
      return { ...state, worldScores: updated };
    }
    case 'RESET_HEARTS':
      return { ...state, hearts: 3, hintsUsed: 0, attemptCount: 0 };
    case 'UNLOCK_BADGE':
      if (state.badges.includes(action.badgeId)) return state;
      return { ...state, badges: [...state.badges, action.badgeId] };
    case 'TOGGLE_AUDIO':
      setAudioEnabled(!state.audioEnabled);
      return { ...state, audioEnabled: !state.audioEnabled };
    case 'RESET_SESSION':
      return { ...initialState, audioEnabled: state.audioEnabled };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const questions = generateSessionQuestions(questionBank);
    dispatch({ type: 'LOAD_QUESTIONS', questions });
  }, []);

  useEffect(() => {
    stopNarration();
  }, [state.phase]);

  const phaseIndex = PHASES.findIndex(p => p.id === state.phase);

  const renderPhase = () => {
    switch (state.phase) {
      case 'intro':
        return <IntroScreen onStart={() => dispatch({ type: 'SET_PHASE', phase: 'wonder' })} />;
      case 'wonder':
        return <WonderPhase
          audioEnabled={state.audioEnabled}
          onComplete={() => { dispatch({ type: 'COMPLETE_PHASE', phase: 'wonder' }); dispatch({ type: 'SET_PHASE', phase: 'story' }); }}
        />;
      case 'story':
        return <StoryPhase
          audioEnabled={state.audioEnabled}
          onComplete={() => { dispatch({ type: 'COMPLETE_PHASE', phase: 'story' }); dispatch({ type: 'SET_PHASE', phase: 'simulate' }); }}
        />;
      case 'simulate':
        return <SimulatePhase
          audioEnabled={state.audioEnabled}
          currentStation={state.currentSimStation}
          stationsComplete={state.simStationsComplete}
          onAdvance={() => dispatch({ type: 'ADVANCE_SIM_STATION' })}
          onComplete={(station) => {
            dispatch({ type: 'COMPLETE_SIM_STATION', station });
            if (state.simStationsComplete.filter(Boolean).length >= 3) {
              dispatch({ type: 'COMPLETE_PHASE', phase: 'simulate' });
            }
          }}
          onFinish={() => { dispatch({ type: 'COMPLETE_PHASE', phase: 'simulate' }); dispatch({ type: 'SET_PHASE', phase: 'play' }); }}
        />;
      case 'play':
        return <PlayPhase
          state={state}
          dispatch={dispatch}
          onComplete={() => { dispatch({ type: 'COMPLETE_PHASE', phase: 'play' }); dispatch({ type: 'SET_PHASE', phase: 'reflect' }); }}
        />;
      case 'reflect':
        return <ReflectPhase
          audioEnabled={state.audioEnabled}
          state={state}
          onComplete={() => { dispatch({ type: 'COMPLETE_PHASE', phase: 'reflect' }); }}
        />;
      default:
        return null;
    }
  };

  return (
    <div id="root">
      <div className="starfield">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
              '--dur': `${Math.random() * 3 + 2}s`,
              '--op': Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {state.phase !== 'intro' && (
        <div className="top-bar">
          <button className="home-btn" onClick={() => dispatch({ type: 'SET_PHASE', phase: 'intro' })}>
            <Home size={16} /> <span>Home</span>
          </button>
          <div className="phase-nav">
            {PHASES.map((p, i) => (
              <React.Fragment key={p.id}>
                {i > 0 && <div className={`phase-connector ${state.phaseComplete[PHASES[i - 1].id] ? 'done' : ''}`} />}
                <div
                  className={`phase-pill ${state.phase === p.id ? 'active' : ''} ${state.phaseComplete[p.id] ? 'completed' : ''}`}
                  onClick={() => state.phaseComplete[p.id] && dispatch({ type: 'SET_PHASE', phase: p.id })}
                >
                  <span className="num">{p.num}</span>
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <button className="audio-btn" onClick={() => dispatch({ type: 'TOGGLE_AUDIO' })}>
            {state.audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      )}

      <div className="phase-area">
        {renderPhase()}
      </div>
    </div>
  );
}

export default App;
