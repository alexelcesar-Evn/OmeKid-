import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // OmeKid continues working normally if service workers are unavailable.
    });
  });
}

const colors = {
  mint: '#8DD7A2',
  mintLight: '#DDF2E4',
  mintDark: '#4E8F54',
  sky: '#8BB6F1',
  skyLight: '#E7F0FF',
  lavender: '#B99BEA',
  lavLight: '#F0E8FF',
  peach: '#F0B16F',
  peachLight: '#FFF0DE',
  sunYellow: '#F3C451',
  sunLight: '#FFF7D8',
  cream: '#F9F2E8',
  cardBg: 'rgba(255,255,255,0.86)',
  navy: '#07183B',
  navy2: '#0D2456',
  ink: '#071738',
  text: '#122140',
  textMuted: '#718097',
  textSoft: '#A9B3C3'
};

const STORAGE_KEY = 'omekid-vandam-en-v1';
const WEEKLY_TARGET = 10;
const DEFAULT_GOAL_LIMIT = 3;
const GOAL_LIMIT_OPTIONS = [3, 5, 7];
const GANG_IMAGE = '/omekid-gang.png';
const PROGRESS_GANG_IMAGE = '/omekid-progress-gang.png';
const LANDING_GANG_IMAGE = '/omekid-landing-futuristic.png';
const APP_PAGE_BACKGROUND = 'linear-gradient(90deg, #FFFFFF 0%, #FFFCF7 38%, #EDF5FF 64%, #D5E7FF 100%)';
const BLUE_GLASS_BACKGROUND = 'linear-gradient(145deg, rgba(84,190,255,0.96) 0%, rgba(18,111,225,0.98) 48%, rgba(5,48,137,1) 100%)';
const BLUE_GLASS_SHADOW = '0 14px 28px rgba(20,104,225,0.34), 0 4px 0 rgba(4,43,126,0.68), inset 0 2px 0 rgba(255,255,255,0.64), inset 0 -7px 16px rgba(3,43,125,0.3)';

const goalOptions = [
  { id: 'morning-routine', emoji: '☀️', label: 'Rutina de la mañana', color: colors.sunYellow, bg: colors.sunLight },
  { id: 'bath-no-fight', emoji: '🛁', label: 'Bañarse sin pelear', color: colors.sky, bg: colors.skyLight + '80' },
  { id: 'pick-up-toys', emoji: '🧸', label: 'Recoger juguetes', color: colors.lavender, bg: colors.lavLight + '80' },
  { id: 'calm-voice', emoji: '🗣️', label: 'Usar voz tranquila', color: colors.mintDark, bg: colors.mintLight + '80' },
  { id: 'homework', emoji: '✏️', label: 'Hacer tarea', color: colors.peach, bg: colors.peachLight + '80' },
  { id: 'brush-teeth', emoji: '🪥', label: 'Cepillarse dientes', color: colors.sky, bg: colors.skyLight + '80' },
  { id: 'school-ready', emoji: '🎒', label: 'Prepararse para la escuela', color: colors.sunYellow, bg: colors.sunLight },
  { id: 'help-at-home', emoji: '🏡', label: 'Ayudar en casa', color: colors.mintDark, bg: colors.mintLight + '80' }
];

const rewardOptions = [
  { id: 'movie', emoji: '🎬', label: 'Escoger película', desc: 'Una noche de película en familia' },
  { id: 'park', emoji: '🌳', label: 'Ir al parque', desc: 'Tiempo juntos al aire libre' },
  { id: 'game-time', emoji: '🎮', label: 'Tiempo extra de videojuego', desc: 'Un poquito extra el sábado' },
  { id: 'friday-food', emoji: '🍕', label: 'Elegir comida del viernes', desc: 'Algo especial en familia' },
  { id: 'campout', emoji: '⛺', label: 'Noche de campamento', desc: 'Cobijas, cuentos y palomitas' }
];

const supportOptions = [
  { id: 'help', emoji: '❤️', label: 'Necesitó ayuda', desc: 'Quiso hacerlo, pero necesitó compañía', color: colors.sky },
  { id: 'calm', emoji: '☁️', label: 'Necesitó calma', desc: 'Primero tranquilidad, después seguimos', color: colors.lavender },
  { id: 'repair', emoji: '🧩', label: 'Necesitó arreglar algo', desc: 'Resolver lo ocurrido con cariño', color: colors.mintDark }
];

const supportActionOptions = {
  help: [
    { id: 'first-step', emoji: '👣', label: 'Ayudar con el primer paso pequeño' },
    { id: 'two-choices', emoji: '✌️', label: 'Ofrecer dos opciones simples' },
    { id: 'model-it', emoji: '🤝', label: 'Hacerlo juntos una vez' },
    { id: 'praise-effort', emoji: '🌟', label: 'Celebrar que lo intentó con ayuda' }
  ],
  calm: [
    { id: 'pause-together', emoji: '🌬️', label: 'Tomar una pausa juntos' },
    { id: 'few-words', emoji: '🤫', label: 'Usar pocas palabras por un momento' },
    { id: 'quiet-place', emoji: '☁️', label: 'Ir a un lugar tranquilo' },
    { id: 'smaller-goal', emoji: '🌿', label: 'Intentar una versión más pequeña de la meta' }
  ],
  repair: [
    { id: 'fix-it', emoji: '🧺', label: 'Ayudar a arreglarlo' },
    { id: 'calm-repeat', emoji: '🗣️', label: 'Intentarlo otra vez con calma' },
    { id: 'kind-words', emoji: '💛', label: 'Usar palabras amables' },
    { id: 'make-better', emoji: '🤝', label: 'Preguntar: “¿Qué podemos hacer para mejorarlo?”' }
  ]
};

const adultCalmActions = [
  {
    id: 'adult-safe',
    emoji: '🛡️',
    label: 'Primero, asegurar el momento',
    help: 'Confirma que todos estén seguros. Si hace falta, separa con calma y retira objetos que puedan lastimar.'
  },
  {
    id: 'adult-pause',
    emoji: '✋',
    label: 'Hacer una pausa de 10 segundos',
    help: 'No tienes que responder inmediatamente. Regálate diez segundos antes de decidir qué decir.'
  },
  {
    id: 'adult-breathe',
    emoji: '🌬️',
    label: 'Respirar lentamente 3 veces',
    help: 'Sigue una respiración guiada breve para bajar la intensidad del momento.'
  },
  {
    id: 'adult-no-argument',
    emoji: '🤍',
    label: 'No entrar en la discusión',
    help: 'Si tu hija responde molesta, intenta no responder al tono. Baja tu voz y di: “No voy a discutir. Hablamos cuando estemos tranquilas.” Pueden resolver lo ocurrido después.'
  },
  {
    id: 'adult-step-away',
    emoji: '🚪',
    label: 'Tomar distancia si es seguro',
    help: 'Puedes decir: “Necesito un momento. Regreso pronto.”'
  }
];

const adultCalmIdeas = [
  {
    emoji: '✌️',
    title: 'Ofrecer dos opciones simples',
    text: 'Prueba: “¿Quieres recoger primero los juguetes o los libros?”'
  },
  {
    emoji: '🔁',
    title: 'Repetir la indicación una sola vez',
    text: 'Dila con pocas palabras y después dale un momento para responder.'
  },
  {
    emoji: '⏳',
    title: 'Hablar del tema más tarde',
    text: 'Puedes decir: “Esto importa, pero lo hablaremos cuando estemos más tranquilos.”'
  },
  {
    emoji: '🤝',
    title: 'Pedir apoyo a otro adulto',
    text: 'Si hay alguien disponible, pedir relevo también es cuidar a la familia.'
  },
  {
    emoji: '🌿',
    title: 'Hacer la petición más pequeña',
    text: 'En lugar de pedir todo, comienza con un solo paso fácil de entender.'
  },
  {
    emoji: '💛',
    title: 'No necesito ganar esta discusión',
    text: 'Tu meta ahora puede ser bajar la intensidad. El límite puede explicarse después.'
  },
  {
    emoji: '🥤',
    title: 'Cambiar brevemente de ambiente',
    text: 'Si todos están seguros, tomar agua o caminar unos pasos puede ayudar a reiniciar.'
  },
  {
    emoji: '👂',
    title: 'Nombrar lo que escuchaste',
    text: 'Prueba: “Veo que esto te molestó.” Escuchar no significa cambiar el límite.'
  }
];

const supportStepCopy = {
  help: 'Elige una forma de hacer la meta más fácil. Si tu hijo lo intenta con ayuda, puedes celebrar ese esfuerzo.',
  calm: 'Elige primero un paso para recuperar la calma. Después pueden decidir si continúan o lo intentan más tarde.',
  repair: 'Elige una forma sencilla de arreglar lo ocurrido y volver a conectar.'
};

const avatarOptions = [
  { id: 'omi', name: 'Omi', role: 'El líder tranquilo', icon: '🌿', image: '/avatars/omi.png', color: colors.mintLight },
  { id: 'luna', name: 'Luna', role: 'La pensadora', icon: '🌙', image: '/avatars/luna.png', color: colors.skyLight },
  { id: 'bruno', name: 'Bruno', role: 'El protector', icon: '🐾', image: '/avatars/bruno.png', color: colors.peachLight },
  { id: 'leo', name: 'Dante', role: 'El valiente', icon: '☀️', image: '/avatars/dante.png', color: colors.sunLight },
  { id: 'tiko', name: 'Tiko', role: 'El explorador', icon: '🧭', image: '/avatars/tiko.png', color: colors.peachLight },
  { id: 'koa', name: 'Puka', role: 'El relajado', icon: '🍃', image: '/avatars/puka.png', color: colors.skyLight },
  { id: 'mochi', name: 'Emi', role: 'La creativa', icon: '⭐', image: '/avatars/emi.png', color: colors.lavLight },
  { id: 'buddy', name: 'Yako', role: 'El más energético', icon: '⭐', image: '/avatars/yako.png', color: colors.sunLight }
];

const defaultData = {
  childName: 'Mateo',
  childAge: '7',
  avatar: 'omi',
  goalLimit: DEFAULT_GOAL_LIMIT,
  activeGoals: goalOptions.slice(0, DEFAULT_GOAL_LIMIT),
  weeklyReward: rewardOptions[0].label,
  customGoals: [],
  customRewards: [],
  stamps: [],
  supportLogs: [],
  notes: [],
  weekStartDate: getWeekStartKey(new Date())
};

const styles = {
  phoneFrame: {
    width: 'min(390px, 100vw)',
    minHeight: 'min(844px, 100vh)',
    height: 'min(844px, 100vh)',
    background: APP_PAGE_BACKGROUND,
    borderRadius: 'clamp(0px, 8vw, 48px)',
    overflow: 'hidden',
    boxShadow: '0 42px 110px rgba(4,10,30,0.34), 0 0 0 10px #06112A, 0 0 0 12px rgba(255,255,255,0.18)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Nunito', 'Quicksand', sans-serif"
  },
  statusBar: {
    height: 44,
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    flexShrink: 0
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'none'
  },
  navBar: {
    height: 80,
    background: 'rgba(255,250,244,0.92)',
    borderTop: '1px solid rgba(14,31,71,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '0 12px 12px',
    flexShrink: 0,
    boxShadow: '0 -10px 32px rgba(14,31,71,0.08)',
    backdropFilter: 'blur(18px)'
  },
  card: {
    background: colors.cardBg,
    borderRadius: 22,
    padding: '20px 24px',
    boxShadow: '0 16px 38px rgba(14,31,71,0.09)',
    border: '1px solid rgba(255,255,255,0.72)',
    marginBottom: 16
  },
  sealBtn: {
    background: BLUE_GLASS_BACKGROUND,
    borderRadius: 32,
    padding: '22px 24px',
    color: '#fff',
    fontWeight: 900,
    fontSize: 20,
    border: '1px solid rgba(190,235,255,0.94)',
    cursor: 'pointer',
    boxShadow: '0 18px 34px rgba(20,104,225,0.38), 0 5px 0 rgba(4,43,126,0.72), inset 0 2px 0 rgba(255,255,255,0.68), inset 0 -8px 18px rgba(3,43,125,0.34)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    letterSpacing: 0.2,
    transform: 'translateY(0)'
  }
};

function App() {
  const [data, setData] = useStoredData();
  const [screen, setScreenState] = useState(() => getScreenFromHash() || 'landing');
  const [registerIntent, setRegisterIntent] = useState('');
  const [celebration, setCelebration] = useState('');
  const registerStampLocks = useRef(new Set());

  const weekStamps = useMemo(() => currentWeekItems(data.stamps), [data.stamps]);
  const weekSupport = useMemo(() => currentWeekItems(data.supportLogs), [data.supportLogs]);

  useEffect(() => {
    const initialScreen = getScreenFromHash();
    if (initialScreen && initialScreen !== 'landing' && !window.history.state?.omeKidScreen) {
      window.history.replaceState({ omeKidScreen: 'landing' }, '', '#landing');
      window.history.pushState({ omeKidScreen: initialScreen }, '', `#${initialScreen}`);
    }

    function handlePopState() {
      setScreenState(getScreenFromHash() || 'landing');
    }

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  function setScreen(nextScreen, options = {}) {
    setScreenState(nextScreen);
    setRegisterIntent(nextScreen === 'register' ? options.registerIntent || '' : '');
    const nextHash = `#${nextScreen}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState({ omeKidScreen: nextScreen }, '', nextHash);
    }
  }

  function updateData(nextData) {
    const goalLimit = getGoalLimit(nextData.goalLimit);
    setData({ ...nextData, goalLimit, activeGoals: nextData.activeGoals.slice(0, goalLimit) });
  }

  function showCelebration(message, duration = 1800) {
    setCelebration(message);
    window.setTimeout(() => setCelebration(''), duration);
  }

  function addStamp(goal, source = 'default') {
    if (source === 'register') {
      if (registerStampLocks.current.has(goal.id)) return false;
      registerStampLocks.current.add(goal.id);
    }
    const stamp = {
      id: crypto.randomUUID(),
      goalId: goal.id,
      goalLabel: goal.label,
      source,
      createdAt: new Date().toISOString()
    };
    updateData({ ...data, stamps: [stamp, ...data.stamps] });
    showCelebration('Huella guardada. Celebramos lo que sí pasó.');
    return true;
  }

  function addSupport(log) {
    setData((currentData) => ({
      ...currentData,
      supportLogs: [
        { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...log },
        ...(Array.isArray(currentData.supportLogs) ? currentData.supportLogs : [])
      ]
    }));
    showCelebration('Momento guardado. Las huellitas se quedan intactas.', 2800);
  }

  function addNote(text) {
    const cleanText = text.trim();
    if (!cleanText) return;
    updateData({
      ...data,
      notes: [{ id: crypto.randomUUID(), text: cleanText, createdAt: new Date().toISOString() }, ...data.notes]
    });
    showCelebration('Observación guardada para la semana.');
  }

  function undoRecentStamps() {
    if (!data.stamps.length) return;
    const confirmed = window.confirm('¿Quitar 1 huellita reciente? Usa esto solo si se agregó por error.');
    if (!confirmed) return;
    updateData({ ...data, stamps: data.stamps.slice(1) });
    showCelebration('1 huellita quitada por error.');
  }

  function updateGoals(goals) {
    updateData({ ...data, activeGoals: goals.slice(0, data.goalLimit) });
  }

  function addCustomGoal(label) {
    const cleanLabel = label.trim();
    if (!cleanLabel) return;
    const existingGoals = [...goalOptions, ...(data.customGoals || [])];
    if (existingGoals.some((goal) => goal.label.toLowerCase() === cleanLabel.toLowerCase())) return;

    const customGoal = {
      id: `custom-goal-${crypto.randomUUID()}`,
      emoji: '✨',
      label: cleanLabel,
      color: colors.mintDark,
      bg: colors.mintLight + '80',
      custom: true
    };
    const nextActiveGoals = data.activeGoals.length < data.goalLimit
      ? [...data.activeGoals, customGoal]
      : data.activeGoals;
    updateData({
      ...data,
      customGoals: [...(data.customGoals || []), customGoal],
      activeGoals: nextActiveGoals
    });
  }

  function deleteCustomGoal(goalId) {
    updateData({
      ...data,
      customGoals: (data.customGoals || []).filter((goal) => goal.id !== goalId),
      activeGoals: data.activeGoals.filter((goal) => goal.id !== goalId)
    });
  }

  function updateGoalLimit(goalLimit) {
    const nextLimit = getGoalLimit(goalLimit);
    updateData({ ...data, goalLimit: nextLimit, activeGoals: data.activeGoals.slice(0, nextLimit) });
  }

  function updateReward(reward, customReward = null) {
    const nextCustomRewards = customReward && !data.customRewards.some((item) => item.label === customReward.label)
      ? [...data.customRewards, customReward]
      : data.customRewards;
    updateData({ ...data, weeklyReward: reward, customRewards: nextCustomRewards });
  }

  function deleteCustomReward(rewardId) {
    const rewardToDelete = (data.customRewards || []).find((item) => item.id === rewardId);
    const nextCustomRewards = (data.customRewards || []).filter((item) => item.id !== rewardId);
    const nextWeeklyReward = rewardToDelete?.label === data.weeklyReward
      ? rewardOptions[0].label
      : data.weeklyReward;
    updateData({ ...data, customRewards: nextCustomRewards, weeklyReward: nextWeeklyReward });
  }

  function updateProfile(profile) {
    updateData({ ...data, ...profile });
  }

  const screenProps = {
    data,
    weekStamps,
    weekSupport,
    addStamp,
    addSupport,
    addNote,
    updateGoals,
    addCustomGoal,
    deleteCustomGoal,
    updateGoalLimit,
    updateReward,
    deleteCustomReward,
    updateProfile,
    undoRecentStamps,
    setScreen,
    registerIntent
  };

  if (screen === 'landing') {
    return <LandingScreen onStart={() => setScreen('home')} />;
  }

  const Screen = {
    home: HomeScreen,
    register: RegisterScreen,
    adultSupport: AdultSupportScreen,
    rewards: RewardsScreen,
    summary: SummaryScreen,
    settings: SettingsScreen
  }[screen];

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 18% 16%, rgba(255,246,222,0.9) 0 18%, transparent 36%),
        radial-gradient(circle at 82% 10%, rgba(137,177,241,0.5) 0 18%, transparent 42%),
        linear-gradient(135deg, #F7EFE3 0%, #EAF3FF 44%, #07183B 100%)
      `,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'Nunito', 'Quicksand', -apple-system, sans-serif"
    }}>
      <BlueLogoFilter />
      <div style={styles.phoneFrame}>
        <StatusBar onLogoClick={() => setScreen('landing')} />
        <div key={screen} style={styles.scrollContent}>
          <Screen {...screenProps} />
        </div>
        <NavBar active={screen === 'adultSupport' ? 'settings' : screen} onChange={setScreen} />
        {celebration && <Celebration message={celebration} />}
      </div>
      <div style={{ marginTop: 22, fontSize: 12, color: 'rgba(7,24,59,0.52)', textAlign: 'center', fontWeight: 800 }}>
        OmeKid · Hábitos positivos para niños y familias
      </div>
    </div>
  );
}

function BlueLogoFilter() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter id="omekid-blue-logo-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="hueRotate"
            values="150"
            result="blueVersion"
          />
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              1.4 1 -2.4 0 -0.38
            "
            result="yellowMask"
          />
          <feComposite in="blueVersion" in2="yellowMask" operator="in" result="blueDetails" />
          <feComposite in="blueDetails" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

function LandingScreen({ onStart }) {
  return (
    <main style={{
      minHeight: '100vh',
      background: `
        linear-gradient(90deg, rgba(249,242,232,0.97) 0%, rgba(249,242,232,0.9) 29%, rgba(249,242,232,0.28) 53%, rgba(7,24,59,0.08) 100%),
        url("${LANDING_GANG_IMAGE}")
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      display: 'flex',
      alignItems: 'center',
      padding: 'min(7vw, 72px)',
      color: colors.text,
      position: 'relative'
    }}>
      <BlueLogoFilter />
      <section style={{
        width: 'min(100%, 460px)',
        textAlign: 'left'
      }}>
        <img
          src="/omekid-logo-emblem.png"
          alt="OmeKid · Cada elección cuenta"
          style={{
            display: 'block',
            width: 'min(54vw, 235px)',
            height: 'auto',
            position: 'absolute',
            top: 'clamp(16px, 4vh, 38px)',
            left: 'clamp(12px, 3vw, 38px)',
            margin: 0,
            mixBlendMode: 'darken',
            clipPath: 'polygon(7% 19%, 31% 19%, 35% 13%, 66% 13%, 70% 6%, 83% 6%, 87% 14%, 94% 14%, 97% 25%, 97% 71%, 93% 78%, 90% 89%, 15% 89%, 12% 80%, 8% 76%)',
            filter: 'url(#omekid-blue-logo-filter) drop-shadow(0 12px 24px rgba(7,24,59,0.18))'
          }}
        />
        <p className="landing-tagline" style={{
          margin: '70px 0 0',
          maxWidth: 360,
          fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
          lineHeight: 1.08,
          color: colors.ink,
          fontWeight: 950
        }}>
          <span className="landing-tagline-blue">Pequeños pasos.</span><br />
          <span className="landing-tagline-deep">Grandes logros.</span>
        </p>
        <p style={{
          margin: '20px 0 0',
          maxWidth: 310,
          fontSize: '1rem',
          lineHeight: 1.65,
          color: colors.ink,
          fontWeight: 800
        }}>
          Ayudando a niños y familias a construir un futuro con amor, paciencia y victorias diarias.
        </p>
        <button type="button" className="blue-glass-action" onClick={onStart} style={{
          marginTop: 30,
          minHeight: 56,
          padding: '0 34px',
          border: '1px solid rgba(190,235,255,0.94)',
          borderRadius: 999,
          background: BLUE_GLASS_BACKGROUND,
          color: '#fff',
          fontSize: 16,
          fontWeight: 900,
          boxShadow: '0 16px 32px rgba(20,104,225,0.4), 0 5px 0 rgba(4,43,126,0.72), inset 0 2px 0 rgba(255,255,255,0.68), inset 0 -8px 18px rgba(3,43,125,0.34)',
          cursor: 'pointer'
        }}>
          Entrar a OmeKid
        </button>
      </section>
    </main>
  );
}

function HomeScreen({ data, weekStamps, addStamp, setScreen }) {
  const progress = Math.min(100, (weekStamps.length / WEEKLY_TARGET) * 100);
  const [selectedGoalId, setSelectedGoalId] = useState(data.activeGoals[0]?.id || goalOptions[0].id);
  const [stampFeedback, setStampFeedback] = useState(false);
  const stampFeedbackTimer = useRef(null);
  const selectedGoal = data.activeGoals.find((goal) => goal.id === selectedGoalId) || data.activeGoals[0] || goalOptions[0];

  useEffect(() => () => window.clearTimeout(stampFeedbackTimer.current), []);

  function addHomeStamp() {
    if (stampFeedback) return;
    addStamp(selectedGoal);
    setStampFeedback(true);
    window.clearTimeout(stampFeedbackTimer.current);
    stampFeedbackTimer.current = window.setTimeout(() => setStampFeedback(false), 1500);
  }

  return (
    <div style={{
      padding: '0 18px 24px',
      color: colors.text,
      minHeight: 'calc(844px - 124px)',
      background: APP_PAGE_BACKGROUND
    }}>
      <div style={{
        background: `
          radial-gradient(circle at 78% 26%, rgba(102,188,126,0.24), transparent 30%),
          radial-gradient(circle at 24% 80%, rgba(139,182,241,0.2), transparent 34%),
          linear-gradient(160deg, #07183B 0%, #0D2456 62%, #102E69 100%)
        `,
        margin: '0 -18px 0',
        padding: '8px 18px 24px',
        borderRadius: '0 0 34px 34px',
        marginBottom: 18,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.72)' }}>¿Cómo estuvo tu día?</div>
            <div style={{ fontSize: 25, fontWeight: 950, color: '#fff', lineHeight: 1.2 }}>¡Hola, {data.childName}! 👋</div>
          </div>
          <Avatar emoji={data.avatar} />
        </div>

        <div style={{
          borderRadius: 24,
          padding: 16,
          minHeight: 190,
          background: `
            linear-gradient(90deg, rgba(7,24,59,0.58) 0%, rgba(7,24,59,0.12) 58%, rgba(7,24,59,0.18) 100%),
            linear-gradient(180deg, transparent 55%, rgba(7,24,59,0.48) 100%),
            url("${PROGRESS_GANG_IMAGE}")
          `,
          backgroundSize: 'auto 138%',
          backgroundPosition: 'center 25%',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24), 0 24px 48px rgba(0,0,0,0.16)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 900 }}>Tu viaje de crecimiento</div>
            <div style={{ fontSize: 28, color: '#fff', fontWeight: 950, lineHeight: 1.05, marginTop: 4 }}>
              {weekStamps.length} / 10 huellitas
            </div>
          </div>
          <div style={{ padding: '8px 4px 2px' }}>
            <WeekDots count={weekStamps.length} />
          </div>
        </div>
      </div>

      <div style={sectionLabel}>Metas de hoy ({data.activeGoals.length} de {data.goalLimit})</div>
      {data.activeGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          count={goalStampCount(goal, weekStamps)}
          selected={selectedGoal.id === goal.id}
          onClick={() => setSelectedGoalId(goal.id)}
        />
      ))}

      <div style={{
        color: colors.textMuted,
        fontSize: 11,
        fontWeight: 900,
        textAlign: 'center',
        margin: '2px 0 12px'
      }}>
        Toca una meta para seleccionarla
      </div>

      <button
        className={`stamp-action blue-glass-action${stampFeedback ? ' stamp-action-success' : ''}`}
        style={styles.sealBtn}
        onClick={addHomeStamp}
        disabled={stampFeedback}
        type="button"
      >
        <span style={{ fontSize: 24 }}>{stampFeedback ? '✓' : '+'}</span>
        <span>{stampFeedback ? '¡Huellita ganada!' : 'Ganó una huellita'}</span>
        <span style={{ fontSize: 26 }}>{stampFeedback ? '✨' : '🐾'}</span>
      </button>
      <div style={{ textAlign: 'center', color: colors.mintDark, fontSize: 12, fontWeight: 900, margin: '10px 0 4px' }}>
        {stampFeedback ? `${selectedGoal.label} sigue avanzando.` : 'Así sucede el progreso.'}
      </div>
      <button type="button" onClick={() => setScreen('settings')} style={{
        width: '100%',
        border: 'none',
        background: 'transparent',
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: 900,
        padding: '6px 0 2px',
        cursor: 'pointer'
      }}>
        ¿Te equivocaste? Corregir huellitas en Ajustes
      </button>

      <div style={{
        ...styles.card,
        marginTop: 16,
        background: `linear-gradient(135deg, rgba(240,232,255,0.92), rgba(231,240,255,0.92))`,
        border: `1px solid rgba(185,155,234,0.32)`,
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }}>
        <div style={{ fontSize: 32 }}>🎁</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted }}>Premio de la semana</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: colors.text }}>{data.weeklyReward}</div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>{weekStamps.length} de 10 huellitas</div>
        </div>
        <div style={{ marginLeft: 'auto', width: 88 }}>
          <ProgressBar pct={progress} color={colors.lavender} height={8} />
          <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, textAlign: 'right' }}>Las huellitas se quedan</div>
        </div>
      </div>

      <button onClick={() => setScreen('register', { registerIntent: 'support' })} type="button" style={{
        width: '100%',
        marginTop: 2,
        background: `linear-gradient(135deg, ${colors.lavLight}, #fff)`,
        border: '1px solid rgba(185,155,234,0.34)',
        borderRadius: 22,
        padding: 15,
        color: '#7250CB',
        fontWeight: 900,
        fontSize: 15
      }}>¿Aún no lo logra? Elegir ayuda extra</button>
    </div>
  );
}

function RegisterScreen({ data, weekStamps, addSupport, registerIntent, setScreen }) {
  const [goal, setGoal] = useState(null);
  const [result, setResult] = useState('support');
  const [selectedSupport, setSelectedSupport] = useState(supportOptions[0]);
  const [supportStep, setSupportStep] = useState(supportActionOptions.help[0]);
  const [supportSaved, setSupportSaved] = useState(false);
  const decisionRef = useRef(null);
  const adultSupportRef = useRef(null);
  const supportSteps = supportActionOptions[selectedSupport.id] || [];

  useEffect(() => {
    if (!['support', 'adultSupportCard'].includes(registerIntent)) return;
    setResult('support');
    window.setTimeout(() => {
      const target = registerIntent === 'adultSupportCard' ? adultSupportRef.current : decisionRef.current;
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }, [registerIntent]);

  function saveSupport() {
    if (supportSaved) return;
    addSupport({
      type: selectedSupport.label,
      goalId: goal?.id || '',
      goalLabel: goal?.label || '',
      supportStep: supportStep?.label || 'Acompañar con calma',
      supportAudience: 'Apoyo para el niño',
      repairAction: selectedSupport.id === 'repair' ? supportStep?.label || '' : ''
    });
    setSupportSaved(true);
  }

  return (
    <div style={{
      padding: '0 18px 24px',
      minHeight: 'calc(844px - 124px)',
      background: APP_PAGE_BACKGROUND
    }}>
      <div style={{
        background: `
          radial-gradient(circle at 78% 16%, rgba(251,196,81,0.28), transparent 30%),
          radial-gradient(circle at 18% 72%, rgba(102,188,126,0.22), transparent 30%),
          linear-gradient(160deg, ${colors.sunLight} 0%, ${colors.skyLight} 100%)
        `,
        margin: '0 -18px',
        padding: '10px 18px 14px',
        borderRadius: '0 0 34px 34px',
        marginBottom: 10,
        color: colors.text
      }}>
        <div style={{ fontSize: 21, fontWeight: 950 }}>Ayuda para este momento 💛</div>
        <div style={{
          marginTop: 7,
          borderRadius: 18,
          minHeight: 54,
          background: `linear-gradient(180deg, rgba(7,24,59,0.05), rgba(7,24,59,0.62)), url("${GANG_IMAGE}")`,
          backgroundSize: '145%',
          backgroundPosition: '52% 42%',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 20px 42px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.18)'
        }} />
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.86)',
        border: `1.5px solid ${colors.sky}55`,
        borderRadius: 20,
        padding: '12px 14px',
        marginBottom: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        boxShadow: '0 8px 20px rgba(65,112,168,0.10)'
      }}>
        <span style={{ fontSize: 22, lineHeight: 1.1 }}>💡</span>
        <div>
          <div style={{ fontSize: 12, color: colors.text, fontWeight: 850, lineHeight: 1.45 }}>
            Descubre y registra qué funciona mejor para la situación.
          </div>
        </div>
      </div>

      {result === 'support' && (
        <>
          <div ref={decisionRef} style={{ marginBottom: 8, scrollMarginTop: 14 }}>
            <div style={sectionLabel}>¿Qué necesita ahora?</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginBottom: 12 }}>
            {supportOptions.map((option) => (
              <RegOption
                key={option.id}
                {...option}
                selected={selectedSupport.id === option.id}
                compact
                onClick={() => {
                  setSelectedSupport(option);
                  setSupportStep((supportActionOptions[option.id] || [])[0]);
                  setSupportSaved(false);
                }}
              />
            ))}
          </div>
        </>
      )}

      {result === 'support' && (
        <div ref={adultSupportRef} style={{
          background: `linear-gradient(135deg, ${colors.peachLight}, rgba(255,255,255,0.94))`,
          border: `2px solid ${colors.peach}45`,
          borderRadius: 22,
          padding: '12px 14px',
          margin: '0 0 12px',
          boxShadow: `0 10px 24px ${colors.peach}22`
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 24 }}>❤️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 950, color: colors.text }}>¿Tú necesitas una pausa?</div>
            </div>
          </div>
          <button type="button" onClick={() => setScreen('adultSupport')} style={{
            width: '100%',
            minHeight: 44,
            border: 'none',
            borderRadius: 15,
            background: '#fff',
            color: '#9C5B2C',
            fontFamily: 'inherit',
            fontWeight: 950,
            marginTop: 10,
            boxShadow: '0 5px 14px rgba(45,55,72,0.08)'
          }}>Abrir Apoyo al Adulto</button>
        </div>
      )}

      {result === 'support' && supportSteps.length > 0 && (
        <div style={{
          background: selectedSupport.id === 'repair'
            ? `linear-gradient(135deg, ${colors.mintLight}, rgba(255,255,255,0.92))`
            : selectedSupport.color + '18',
          border: `2px solid ${selectedSupport.id === 'repair' ? colors.mintDark + '70' : selectedSupport.color + '40'}`,
          borderRadius: 22,
          padding: '12px 14px',
          margin: '0 0 14px',
          boxShadow: selectedSupport.id === 'repair'
            ? `0 10px 26px ${colors.mintDark}24`
            : `0 4px 16px ${selectedSupport.color}18`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 900, color: colors.text, marginBottom: 4 }}>
            <span>{selectedSupport.emoji}</span>
            <span>
              {selectedSupport.id === 'repair' ? 'Podemos reconectar' : '¿Qué sigue ahora?'}
            </span>
          </div>
          {supportSteps.map((action) => (
            <button key={action.id} type="button" onClick={() => {
              setSupportStep(action);
              setSupportSaved(false);
            }} style={{
              width: '100%',
              minHeight: 42,
              border: `2px solid ${supportStep.id === action.id ? selectedSupport.color : '#EEF0F4'}`,
              borderRadius: 14,
              background: supportStep.id === action.id ? '#fff' : 'rgba(255,255,255,0.62)',
              color: colors.text,
              fontFamily: 'inherit',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              marginBottom: 7,
              textAlign: 'left',
              boxShadow: supportStep.id === action.id ? `0 4px 14px ${selectedSupport.color}22` : 'none'
            }}>
              <span style={{ fontSize: 20 }}>{action.emoji}</span>
              <span style={{ flex: 1, fontSize: 12 }}>{action.label}</span>
              <span style={{ color: supportStep.id === action.id ? selectedSupport.color : colors.textSoft }}>
                {supportStep.id === action.id ? '✓' : '○'}
              </span>
            </button>
          ))}
        </div>
      )}

      {result === 'support' && (
        <div style={{
          background: 'rgba(255,255,255,0.76)',
          border: '1px solid rgba(139,182,241,0.24)',
          borderRadius: 20,
          padding: '12px 14px',
          marginTop: 4,
          boxShadow: '0 8px 20px rgba(45,55,72,0.06)'
        }}>
          <div style={{ fontSize: 13, fontWeight: 950, color: colors.text, marginBottom: 10 }}>¿Ocurrió durante alguna meta? <span style={{ color: colors.textMuted }}>(opcional)</span></div>
          <div style={{ display: 'grid', gap: 7 }}>
            <button type="button" onClick={() => {
              setGoal(null);
              setSupportSaved(false);
            }} style={{
              width: '100%',
              minHeight: 40,
              border: `2px solid ${!goal ? colors.mintDark : '#EEF0F4'}`,
              borderRadius: 14,
              background: !goal ? colors.mintLight : '#fff',
              color: colors.text,
              textAlign: 'left',
              padding: '8px 11px',
              fontWeight: 900
            }}>
              💛 Sin meta específica
            </button>
            {data.activeGoals.map((item) => {
              const active = goal?.id === item.id;
              return (
                <button key={item.id} type="button" onClick={() => {
                  setGoal(active ? null : item);
                  setSupportSaved(false);
                }} style={{
                  width: '100%',
                  minHeight: 40,
                  border: `2px solid ${active ? colors.mintDark : '#EEF0F4'}`,
                  borderRadius: 14,
                  background: active ? colors.mintLight : '#fff',
                  color: colors.text,
                  textAlign: 'left',
                  padding: '8px 11px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span>{item.emoji}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {active && <span style={{ color: colors.mintDark, fontSize: 11 }}>Relacionada</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {result === 'support' && <button className="blue-glass-action" onClick={saveSupport} disabled={supportSaved} type="button" style={{
        width: '100%',
        background: BLUE_GLASS_BACKGROUND,
        color: '#fff',
        border: '1px solid rgba(190,235,255,0.94)',
        borderRadius: 20,
        padding: 16,
        fontWeight: 900,
        fontSize: 16,
        cursor: supportSaved ? 'default' : 'pointer',
        marginTop: 12,
        boxShadow: BLUE_GLASS_SHADOW,
        opacity: supportSaved ? 0.9 : 1
      }}>
        {supportSaved
          ? 'Momento registrado ✓'
          : 'Registrar el momento'}
      </button>}

      {result === 'support' && supportSaved && (
        <div style={{
          marginTop: 12,
          background: `linear-gradient(135deg, ${colors.mintLight}, rgba(255,255,255,0.92))`,
          border: `2px solid ${colors.mintDark}44`,
          borderRadius: 20,
          padding: '14px 16px',
          boxShadow: `0 10px 24px ${colors.mintDark}22`
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 24 }}>✅</span>
            <div>
              <div style={{ fontSize: 14, color: colors.text, fontWeight: 950 }}>Ya quedó guardado</div>
              <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 800, marginTop: 2 }}>
                Lo puedes ver en Resumen, dentro de Apoyo familiar.
              </div>
            </div>
          </div>
          <button type="button" onClick={() => setScreen('summary')} style={{
            width: '100%',
            minHeight: 42,
            marginTop: 12,
            border: 'none',
            borderRadius: 15,
            background: '#fff',
            color: colors.mintDark,
            fontFamily: 'inherit',
            fontWeight: 950,
            boxShadow: '0 4px 14px rgba(45,55,72,0.08)'
          }}>Ver apoyo familiar</button>
        </div>
      )}

    </div>
  );
}

function AdultSupportScreen({ setScreen }) {
  const [checked, setChecked] = useState([]);
  const [breathing, setBreathing] = useState(false);
  const [breathSecond, setBreathSecond] = useState(0);
  const [pauseSecond, setPauseSecond] = useState(null);
  const [extraIdea, setExtraIdea] = useState(null);
  const breathCycle = breathSecond % 10;
  const inhaling = breathCycle < 4;
  const breathCount = inhaling ? 4 - breathCycle : 10 - breathCycle;

  useEffect(() => {
    if (!breathing) return undefined;
    const timer = window.setInterval(() => {
      setBreathSecond((current) => {
        if (current >= 29) {
          window.clearInterval(timer);
          setBreathing(false);
          setChecked((items) => items.includes('adult-breathe') ? items : [...items, 'adult-breathe']);
          return 0;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [breathing]);

  useEffect(() => {
    if (pauseSecond === null || pauseSecond === 0) return undefined;
    const timer = window.setTimeout(() => setPauseSecond((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [pauseSecond]);

  function toggleAction(id) {
    setChecked((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  function chooseAction(id) {
    if (id === 'adult-breathe') {
      setBreathing(true);
      return;
    }
    if (id === 'adult-pause') {
      setChecked((items) => items.includes(id) ? items : [...items, id]);
      setPauseSecond(10);
      return;
    }
    toggleAction(id);
  }

  function exitBreathing() {
    setBreathing(false);
    setBreathSecond(0);
  }

  function showAnotherIdea() {
    const availableIdeas = adultCalmIdeas.filter((idea) => idea.title !== extraIdea?.title);
    setExtraIdea(availableIdeas[Math.floor(Math.random() * availableIdeas.length)]);
  }

  return (
    <div style={{ padding: '0 18px 24px', minHeight: 'calc(844px - 124px)', background: APP_PAGE_BACKGROUND }}>
      <div style={{
        margin: '0 -18px 18px',
        padding: '14px 18px 24px',
        borderRadius: '0 0 34px 34px',
        background: `linear-gradient(145deg, ${colors.lavender}, ${colors.sky})`,
        color: '#fff'
      }}>
        <button type="button" onClick={() => breathing ? exitBreathing() : setScreen('register', { registerIntent: 'adultSupportCard' })} style={{
          border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 14,
          padding: '7px 12px', fontWeight: 900, marginBottom: 16
        }}>← Volver</button>
        <div style={{ fontSize: 30 }}>❤️</div>
        <div style={{ fontSize: 23, fontWeight: 950, marginTop: 6 }}>Pausa para el adulto</div>
        <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.45, opacity: 0.9, marginTop: 5 }}>
          Calmarte primero no significa rendirte. Te ayuda a responder con intención.
        </div>
      </div>

      {breathing && (
        <div style={{
          ...styles.card,
          minHeight: 230,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(145deg, ${colors.skyLight}, ${colors.lavLight})`,
          border: `2px solid ${colors.lavender}55`
        }}>
          <div className={`breathing-orb ${inhaling ? 'is-inhaling' : 'is-exhaling'}`}>
            <span style={{ fontSize: 32, fontWeight: 950, color: '#fff' }}>{breathCount}</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 950, color: colors.text, marginTop: 18 }}>
            {inhaling ? 'Inhala...' : 'Exhala...'}
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.textMuted, marginTop: 4 }}>
            Ciclo {Math.min(3, Math.floor(breathSecond / 10) + 1)} de 3
          </div>
          <button type="button" onClick={exitBreathing} style={{
            marginTop: 14, border: 'none', background: 'transparent', color: colors.textMuted, fontWeight: 900
          }}>Detener cuando quieras</button>
        </div>
      )}

      {!breathing && (
        <>
          <div style={{ ...styles.card, padding: '16px 18px' }}>
            <div style={{ fontSize: 15, fontWeight: 950, color: colors.text }}>Tómate un momento</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: colors.textMuted, lineHeight: 1.45, margin: '4px 0 12px' }}>
              Elige lo que te ayude en este momento.
            </div>
            {adultCalmActions.map((action) => {
              const active = checked.includes(action.id);
              return (
                <div key={action.id}>
                  <button type="button" onClick={() => chooseAction(action.id)} style={{
                    width: '100%', minHeight: 52, marginTop: 8, borderRadius: 16,
                    border: `2px solid ${active ? colors.lavender : '#EEF0F4'}`,
                    background: active ? `linear-gradient(135deg, ${colors.lavLight}, #fff)` : '#fff', color: colors.text,
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', textAlign: 'left', fontWeight: 900,
                    boxShadow: active ? `0 7px 18px ${colors.lavender}35` : 'none',
                    transform: active ? 'translateY(-1px)' : 'none',
                    transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease'
                  }}>
                    <span style={{ fontSize: 21 }}>{action.emoji}</span>
                    <span style={{ flex: 1, fontSize: 12 }}>{action.label}</span>
                  </button>
                  {active && (
                    <div style={{
                      margin: '3px 8px 5px',
                      padding: '9px 11px',
                      borderRadius: '0 0 14px 14px',
                      background: `${colors.lavLight}80`,
                      color: colors.textMuted,
                      fontSize: 11,
                      fontWeight: 800,
                      lineHeight: 1.45
                    }}>
                      {action.id === 'adult-pause' && pauseSecond !== null
                        ? pauseSecond > 0
                          ? `Pausa un momento... ${pauseSecond}`
                          : 'Listo. Ahora puedes elegir cómo responder.'
                        : action.help}
                    </div>
                  )}
                </div>
              );
            })}

            {extraIdea && (
              <div style={{
                marginTop: 14,
                padding: '13px 14px',
                borderRadius: 18,
                background: `linear-gradient(135deg, ${colors.sunLight}, rgba(255,255,255,0.96))`,
                border: `2px solid ${colors.sunYellow}70`,
                boxShadow: `0 7px 18px ${colors.sunYellow}25`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ fontSize: 23 }}>{extraIdea.emoji}</span>
                  <div style={{ fontSize: 13, fontWeight: 950, color: colors.text }}>{extraIdea.title}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: colors.textMuted, lineHeight: 1.5, marginTop: 6 }}>
                  {extraIdea.text}
                </div>
              </div>
            )}

            <button type="button" onClick={showAnotherIdea} style={{
              width: '100%',
              minHeight: 46,
              marginTop: 12,
              border: `2px dashed ${colors.lavender}80`,
              borderRadius: 16,
              background: colors.lavLight + '60',
              color: '#7057A8',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 950
            }}>✨ {extraIdea ? 'Mostrar otra idea' : 'Mostrar otras ideas'}</button>
          </div>

          <button type="button" onClick={() => window.history.back()} style={{
            width: '100%', minHeight: 54, border: 'none', borderRadius: 20,
            background: `linear-gradient(135deg, ${colors.lavender}, ${colors.sky})`,
            color: '#fff', fontWeight: 950, fontSize: 15,
            boxShadow: `0 10px 24px ${colors.lavender}35`
          }}>Estoy listo para volver</button>
          <div style={{ textAlign: 'center', fontSize: 11, color: colors.textMuted, fontWeight: 800, marginTop: 10 }}>
            Pequeñas pausas pueden generar grandes cambios.
          </div>
        </>
      )}
    </div>
  );
}

function RewardsScreen({ data, updateReward, deleteCustomReward }) {
  const [customReward, setCustomReward] = useState('');
  const customRewards = data.customRewards || [];
  const allRewards = [
    ...rewardOptions.map((reward) => ({ ...reward, custom: false })),
    ...customRewards.map((reward) => ({ ...reward, custom: true }))
  ];

  function addCustomReward() {
    const reward = customReward.trim();
    if (!reward) return;
    const custom = { id: crypto.randomUUID(), emoji: '✨', label: reward, desc: 'Premio personalizado' };
    updateReward(reward, custom);
    setCustomReward('');
  }

  return (
    <div style={{
      padding: '0 20px 24px',
      minHeight: 'calc(844px - 124px)',
      background: APP_PAGE_BACKGROUND
    }}>
      <div style={{
        background: `
          radial-gradient(circle at 82% 12%, rgba(243,196,81,0.34), transparent 28%),
          radial-gradient(circle at 15% 72%, rgba(240,177,111,0.24), transparent 32%),
          linear-gradient(160deg, ${colors.sunLight} 0%, ${colors.peachLight} 100%)
        `,
        margin: '0 -20px',
        padding: '12px 20px 24px',
        borderRadius: '0 0 32px 32px',
        marginBottom: 20,
        color: colors.text
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Premios 🎁</div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Familiares, simples y significativos</div>
      </div>

      {allRewards.map((reward) => (
        <RewardOption
          key={reward.id}
          reward={reward}
          active={data.weeklyReward === reward.label}
          onClick={() => updateReward(reward.label)}
          onDelete={reward.custom ? () => deleteCustomReward(reward.id) : null}
        />
      ))}

      <div style={{
        marginTop: 8,
        background: colors.lavLight,
        borderRadius: 20,
        padding: '16px 20px',
        border: `2px dashed ${colors.lavender}`
      }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: colors.text }}>➕ Premio personalizado</div>
        <input
          value={customReward}
          onChange={(event) => setCustomReward(event.target.value)}
          placeholder="Ej. Hacer hot cakes"
          style={{
            width: '100%',
            marginTop: 10,
            border: '2px solid #EEF0F4',
            borderRadius: 16,
            minHeight: 46,
            padding: '0 12px',
            fontFamily: 'inherit',
            outline: 'none'
          }}
        />
        <button type="button" className={customReward.trim() ? 'blue-glass-action' : ''} onClick={addCustomReward} disabled={!customReward.trim()} style={{
          marginTop: 10,
          width: '100%',
          minHeight: 46,
          border: 'none',
          borderRadius: 16,
          background: customReward.trim() ? BLUE_GLASS_BACKGROUND : '#E8ECF0',
          color: customReward.trim() ? '#fff' : colors.textSoft,
          fontWeight: 900,
          boxShadow: customReward.trim() ? BLUE_GLASS_SHADOW : 'none'
        }}>Guardar premio</button>
      </div>
    </div>
  );
}

function SummaryScreen({ data, weekStamps, weekSupport, addNote }) {
  const [observation, setObservation] = useState('');
  const topGoal = getTopGoal(weekStamps, data.activeGoals);
  const notes = currentWeekItems(data.notes || []);
  const latestSupportStep = weekSupport.find((log) => log.supportStep || log.repairAction);
  const rewardEarned = weekStamps.length >= WEEKLY_TARGET;
  const biggestWin = weekStamps.length
    ? `${weekStamps.length} huellitas hacia ${data.weeklyReward}`
    : 'El plan familiar está listo para la primera huellita.';

  return (
    <div style={{
      padding: '0 20px 24px',
      minHeight: 'calc(844px - 124px)',
      background: APP_PAGE_BACKGROUND
    }}>
      <div style={{
        background: `linear-gradient(160deg, ${colors.lavLight}, ${colors.skyLight})`,
        margin: '0 -20px',
        padding: '12px 20px 24px',
        borderRadius: '0 0 32px 32px',
        marginBottom: 20
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Resumen semanal</div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>{getWeekRangeLabel()}</div>
        <div style={{
          marginTop: 16,
          background: `linear-gradient(135deg, rgba(255,255,255,0.92), ${colors.sunLight})`,
          borderRadius: 24,
          padding: '18px 20px',
          boxShadow: '0 10px 30px rgba(45,55,72,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 46 }}>{rewardEarned ? '🏆' : '🌟'}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: colors.textMuted }}>Celebración de la semana</div>
              <div style={{ fontSize: 21, fontWeight: 900, color: rewardEarned ? '#C8811A' : colors.mintDark }}>
                {rewardEarned ? 'Premio ganado' : `${weekStamps.length} huellitas ganadas`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        ...styles.card,
        background: `linear-gradient(135deg, ${colors.sunLight}, ${colors.peachLight})`,
        border: `2px solid ${colors.sunYellow}`,
        boxShadow: '0 14px 34px rgba(200,129,26,0.12)'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 36 }}>🎉</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: colors.textMuted }}>Victoria familiar</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: colors.text }}>
              {rewardEarned ? data.weeklyReward : 'El progreso está creciendo'}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <VictoryTile emoji="🎁" label="Premio" value={rewardEarned ? 'Ganado' : `Faltan ${Math.max(0, WEEKLY_TARGET - weekStamps.length)} huellitas`} />
          <VictoryTile emoji="🌟" label="Mayor logro" value={biggestWin} />
          <VictoryTile emoji="🎯" label="Meta favorita" value={topGoal} />
          <VictoryTile emoji="❤️" label="Logro familiar" value={latestSupportStep ? 'Se eligió un siguiente paso' : 'Las huellitas se quedaron seguras'} />
        </div>
      </div>

      <div style={{
        ...styles.card,
        background: 'rgba(255,255,255,0.94)',
        border: `2px solid ${colors.sunYellow}55`
      }}>
        <div style={{ fontSize: 16, fontWeight: 950, color: colors.text, marginBottom: 12 }}>Logros de la semana</div>
        <SummaryMiniRow emoji="🐾" title="Huellitas ganadas" value={`${weekStamps.length} esta semana`} />
        <SummaryMiniRow emoji="🎯" title="Meta más reforzada" value={topGoal} />
      </div>

      <div style={{
        ...styles.card,
        background: 'rgba(255,255,255,0.92)',
        border: '2px solid rgba(139,182,241,0.28)'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>☁️</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 950, color: colors.text }}>Apoyo familiar</div>
            <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 800, lineHeight: 1.4, marginTop: 4 }}>
              Momentos registrados cuando la familia necesitó ayuda, calma o un paso para reparar.
            </div>
          </div>
        </div>

        <div style={{
          background: colors.skyLight,
          borderRadius: 16,
          padding: '10px 12px',
          fontSize: 12,
          color: colors.text,
          fontWeight: 900,
          marginBottom: 10
        }}>
          {weekSupport.length ? `${weekSupport.length} momentos registrados esta semana` : 'Sin momentos registrados esta semana'}
        </div>

        {weekSupport.length ? weekSupport.slice(0, 5).map((log) => (
          <SupportLogDetail key={log.id} log={log} />
        )) : (
          <div style={{
            background: 'rgba(255,255,255,0.72)',
            borderRadius: 16,
            padding: '12px 14px',
            fontSize: 12,
            color: colors.textMuted,
            fontWeight: 800,
            lineHeight: 1.4
          }}>
            Cuando elijas “Ayuda extra”, aparecerá aquí el momento y el siguiente paso elegido.
          </div>
        )}
      </div>

      <div style={{
        ...styles.card,
        background: `linear-gradient(135deg, rgba(255,255,255,0.94), ${colors.lavLight})`,
        border: `2px solid ${colors.lavender}33`
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>📝</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 950, color: colors.text }}>Observaciones de la semana</div>
            <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 800, lineHeight: 1.4, marginTop: 4 }}>
              Sirven para descubrir patrones: qué días cuestan más, qué ayudó y qué necesita más apoyo.
            </div>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.68)',
          borderRadius: 16,
          padding: '10px 12px',
          color: '#7250CB',
          fontSize: 11,
          fontWeight: 800,
          lineHeight: 1.4,
          marginBottom: 12
        }}>
          Ejemplos: “Se durmió tarde”, “Le ayudó tener dos opciones”, “Había mucho ruido”.
        </div>
        <textarea
          value={observation}
          onChange={(event) => setObservation(event.target.value)}
          placeholder="Escribe una observación corta..."
          style={{
            width: '100%',
            minHeight: 78,
            border: '2px solid #EEF0F4',
            borderRadius: 18,
            padding: 14,
            resize: 'none',
            fontFamily: 'inherit',
            color: colors.text,
            outline: 'none'
          }}
        />
        <button type="button" className={observation.trim() ? 'blue-glass-action' : ''} onClick={() => {
          addNote(observation);
          setObservation('');
        }} disabled={!observation.trim()} style={{
          width: '100%',
          minHeight: 46,
          border: 'none',
          borderRadius: 16,
          background: observation.trim() ? BLUE_GLASS_BACKGROUND : '#E8ECF0',
          color: observation.trim() ? '#fff' : colors.textSoft,
          fontWeight: 900,
          marginTop: 10,
          boxShadow: observation.trim() ? BLUE_GLASS_SHADOW : 'none'
        }}>Guardar observación</button>
        <div style={{ marginTop: 14 }}>
          {notes.length ? notes.slice(0, 5).map((note) => (
            <div key={note.id} style={{
              background: 'rgba(255,255,255,0.76)',
              borderRadius: 14,
              padding: '10px 12px',
              marginTop: 8,
              border: '1px solid rgba(185,155,234,0.24)'
            }}>
              <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 900, marginBottom: 3 }}>
                {formatShortDate(note.createdAt)}
              </div>
              <div style={{ fontSize: 12, color: colors.text, fontWeight: 800, lineHeight: 1.35 }}>{note.text}</div>
            </div>
          )) : (
            <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 800, lineHeight: 1.4, marginTop: 10 }}>
              Todavía no hay observaciones esta semana.
            </div>
          )}
        </div>
      </div>

      <div style={{ ...styles.card, background: colors.sunLight, border: `2px dashed ${colors.sunYellow}` }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: colors.text, marginBottom: 8 }}>💡 Recomendación</div>
        <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.5, fontWeight: 700 }}>
          Esta semana funcionó bien reforzar “{topGoal}”. La próxima semana puedes mantener solo 2 metas si quieres hacerlo más fácil.
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ data, updateGoals, addCustomGoal, deleteCustomGoal, updateGoalLimit, updateProfile, undoRecentStamps, setScreen }) {
  const [name, setName] = useState(data.childName);
  const [age, setAge] = useState(data.childAge);
  const [avatar, setAvatar] = useState(data.avatar);
  const [customGoal, setCustomGoal] = useState('');
  const allGoals = [...goalOptions, ...(data.customGoals || [])];

  function saveProfile() {
    updateProfile({ childName: name.trim() || data.childName, childAge: age.trim(), avatar });
  }

  function saveCustomGoal() {
    addCustomGoal(customGoal);
    setCustomGoal('');
  }

  return (
    <div style={{
      padding: '0 20px 24px',
      minHeight: 'calc(844px - 124px)',
      background: APP_PAGE_BACKGROUND
    }}>
      <div style={{
        background: `linear-gradient(160deg, ${colors.mintLight}, ${colors.skyLight})`,
        margin: '0 -20px',
        padding: '12px 20px 24px',
        borderRadius: '0 0 32px 32px',
        marginBottom: 20
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Ajustes</div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Plan familiar de esta semana</div>
      </div>

      <div style={styles.card}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: colors.text }}>Editar perfil del niño</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 1.45 }}>
            Si necesitas cambiar el nombre, la edad o el avatar, hazlo aquí.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Avatar emoji={avatar} small />
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: colors.text }}>{name.trim() || data.childName}</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>{age.trim() || data.childAge} años</div>
          </div>
        </div>
        <TextInput label="Nombre" value={name} onChange={setName} />
        <TextInput label="Edad" value={age} onChange={setAge} />
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 900, marginBottom: 8 }}>Avatar de OmeKid</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {avatarOptions.map((option) => (
              <button key={option.id} className={avatar === option.id ? 'blue-glass-action' : ''} type="button" onClick={() => setAvatar(option.id)} style={{
                minHeight: 76,
                border: `2px solid ${avatar === option.id ? '#8ED8FF' : '#EEF0F4'}`,
                borderRadius: 18,
                background: avatar === option.id ? BLUE_GLASS_BACKGROUND : '#fff',
                boxShadow: avatar === option.id ? BLUE_GLASS_SHADOW : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 8,
                textAlign: 'left'
              }}>
                <Avatar emoji={option.id} small />
                <span>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 900, color: avatar === option.id ? '#fff' : colors.text }}>{option.name}</span>
                  <span style={{ display: 'block', fontSize: 10, fontWeight: 800, color: avatar === option.id ? 'rgba(255,255,255,0.76)' : colors.textMuted }}>{option.role}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="blue-glass-action" onClick={saveProfile} style={{
          width: '100%',
          minHeight: 46,
          border: 'none',
          borderRadius: 16,
          background: BLUE_GLASS_BACKGROUND,
          color: '#fff',
          fontWeight: 900,
          marginTop: 10,
          boxShadow: BLUE_GLASS_SHADOW
        }}>Guardar perfil</button>
      </div>

      <div style={{
        ...styles.card,
        background: colors.sunLight,
        border: `2px dashed ${colors.sunYellow}`
      }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: colors.text }}>Corregir un error</div>
        <div style={{ fontSize: 12, color: '#A8810A', marginTop: 5, lineHeight: 1.45, fontWeight: 700 }}>
          Usa esto solo si una huellita fue agregada por accidente. Los momentos difíciles van en momentos familiares, no quitando progreso.
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={undoRecentStamps} disabled={data.stamps.length < 1} style={{
            width: '100%',
            minHeight: 50,
            border: 'none',
            borderRadius: 16,
            background: data.stamps.length < 1 ? '#E8ECF0' : colors.peach,
            color: data.stamps.length < 1 ? colors.textSoft : colors.text,
            fontWeight: 900
          }}>
            Quitar 1 huellita
          </button>
        </div>
        <div style={{ fontSize: 11, color: '#A8810A', fontWeight: 800, marginTop: 8 }}>
          Quita primero las huellitas más recientes.
        </div>
      </div>

      <div style={sectionLabel}>Metas activas · máximo {data.goalLimit}</div>
      <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 700, lineHeight: 1.45, margin: '-4px 0 12px' }}>
        Recomendamos empezar con 3. La familia puede crecer a 5 o 7 cuando la rutina ya se sienta fácil.
      </div>

      <div style={{
        ...styles.card,
        padding: '14px 16px',
        border: '2px solid #EEF0F4'
      }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: colors.text, marginBottom: 4 }}>Límite de metas semanales</div>
        <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 700, lineHeight: 1.4, marginBottom: 12 }}>
          Elige cuántas metas pueden estar activas esta semana. Manténlo simple cuando la semana esté pesada.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {GOAL_LIMIT_OPTIONS.map((limit) => (
            <button key={limit} className={data.goalLimit === limit ? 'blue-glass-action' : ''} type="button" onClick={() => updateGoalLimit(limit)} style={{
              minHeight: 50,
              border: `2px solid ${data.goalLimit === limit ? '#8ED8FF' : '#EEF0F4'}`,
              borderRadius: 16,
              background: data.goalLimit === limit ? BLUE_GLASS_BACKGROUND : '#fff',
              color: data.goalLimit === limit ? '#fff' : colors.textMuted,
              fontWeight: 900,
              boxShadow: data.goalLimit === limit ? BLUE_GLASS_SHADOW : 'none'
            }}>
              {limit} metas
            </button>
          ))}
        </div>
      </div>

      <div style={{
        ...styles.card,
        padding: '16px 18px',
        border: '2px dashed rgba(78,143,84,0.34)'
      }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: colors.text }}>Meta personalizada</div>
        <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 700, lineHeight: 1.4, marginTop: 4 }}>
          Agrega una meta concreta para esta familia. Si hay espacio, se activa automáticamente.
        </div>
        <input
          value={customGoal}
          onChange={(event) => setCustomGoal(event.target.value)}
          placeholder="Ej. Bañarse sin pelear"
          style={{
            width: '100%',
            marginTop: 12,
            border: '2px solid #EEF0F4',
            borderRadius: 16,
            minHeight: 46,
            padding: '0 12px',
            fontFamily: 'inherit',
            outline: 'none'
          }}
        />
        <button type="button" className={customGoal.trim() ? 'blue-glass-action' : ''} onClick={saveCustomGoal} disabled={!customGoal.trim()} style={{
          marginTop: 10,
          width: '100%',
          minHeight: 46,
          border: 'none',
          borderRadius: 16,
          background: customGoal.trim() ? BLUE_GLASS_BACKGROUND : '#E8ECF0',
          color: customGoal.trim() ? '#fff' : colors.textSoft,
          fontWeight: 900,
          boxShadow: customGoal.trim() ? BLUE_GLASS_SHADOW : 'none'
        }}>Guardar meta</button>
      </div>

      {allGoals.map((goal) => {
        const active = data.activeGoals.some((item) => item.id === goal.id);
        const disabled = !active && data.activeGoals.length >= data.goalLimit;
        return (
          <button key={goal.id} className={active ? 'blue-glass-action' : ''} type="button" disabled={disabled} onClick={() => {
            const nextGoals = active
              ? data.activeGoals.filter((item) => item.id !== goal.id)
              : [...data.activeGoals, goal];
            updateGoals(nextGoals);
          }} style={{
            width: '100%',
            marginBottom: 10,
            background: active ? BLUE_GLASS_BACKGROUND : colors.cardBg,
            border: `2px solid ${active ? '#8ED8FF' : '#EEF0F4'}`,
            borderRadius: 18,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: disabled ? 0.45 : 1,
            color: active ? '#fff' : colors.text,
            fontWeight: 900,
            textAlign: 'left',
            boxShadow: active ? BLUE_GLASS_SHADOW : 'none'
          }}>
            <span style={{ fontSize: 22 }}>{goal.emoji}</span>
            <span style={{ flex: 1 }}>{goal.label}</span>
            {active && <Icon name="check" size={18} color="#fff" />}
            {goal.custom && (
              <span role="button" tabIndex={0} onClick={(event) => {
                event.stopPropagation();
                deleteCustomGoal(goal.id);
              }} onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.stopPropagation();
                  deleteCustomGoal(goal.id);
                }
              }} style={{
                minWidth: 34,
                height: 34,
                borderRadius: 12,
                background: '#fff',
                color: colors.textMuted,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }} aria-label={`Quitar ${goal.label}`}>
                ×
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function NavBar({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'register', icon: 'plus', label: 'Registro' },
    { id: 'rewards', icon: 'gift', label: 'Premios' },
    { id: 'summary', icon: 'chart', label: 'Semana' },
    { id: 'settings', icon: 'user', label: 'Ajustes' }
  ];

  return (
    <div style={styles.navBar}>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)} type="button" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          cursor: 'pointer',
          padding: '4px 8px',
          opacity: active === tab.id ? 1 : 0.45,
          transition: 'all 0.2s',
          background: 'transparent',
          border: 'none'
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: active === tab.id ? 'linear-gradient(145deg, rgba(139,211,255,0.9), rgba(26,119,224,0.94))' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name={tab.icon} size={20} color={active === tab.id ? '#fff' : colors.textSoft} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, color: active === tab.id ? '#176DCA' : colors.textSoft }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function StatusBar({ onLogoClick }) {
  return (
    <div style={styles.statusBar}>
      <button type="button" onClick={onLogoClick} aria-label="Ir a la portada de OmeKid" style={{
        height: 34,
        border: 'none',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 5px',
        boxShadow: '0 4px 12px rgba(7,24,59,0.1)',
        cursor: 'pointer',
        overflow: 'hidden'
      }}>
        <img src="/omekid-logo-emblem.png" alt="" style={{
          width: 92,
          height: 46,
          objectFit: 'cover',
          objectPosition: 'center',
          mixBlendMode: 'darken',
          clipPath: 'polygon(7% 19%, 31% 19%, 35% 13%, 66% 13%, 70% 6%, 83% 6%, 87% 14%, 94% 14%, 97% 25%, 97% 71%, 93% 78%, 90% 89%, 15% 89%, 12% 80%, 8% 76%)',
          filter: 'url(#omekid-blue-logo-filter)'
        }} />
      </button>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: colors.textMuted }}>●●●</span>
        <span style={{ fontSize: 11, color: colors.textMuted }}>WiFi</span>
        <span style={{ fontSize: 11, color: colors.textMuted }}>🔋</span>
      </div>
    </div>
  );
}

function Avatar({ emoji, small = false }) {
  const character = getAvatar(emoji);
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        width: small ? 56 : 60,
        height: small ? 56 : 60,
        borderRadius: '50%',
        background: BLUE_GLASS_BACKGROUND,
        backgroundImage: `url("${character.image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 18px rgba(20,104,225,0.3), inset 0 1px 0 rgba(255,255,255,0.65)',
        border: '3px solid rgba(166,225,255,0.92)'
      }} />
      {!small && <div style={{
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: colors.mintDark,
        border: '2px solid #fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10
      }}>🐾</div>}
      {!small && <div style={{
        position: 'absolute',
        left: '50%',
        bottom: -24,
        transform: 'translateX(-50%)',
        fontSize: 11,
        color: colors.text,
        fontWeight: 900,
        background: 'rgba(255,255,255,0.82)',
        borderRadius: 999,
        padding: '2px 8px',
        boxShadow: '0 2px 8px rgba(45,55,72,0.08)'
      }}>{character.name}</div>}
    </div>
  );
}

function RegisterCompanionArt({ weeklyReward }) {
  return (
    <div style={{
      margin: '4px 0 14px',
      borderRadius: 24,
      minHeight: 148,
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.88)',
      boxShadow: '0 14px 30px rgba(45,55,72,0.09)',
      background: `
        linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,250,244,0.92) 48%, rgba(255,250,244,0.28) 100%),
        url("${GANG_IMAGE}")
      `,
      backgroundSize: '172%',
      backgroundPosition: '56% 44%',
      backgroundRepeat: 'no-repeat'
    }}>
      <div style={{
        width: '62%',
        minHeight: 148,
        padding: '16px 14px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: 13, fontWeight: 950, color: colors.mintDark, marginBottom: 4, letterSpacing: 0.2 }}>
          La pandilla acompaña
        </div>
        <div style={{ fontSize: 20, fontWeight: 950, color: colors.text, lineHeight: 1.05 }}>
          Cada huellita cuenta
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.textMuted, lineHeight: 1.35, marginTop: 7 }}>
          Elige una meta, celebra el avance o acompaña con apoyo.
        </div>
        <div style={{
          marginTop: 10,
          background: 'rgba(255,255,255,0.82)',
          border: `1px solid ${colors.sunYellow}80`,
          borderRadius: 16,
          padding: '8px 10px',
          boxShadow: '0 6px 16px rgba(45,55,72,0.06)'
        }}>
          <div style={{ fontSize: 10, color: colors.textMuted, fontWeight: 950, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            Premio semanal
          </div>
          <div style={{ fontSize: 12, color: colors.text, fontWeight: 950, marginTop: 2, lineHeight: 1.2 }}>
            {weeklyReward}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekDots({ count }) {
  const slots = Array.from({ length: WEEKLY_TARGET });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, alignItems: 'center' }}>
      {slots.map((_, index) => (
        <div key={index} className="magic-paw-slot" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div className={`magic-paw-circle ${index < count ? 'is-earned' : ''}`} style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: index < count
              ? `linear-gradient(135deg, #C5A7F6, #865FD3)`
              : 'rgba(255,255,255,0.78)',
            border: index < count
              ? '1px solid rgba(238,224,255,0.72)'
              : '1px solid rgba(255,255,255,0.32)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            boxShadow: index < count
              ? '0 5px 16px rgba(134,95,211,0.46), inset 0 0 0 1px rgba(255,255,255,0.34)'
              : '0 4px 12px rgba(7,24,59,0.14), inset 0 0 0 1px rgba(255,255,255,0.18)',
            backdropFilter: 'blur(5px)'
          }}>{index < count ? '🐾' : ''}</div>
          <span style={{
            fontSize: 10,
            color: '#fff',
            fontWeight: 950,
            textShadow: '0 1px 4px rgba(7,24,59,0.9)'
          }}>{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function GoalSelectPod({ goal, count, selected, onClick, compact = false }) {
  const progress = Math.min(100, (count / Math.max(3, WEEKLY_TARGET / 2)) * 100);
  const activeColor = colors.mintDark;
  const visualColor = selected ? activeColor : goal.color;

  return (
    <button type="button" onClick={onClick} className="goal-pod" style={{
      width: '100%',
      minHeight: compact ? 62 : 74,
      border: `2px solid ${selected ? activeColor : 'rgba(238,240,244,0.95)'}`,
      borderRadius: compact ? 20 : 24,
      background: selected
        ? `linear-gradient(135deg, ${colors.mintLight}, rgba(255,255,255,0.94))`
        : 'rgba(255,255,255,0.82)',
      boxShadow: selected
        ? `0 14px 28px ${activeColor}30, inset 0 1px 0 rgba(255,255,255,0.75)`
        : '0 8px 18px rgba(45,55,72,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: compact ? 10 : 12,
      padding: compact ? '9px 11px' : '12px 14px',
      textAlign: 'left',
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease'
    }}>
      <div style={{
        width: compact ? 42 : 50,
        height: compact ? 42 : 50,
        borderRadius: compact ? 15 : 18,
        background: selected ? '#fff' : goal.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: compact ? 21 : 25,
        boxShadow: '0 7px 16px rgba(14,31,71,0.08)',
        flexShrink: 0
      }}>{goal.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: compact ? 13 : 15,
          color: colors.text,
          fontWeight: 950,
          lineHeight: 1.15,
          whiteSpace: compact ? 'normal' : 'nowrap',
          overflow: compact ? 'visible' : 'hidden',
          textOverflow: compact ? 'clip' : 'ellipsis'
        }}>{goal.label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: compact ? 7 : 9 }}>
          <div style={{ flex: 1 }}>
            <ProgressBar pct={progress} color={visualColor} height={compact ? 6 : 7} />
          </div>
          <span style={{
            color: visualColor,
            fontSize: compact ? 11 : 12,
            fontWeight: 950,
            whiteSpace: 'nowrap'
          }}>{count} 🐾</span>
        </div>
      </div>
      <div style={{
        width: compact ? 28 : 32,
        height: compact ? 28 : 32,
        borderRadius: '50%',
        background: selected ? activeColor : '#fff',
        border: selected ? 'none' : '2px solid #E4E8EE',
        color: selected ? '#fff' : colors.textSoft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 950,
        fontSize: compact ? 14 : 16,
        flexShrink: 0,
        boxShadow: selected ? `0 8px 18px ${activeColor}38` : 'none'
      }}>
        {selected ? '✓' : '○'}
      </div>
    </button>
  );
}

function GoalCard({ goal, count, dark = false, selected = false, onClick }) {
  const hasStamps = count > 0;
  const activeColor = colors.mintDark;
  const visualColor = selected ? activeColor : goal.color;

  return (
    <button type="button" onClick={onClick} style={{
      width: '100%',
      background: dark
        ? selected
          ? `linear-gradient(135deg, ${activeColor}55, rgba(255,255,255,0.14))`
          : `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))`
        : selected
          ? `linear-gradient(135deg, ${colors.mintLight}, rgba(255,255,255,0.9))`
          : `linear-gradient(135deg, ${goal.bg}, rgba(255,255,255,0.88))`,
      border: selected
        ? `2px solid ${activeColor}`
        : dark
          ? '1px solid rgba(255,255,255,0.14)'
          : `1px solid ${goal.color}26`,
      borderRadius: 24,
      padding: '14px 16px',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: selected
        ? `0 14px 30px ${activeColor}35`
        : dark
          ? '0 14px 30px rgba(0,0,0,0.14)'
          : '0 10px 24px rgba(45,55,72,0.06)',
      backdropFilter: dark ? 'blur(10px)' : 'none',
      fontFamily: 'inherit',
      textAlign: 'left',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease'
    }}>
      <div style={{
        width: 50,
        height: 50,
        borderRadius: 18,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        boxShadow: '0 8px 18px rgba(0,0,0,0.08)',
        flexShrink: 0
      }}>{goal.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 900, fontSize: 15, color: dark ? '#fff' : colors.text, marginBottom: 8 }}>{goal.label}</div>
        <ProgressBar pct={Math.min(100, (count / Math.max(3, WEEKLY_TARGET / 2)) * 100)} color={visualColor} height={7} />
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          borderRadius: 999,
          minHeight: 24,
          padding: '4px 10px',
          marginTop: 8,
          background: hasStamps || selected ? visualColor + '24' : 'rgba(255,255,255,0.22)',
          color: dark ? '#fff' : colors.text,
          fontSize: 12,
          fontWeight: 900
        }}>
          <span>🐾</span>
          <span>{count} {count === 1 ? 'huellita' : 'huellitas'} esta semana</span>
        </div>
      </div>
      <div style={{
        minWidth: 42,
        height: 36,
        borderRadius: '50%',
        background: selected ? activeColor : hasStamps ? goal.color : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        color: selected || hasStamps ? '#fff' : goal.color,
        fontSize: 13,
        fontWeight: 950
      }}>
        {selected ? '✓' : count}
      </div>
    </button>
  );
}

function RewardOption({ reward, active, onClick, onDelete }) {
  return (
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') onClick();
    }} style={{
      background: active ? colors.sunLight : colors.cardBg,
      borderRadius: 20,
      padding: '18px 20px',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      border: `2px solid ${active ? colors.sunYellow : '#EEF0F4'}`,
      textAlign: 'left',
      cursor: 'pointer'
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 18,
        background: colors.peachLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 26,
        flexShrink: 0
      }}>{reward.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: colors.text }}>{reward.label}</div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{reward.desc}</div>
      </div>
      <div className={active ? 'blue-glass-action' : ''} style={{
        background: active ? BLUE_GLASS_BACKGROUND : '#E8ECF0',
        borderRadius: 12,
        padding: '6px 12px',
        color: active ? '#fff' : colors.textSoft,
        fontWeight: 800,
        fontSize: 12,
        boxShadow: active ? '0 7px 16px rgba(20,104,225,0.24), inset 0 1px 0 rgba(255,255,255,0.54)' : 'none'
      }}>{active ? 'Elegido' : 'Elegir'}</div>
      {onDelete && (
        <button type="button" onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }} style={{
          minWidth: 34,
          height: 34,
          border: 'none',
          borderRadius: 12,
          background: '#F5F7FA',
          color: colors.textMuted,
          fontWeight: 900,
          cursor: 'pointer'
        }} aria-label={`Quitar ${reward.label}`}>
          ×
        </button>
      )}
    </div>
  );
}

function RegOption({ emoji, label, desc, color, selected, onClick, compact = false }) {
  if (compact) {
    return (
      <button onClick={onClick} type="button" style={{
        minHeight: 56,
        background: selected ? color + '22' : 'rgba(255,255,255,0.92)',
        border: `2px solid ${selected ? color : 'rgba(255,255,255,0.72)'}`,
        borderRadius: 16,
        padding: '8px 8px',
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.2s',
        boxShadow: selected ? `0 8px 22px ${color}24` : '0 6px 18px rgba(0,0,0,0.06)',
        textAlign: 'center',
        color: colors.text,
        position: 'relative'
      }}>
        <div style={{
          width: 25,
          height: 25,
          borderRadius: 11,
          background: selected ? color + '24' : '#F5F7FA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          margin: '0 auto 4px'
        }}>{emoji}</div>
        <div style={{ fontWeight: 950, fontSize: 10, color: selected ? color : colors.text, lineHeight: 1.08 }}>{label}</div>
        {selected && (
          <div style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name="check" size={10} color="#fff" />
          </div>
        )}
      </button>
    );
  }

  return (
    <button onClick={onClick} type="button" style={{
      background: selected ? color + '18' : colors.cardBg,
      border: `2px solid ${selected ? color : '#EEF0F4'}`,
      borderRadius: 20,
      padding: '16px 18px',
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s',
      boxShadow: selected ? `0 4px 16px ${color}30` : '0 2px 8px rgba(0,0,0,0.04)',
      textAlign: 'left'
    }}>
      <div style={{
        width: 46,
        height: 46,
        borderRadius: 16,
        background: selected ? color + '20' : '#F5F7FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        flexShrink: 0
      }}>{emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: selected ? color : colors.text }}>{label}</div>
        <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>{desc}</div>
      </div>
      {selected && (
        <div style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon name="check" size={14} color="#fff" />
        </div>
      )}
    </button>
  );
}

function ProgressBar({ pct, color, height = 10 }) {
  return (
    <div style={{ height, background: '#EEF0F4', borderRadius: 100, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${Math.max(0, Math.min(100, pct))}%`,
        background: color,
        borderRadius: 100,
        transition: 'width 0.8s ease'
      }} />
    </div>
  );
}

function SummaryCard({ emoji, title, value }) {
  return (
    <div style={{ ...styles.card, display: 'flex', gap: 14, alignItems: 'center' }}>
      <span style={{ fontSize: 30 }}>{emoji}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 900, color: colors.text }}>{title}</div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}

function SummaryMiniRow({ emoji, title, value }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'rgba(255,255,255,0.72)',
      borderRadius: 16,
      padding: '12px 14px',
      marginTop: 8,
      border: '1px solid rgba(245,224,160,0.5)'
    }}>
      <span style={{ fontSize: 24 }}>{emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 950, color: colors.text }}>{title}</div>
        <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 800, marginTop: 2, lineHeight: 1.35 }}>{value}</div>
      </div>
    </div>
  );
}

function SupportLogDetail({ log }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(231,240,255,0.82), rgba(255,255,255,0.9))',
      borderRadius: 16,
      padding: '12px 14px',
      marginTop: 9,
      border: '1px solid rgba(139,182,241,0.32)'
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{getSupportEmoji(log.type)}</span>
        <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 900 }}>{formatShortDate(log.createdAt)}</span>
      </div>
      <div style={{ fontSize: 13, color: colors.text, fontWeight: 950, lineHeight: 1.35 }}>
        {log.goalLabel ? `${log.goalLabel} · ` : ''}{log.type}
      </div>
      <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 800, lineHeight: 1.35, marginTop: 4 }}>
        {log.supportAudience ? `${log.supportAudience}: ` : 'Siguiente paso: '}
        {log.supportStep || log.repairAction || 'Acompañar con calma'}
      </div>
    </div>
  );
}

function VictoryTile({ emoji, label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.78)',
      borderRadius: 18,
      padding: '12px 10px',
      minHeight: 94,
      boxShadow: '0 4px 14px rgba(45,55,72,0.06)'
    }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontSize: 11, fontWeight: 900, color: colors.textMuted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: colors.text, fontWeight: 900, lineHeight: 1.35 }}>{value}</div>
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 900 }}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} style={{
        width: '100%',
        minHeight: 46,
        marginTop: 6,
        border: '2px solid #EEF0F4',
        borderRadius: 16,
        padding: '0 12px',
        fontFamily: 'inherit',
        outline: 'none'
      }} />
    </label>
  );
}

function Celebration({ message }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 'auto 18px 98px',
      background: '#fff',
      borderRadius: 24,
      padding: '16px 18px',
      boxShadow: '0 12px 36px rgba(0,0,0,0.16)',
      border: `2px solid ${colors.sunYellow}`,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      zIndex: 5,
      fontSize: 13,
      fontWeight: 900,
      color: colors.text
    }}>
      <span style={{ fontSize: 28 }}>🌟</span>
      <span>{message}</span>
    </div>
  );
}

function Icon({ name, size = 22, color = colors.text }) {
  const icons = {
    home: <path d="M3 9.5L12 3l9 6.5V21H15v-6H9v6H3V9.5z" strokeWidth="2" stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.8" stroke={color} fill={color} opacity="0.8" />,
    gift: <><rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="2" stroke={color} fill="none" /><path d="M12 11V22M3 7h18v4H3zM12 7C10 5 8 3 8 3s0 4 4 4zM12 7c2-2 4-4 4-4s0 4-4 4z" strokeWidth="2" stroke={color} fill="none" /></>,
    chart: <path d="M3 20h18M3 20V10l5 5 4-8 5 6 3-4v11" strokeWidth="2" stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    user: <><circle cx="12" cy="8" r="4" strokeWidth="2" stroke={color} fill="none" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth="2" stroke={color} fill="none" strokeLinecap="round" /></>,
    check: <path d="M5 12l5 5L20 7" strokeWidth="2.5" stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    plus: <path d="M12 5v14M5 12h14" strokeWidth="2.5" stroke={color} fill="none" strokeLinecap="round" />
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{icons[name]}</svg>;
}

const sectionLabel = {
  fontSize: 12,
  fontWeight: 800,
  color: colors.textMuted,
  marginBottom: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.8
};

const darkSectionLabel = {
  ...sectionLabel,
  color: 'rgba(255,255,255,0.72)'
};

function goalStampCount(goal, stamps) {
  return stamps.filter((stamp) => stamp.goalId === goal.id).length;
}

function getTopGoal(stamps, goals) {
  if (!stamps.length) return goals[0]?.label || 'una meta simple';
  const counts = stamps.reduce((acc, stamp) => {
    const goalLabel = getGoalById(stamp.goalId)?.label || stamp.goalLabel;
    acc[goalLabel] = (acc[goalLabel] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function currentWeekItems(items) {
  const start = startOfWeek(new Date());
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return items.filter((item) => {
    const date = new Date(item.createdAt);
    return date >= start && date < end;
  });
}

function currentDayItems(items) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return items.filter((item) => {
    const date = new Date(item.createdAt);
    return date >= start && date < end;
  });
}

function getWeekRangeLabel() {
  const start = startOfWeek(new Date());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${start.getDate()} – ${end.getDate()} de ${new Intl.DateTimeFormat('es', { month: 'long' }).format(end)}`;
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(value));
}

function getSupportEmoji(type) {
  return supportOptions.find((option) => option.label === type)?.emoji || '☁️';
}

function startOfWeek(date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + diff);
  return next;
}

function getWeekStartKey(date) {
  return startOfWeek(date).toISOString().slice(0, 10);
}

function getAvatar(value) {
  if (value === '🦊') return avatarOptions[0];
  return avatarOptions.find((option) => option.id === value) || avatarOptions[0];
}

function getGoalById(goalId) {
  return goalOptions.find((goal) => goal.id === goalId);
}

function normalizeGoal(goal) {
  if (goal?.id === 'night-routine') {
    return getGoalById('bath-no-fight');
  }
  return getGoalById(goal?.id) || { ...goal, label: normalizeGoalLabel(goal?.label) };
}

function normalizeGoalLabel(label) {
  const normalizedLabel = String(label || '').trim().toLocaleLowerCase('es');
  if (['rutina de la manana', 'rutina de la mañana'].includes(normalizedLabel)) {
    return 'Rutina de la mañana';
  }
  return label;
}

function normalizeRewardLabel(label) {
  const englishToSpanish = {
    'Choose a movie': 'Escoger película',
    'Go to the park': 'Ir al parque',
    'Extra video game time': 'Tiempo extra de videojuego',
    'Choose Friday dinner': 'Elegir comida del viernes',
    'Campout night': 'Noche de campamento'
  };
  return englishToSpanish[label] || label || rewardOptions[0].label;
}

function useStoredData() {
  const [data, setDataState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return normalizeData(saved ? { ...defaultData, ...saved } : defaultData);
    } catch {
      return defaultData;
    }
  });

  function setData(nextData) {
    if (typeof nextData === 'function') {
      setDataState((currentData) => {
        const cleanData = normalizeData(nextData(currentData));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
        return cleanData;
      });
      return;
    }

    const cleanData = normalizeData(nextData);
    setDataState(cleanData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
  }

  return [data, setData];
}

function normalizeData(value) {
  const goalLimit = getGoalLimit(value?.goalLimit);
  const defaultActiveGoals = getDefaultActiveGoals(goalLimit);
  const savedGoals = Array.isArray(value?.activeGoals) && value.activeGoals.length
    ? value.activeGoals.map(normalizeGoal)
    : defaultActiveGoals;
  const activeGoals = shouldUseDefaultTestGoals(value?.activeGoals)
    ? defaultActiveGoals
    : savedGoals.slice(0, goalLimit);
  return {
    ...defaultData,
    ...value,
    avatar: getAvatar(value?.avatar).id,
    goalLimit,
    activeGoals,
    weeklyReward: normalizeRewardLabel(value?.weeklyReward),
    customGoals: Array.isArray(value?.customGoals)
      ? value.customGoals.map((goal) => ({ ...goal, label: normalizeGoalLabel(goal.label), custom: true }))
      : [],
    customRewards: Array.isArray(value?.customRewards)
      ? value.customRewards.map((reward) => ({ ...reward, desc: reward.desc === 'Custom reward' ? 'Premio personalizado' : reward.desc }))
      : [],
    stamps: Array.isArray(value?.stamps) ? value.stamps : [],
    supportLogs: Array.isArray(value?.supportLogs) ? value.supportLogs : [],
    notes: Array.isArray(value?.notes) ? value.notes : []
  };
}

function getDefaultActiveGoals(goalLimit = DEFAULT_GOAL_LIMIT) {
  const defaultIds = ['morning-routine', 'bath-no-fight', 'pick-up-toys'];
  return defaultIds.map(getGoalById).filter(Boolean).slice(0, goalLimit);
}

function shouldUseDefaultTestGoals(activeGoals) {
  if (!Array.isArray(activeGoals) || !activeGoals.length) return true;
  const activeIds = activeGoals.map((goal) => goal?.id).filter(Boolean);
  const legacyDefaultIds = ['calm-voice', 'pick-up-toys', 'homework', 'bath-no-fight'];
  return activeIds.length <= 3 && activeIds.every((id) => legacyDefaultIds.includes(id));
}

function getGoalLimit(value) {
  return GOAL_LIMIT_OPTIONS.includes(Number(value)) ? Number(value) : DEFAULT_GOAL_LIMIT;
}

function getScreenFromHash() {
  const screenFromHash = window.location.hash.replace('#', '');
  const validScreens = ['landing', 'home', 'register', 'adultSupport', 'rewards', 'summary', 'settings'];
  return validScreens.includes(screenFromHash) ? screenFromHash : null;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: colors.cream, color: colors.text, fontFamily: 'Nunito, system-ui, sans-serif' }}>
          <div style={{ maxWidth: 360, background: '#fff', borderRadius: 24, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🌟</div>
            <h1 style={{ margin: 0, fontSize: 22 }}>OmeKid necesita recargar</h1>
            <p style={{ color: colors.textMuted, lineHeight: 1.4 }}>Hubo un problema con datos guardados en este navegador. Recarga la página para volver a empezar.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
