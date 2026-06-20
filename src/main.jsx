import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const isStandaloneApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
document.documentElement.classList.toggle('is-standalone', isStandaloneApp);

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

const FAMILY_STORAGE_KEY = 'omekid-family-v1';
const LANGUAGE_KEY = 'omekid-language';
const ONBOARDING_KEY = 'omekid-onboarding-beta-v1';
const WEEKLY_TARGET = 10;
const DEFAULT_GOAL_LIMIT = 3;
const GOAL_LIMIT_OPTIONS = [3, 5, 7];
const GANG_IMAGE = '/omekid-gang.png';
const PROGRESS_GANG_IMAGE = '/omekid-progress-gang.png';
const LANDING_GANG_IMAGE = '/omekid-landing-futuristic.png';
const APP_PAGE_BACKGROUND = 'linear-gradient(90deg, #FFFFFF 0%, #FFFCF7 38%, #EDF5FF 64%, #D5E7FF 100%)';
const BLUE_GLASS_BACKGROUND = 'linear-gradient(145deg, rgba(84,190,255,0.96) 0%, rgba(18,111,225,0.98) 48%, rgba(5,48,137,1) 100%)';
const BLUE_GLASS_SHADOW = '0 14px 28px rgba(20,104,225,0.34), 0 4px 0 rgba(4,43,126,0.68), inset 0 2px 0 rgba(255,255,255,0.64), inset 0 -7px 16px rgba(3,43,125,0.3)';
const OMI_PAW_MESSAGES = {
  es: ['¡Cada paso cuenta!', '¡Buen trabajo hoy!', '¡Lo lograste!', '¡Sigue adelante!', '¡Las pequeñas victorias importan!'],
  en: ['Every step counts!', 'Nice work today!', 'You did it!', 'Keep going!', 'Small wins matter!']
};

const englishCopy = {
  'Pequeños pasos.': 'Small steps.',
  'Grandes logros.': 'Big wins.',
  'Ayudando a niños y familias a construir un futuro con amor, paciencia y victorias diarias.': 'Helping children build positive habits one small step at a time.',
  'Entrar a OmeKid': 'Enter OmeKid',
  'Inicio': 'Home',
  'Ayuda': 'Help',
  'Premios': 'Rewards',
  'Semana': 'Week',
  'Ajustes': 'Settings',
  'OmeKid · Hábitos positivos para niños y familias': 'OmeKid · Positive habits for children and families',
  'Buenos días': 'Good morning',
  '¿Cómo estuvo tu día?': 'How was your day?',
  '¡Hola,': 'Hi,',
  'huellita': 'paw print',
  'huellitas': 'paw prints',
  'esta semana': 'this week',
  'Deberes de hoy (': "Today's tasks (",
  'de': 'of',
  'Tu viaje de crecimiento': 'Your growth journey',
  'Deberes de hoy': "Today's tasks",
  'Toca un deber para seleccionarlo': 'Tap a task to select it',
  'Ganó una huellita': 'Add Paw Print',
  '¡Huellita ganada!': 'Paw Print Added!',
  '¿Te equivocaste?': 'Made a mistake?',
  'Quitar 1 huellita': 'Remove 1 paw print',
  'Huella guardada. Celebramos lo que sí pasó.': 'Paw print saved. We celebrate what happened.',
  '1 huellita quitada por error.': '1 paw print removed.',
  'Premio de la semana': "This week's reward",
  'Las huellitas se quedan': 'Paw prints stay',
  '¿Aún no lo logra? Elegir ayuda extra': 'Still working on it? Choose extra help',
  'Ayuda para este momento 💛': 'Help for this moment 💛',
  'Elige una ayuda para acompañar este momento.': 'Choose a way to support this moment.',
  '¿Qué necesita ahora?': 'What would help right now?',
  'Ayuda extra': 'Extra support',
  'Un poco de compañía puede ayudar': 'A little support can help',
  'Un momento de calma': 'A calm moment',
  'Primero tranquilidad, después seguimos': 'Calm first, then we continue',
  'Arreglar algo': 'Move Forward',
  'Resolver lo ocurrido con cariño': 'Work through what happened with care',
  '¿Tú necesitas una pausa?': 'Do you need a pause?',
  'Abrir Apoyo al Adulto': 'Open Adult Support',
  '¿Cómo puedes ayudar?': 'How can you help?',
  'Podemos reconectar': 'We can reconnect',
  'Ayudar con el primer paso pequeño': 'Help with the first small step',
  'Ofrecer dos opciones simples': 'Offer two simple choices',
  'Hacerlo juntos una vez': 'Do it together once',
  'Celebrar que lo intentó con ayuda': 'Celebrate trying with help',
  'Tomar una pausa juntos': 'Take a pause together',
  'Usar pocas palabras por un momento': 'Use fewer words for a moment',
  'Ir a un lugar tranquilo': 'Go to a quiet place',
  'Intentar una versión más sencilla del deber': 'Try an easier version of the task',
  'Ayudar a arreglarlo': 'Help make it better',
  'Intentarlo otra vez con calma': 'Try again calmly',
  'Usar palabras amables': 'Use kind words',
  'Preguntar: “¿Qué podemos hacer para mejorarlo?”': 'Ask: “What can we do to make it better?”',
  'Pausa para el adulto': 'Pause for the adult',
  'Calmarte primero no significa rendirte. Te ayuda a responder con intención.': 'Calming yourself first does not mean giving in. It helps you respond with intention.',
  'Tomarte un momento': 'Take a moment',
  'Tómate un momento': 'Take a moment',
  'Elige lo que te ayude en este momento.': 'Choose what may help you right now.',
  'Inhala...': 'Breathe in...',
  'Exhala...': 'Breathe out...',
  'Detener cuando quieras': 'Stop whenever you want',
  'Mostrar otra idea': 'Show another idea',
  'Primero, asegurar el momento': 'First, make the moment safe',
  'Hacer una pausa de 10 segundos': 'Take a 10-second pause',
  'Respirar lentamente 3 veces': 'Breathe slowly 3 times',
  'No entrar en la discusión': 'Do not enter the argument',
  'Tomar distancia si es seguro': 'Step away if it is safe',
  'Mostrar otras ideas': 'Show other ideas',
  'Estoy listo para volver': "I'm ready to go back",
  'Pequeñas pausas pueden generar grandes cambios.': 'Small pauses can create big changes.',
  'Confirma que todos estén seguros. Si hace falta, separa con calma y retira objetos que puedan lastimar.': 'Make sure everyone is safe. If needed, calmly create space and move anything that could hurt someone.',
  'No tienes que responder inmediatamente. Regálate diez segundos antes de decidir qué decir.': 'You do not have to respond immediately. Give yourself ten seconds before deciding what to say.',
  'Sigue una respiración guiada breve para bajar la intensidad del momento.': 'Follow a short guided breath to lower the intensity of the moment.',
  'Si tu hija responde molesta, intenta no responder al tono. Baja tu voz y di: “No voy a discutir. Hablamos cuando estemos tranquilas.” Pueden resolver lo ocurrido después.': 'If your child responds angrily, try not to respond to the tone. Lower your voice and say: “I will not argue. We can talk when we are calm.” You can work through it later.',
  'Puedes decir: “Necesito un momento. Regreso pronto.”': 'You can say: “I need a moment. I will be back soon.”',
  'Prueba: “¿Quieres recoger primero los juguetes o los libros?”': 'Try: “Would you like to pick up the toys or the books first?”',
  'Repetir la indicación una sola vez': 'Repeat the direction only once',
  'Dila con pocas palabras y después dale un momento para responder.': 'Say it with few words, then give your child a moment to respond.',
  'Hablar del tema más tarde': 'Talk about it later',
  'Puedes decir: “Esto importa, pero lo hablaremos cuando estemos más tranquilos.”': 'You can say: “This matters, but we will talk about it when we are calmer.”',
  'Pedir apoyo a otro adulto': 'Ask another adult for support',
  'Si hay alguien disponible, pedir relevo también es cuidar a la familia.': 'If someone is available, asking for a hand is also caring for the family.',
  'Hacer la petición más pequeña': 'Make the request smaller',
  'En lugar de pedir todo, comienza con un solo paso fácil de entender.': 'Instead of asking for everything, begin with one easy-to-understand step.',
  'No necesito ganar esta discusión': 'I do not need to win this argument',
  'La prioridad ahora puede ser bajar la intensidad. El límite puede explicarse después.': 'The priority can be lowering the intensity. The limit can be explained later.',
  'Cambiar brevemente de ambiente': 'Briefly change the setting',
  'Si todos están seguros, tomar agua o caminar unos pasos puede ayudar a reiniciar.': 'If everyone is safe, drinking water or walking a few steps may help reset.',
  'Nombrar lo que escuchaste': 'Name what you heard',
  'Prueba: “Veo que esto te molestó.” Escuchar no significa cambiar el límite.': 'Try: “I see that this upset you.” Listening does not mean changing the limit.',
  'Listo. Ahora puedes elegir cómo responder.': 'Ready. Now you can choose how to respond.',
  'Volver': 'Back',
  '← Volver': '← Back',
  'Premios 🎁': 'Rewards 🎁',
  'Familiares, simples y significativos': 'Simple, meaningful family rewards',
  'Premio personalizado': 'Custom reward',
  '➕ Premio personalizado': '➕ Custom reward',
  'Guardar premio': 'Save reward',
  'Elegido': 'Selected',
  'Elegir': 'Choose',
  'Resumen semanal': 'Weekly summary',
  'Celebración de la semana': "This week's celebration",
  'Premio ganado': 'Reward earned',
  'Victoria familiar': 'Family win',
  'El progreso está creciendo': 'Progress is growing',
  'Premio': 'Reward',
  'Mayor logro': 'Biggest win',
  'Deber favorito': 'Favorite task',
  'Logro familiar': 'Family win',
  'Seguimos avanzando juntos': 'We keep moving forward together',
  'El plan familiar está listo para la primera huellita.': 'The family plan is ready for the first paw print.',
  'Esta semana funcionó bien reforzar “': 'Celebrating “',
  '”. La próxima semana puedes mantener solo 2 deberes si quieres hacerlo más fácil.': '” worked well this week. Next week, you can keep only 2 tasks to make things easier.',
  'Logros de la semana': "This week's wins",
  'Huellitas ganadas': 'Paw prints earned',
  'Deber más reforzado': 'Most celebrated task',
  'Observaciones de la semana': 'Weekly notes',
  'Sirven para descubrir patrones: qué días cuestan más, qué ayudó y qué necesita más apoyo.': 'Use notes to notice patterns: harder days, what helped, and where more support may help.',
  'Ejemplos: “Se durmió tarde”, “Le ayudó tener dos opciones”, “Había mucho ruido”.': 'Examples: “Went to bed late,” “Two choices helped,” “It was very noisy.”',
  'Guardar observación': 'Save note',
  'Escribe una observación corta...': 'Write a short note...',
  'Todavía no hay observaciones esta semana.': 'No notes yet this week.',
  '💡 Recomendación': '💡 Recommendation',
  'Plan familiar de esta semana': "This week's family plan",
  'Perfiles de la familia': 'Family profiles',
  'Cada niño conserva sus propios deberes, huellitas y premio.': 'Each child keeps their own tasks, paw prints, and reward.',
  'Agregar otro niño': 'Add another child',
  'Nombre del niño': "Child's name",
  'Agregar perfil': 'Add profile',
  'Cambiar niño': 'Switch child',
  'Administrar perfiles': 'Manage profiles',
  'Idioma': 'Language',
  'Elige el idioma de OmeKid.': 'Choose the OmeKid language.',
  'Editar perfil del niño': "Edit child's profile",
  'Si necesitas cambiar el nombre, la edad o el avatar, hazlo aquí.': 'Change the name, age, or avatar here.',
  'Nombre': 'Name',
  'Edad': 'Age',
  'Avatar de OmeKid': 'OmeKid avatar',
  'Guardar perfil': 'Save profile',
  'Premio seleccionado': 'Selected reward',
  'Cambiar premio': 'Change reward',
  'Premios personalizados guardados': 'Saved custom rewards',
  'Seleccionado': 'Selected',
  'Quitar': 'Remove',
  'Deberes activos': 'Active tasks',
  'Deberes activos · máximo': 'Active tasks · maximum',
  'deberes': 'tasks',
  'años': 'years old',
  'Guardar': 'Save',
  'Recomendamos empezar con 3. La familia puede crecer a 5 o 7 cuando la rutina ya se sienta fácil.': 'We recommend starting with 3. Families can grow to 5 or 7 when the routine feels easy.',
  'Límite de deberes semanales': 'Weekly task limit',
  'Elige cuántos deberes pueden estar activos esta semana. Manténlo simple cuando la semana esté pesada.': 'Choose how many tasks can be active this week. Keep it simple during harder weeks.',
  'Deber personalizado': 'Custom task',
  'Agrega un deber concreto para esta familia. Si hay espacio, se activa automáticamente.': 'Add a specific task for your family. If there is room, it activates automatically.',
  'Guardar deber': 'Save task',
  'Rutina de la mañana': 'Morning routine',
  'Bañarse sin pelear': 'Calm bath time',
  'Recoger juguetes': 'Pick up toys',
  'Usar voz tranquila': 'Use a calm voice',
  'Hacer tarea': 'Do homework',
  'Cepillarse dientes': 'Brush teeth',
  'Prepararse para la escuela': 'Get ready for school',
  'Ayudar en casa': 'Help at home',
  'Escoger película': 'Choose a movie',
  'Una noche de película en familia': 'A family movie night',
  'Ir al parque': 'Go to the park',
  'Tiempo juntos al aire libre': 'Time together outdoors',
  'Tiempo extra de videojuego': 'Extra video game time',
  'Un poquito extra el sábado': 'A little extra on Saturday',
  'Elegir comida del viernes': "Pick Friday's Dinner",
  'Algo especial en familia': 'Something special together',
  'Una ida al parque de diversiones': 'Go to an amusement park',
  'Una aventura especial en familia': 'A special family adventure',
  'Un peluche': 'A stuffed animal',
  'Elegir un nuevo amigo especial': 'Choose a special new friend',
  'Ir al cine': 'Go to the movies',
  'Disfrutar una película juntos': 'Enjoy a movie together',
  'El líder tranquilo': 'The calm leader',
  'La pensadora': 'The thinker',
  'El protector': 'The protector',
  'El valiente': 'The brave one',
  'El explorador': 'The explorer',
  'El relajado': 'The relaxed one',
  'La creativa': 'The creative one',
  'El más energético': 'The energetic one',
  'Ir a la portada de OmeKid': 'Go to the OmeKid home page',
  'OmeKid · Cada elección cuenta': 'OmeKid · Every choice counts',
  'Observación guardada para la semana.': 'Note saved for the week.'
};

function getLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'es';
}

function languageText(spanish, english) {
  return getLanguage() === 'en' ? english : spanish;
}

function translateToEnglish(value) {
  const text = String(value || '');
  if (englishCopy[text]) return englishCopy[text];

  return text
    .replace(/^¡Hola, (.+)!$/, 'Hi, $1!')
    .replace(/^Deberes de hoy \((\d+) de (\d+)\)$/, "Today's tasks ($1 of $2)")
    .replace(/^(.+) sigue avanzando\.$/, (_, label) => `${translateToEnglish(label)} keeps moving forward.`)
    .replace(/^(\d+) \/ 10 huellitas$/, '$1 / 10 paw prints')
    .replace(/^(\d+) de 10 huellitas$/, '$1 of 10 paw prints')
    .replace(/^(\d+) huellitas ganadas$/, '$1 paw prints earned')
    .replace(/^(\d+) huellitas hacia (.+)$/, (_, count, reward) => `${count} paw prints toward ${translateToEnglish(reward)}`)
    .replace(/^(\d+) esta semana$/, '$1 this week')
    .replace(/^(\d+) huellita esta semana$/, '$1 paw print this week')
    .replace(/^(\d+) huellitas esta semana$/, '$1 paw prints this week')
    .replace(/^Faltan (\d+) huellitas$/, '$1 paw prints to go')
    .replace(/^(\d+) deberes$/, '$1 tasks')
    .replace(/^Deberes activos · máximo (\d+)$/, 'Active tasks · maximum $1')
    .replace(/^Ciclo (\d+) de 3$/, 'Cycle $1 of 3')
    .replace(/^Pausa un momento\.\.\. (\d+)$/, 'Pause for a moment... $1')
    .replace(/^Esta semana funcionó bien reforzar “(.+)”\. La próxima semana puedes mantener solo 2 deberes si quieres hacerlo más fácil\.$/, (_, task) => `Celebrating “${translateToEnglish(task)}” worked well this week. Next week, you can keep only 2 tasks to make things easier.`)
    .replace(/^(.+) años$/, '$1 years old')
    .replace(/^Quitar (.+)$/, 'Remove $1');
}

function translatePageToEnglish(root = document.body) {
  if (!root) return;
  const translateElement = (element) => {
    if (!(element instanceof Element)) return;
    ['placeholder', 'aria-label', 'title'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value) {
        const translated = translateToEnglish(value);
        if (translated !== value) element.setAttribute(attribute, translated);
      }
    });
  };
  translateElement(root);
  root.querySelectorAll?.('*').forEach(translateElement);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const trimmed = node.nodeValue.trim();
    if (trimmed) {
      const translated = translateToEnglish(trimmed);
      if (translated !== trimmed) node.nodeValue = node.nodeValue.replace(trimmed, translated);
    }
    node = walker.nextNode();
  }
}

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
  { id: 'amusement-park', emoji: '🎢', label: 'Una ida al parque de diversiones', desc: 'Una aventura especial en familia' },
  { id: 'plush-toy', emoji: '🧸', label: 'Un peluche', desc: 'Elegir un nuevo amigo especial' },
  { id: 'cinema', emoji: '🍿', label: 'Ir al cine', desc: 'Disfrutar una película juntos' }
];

const supportOptions = [
  { id: 'help', emoji: '❤️', label: 'Ayuda extra', desc: 'Un poco de compañía puede ayudar', color: colors.sky },
  { id: 'calm', emoji: '☁️', label: 'Un momento de calma', desc: 'Primero tranquilidad, después seguimos', color: colors.lavender },
  { id: 'repair', emoji: '🧩', label: 'Arreglar algo', desc: 'Resolver lo ocurrido con cariño', color: colors.mintDark }
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
    { id: 'smaller-goal', emoji: '🌿', label: 'Intentar una versión más sencilla del deber' }
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
    text: 'La prioridad ahora puede ser bajar la intensidad. El límite puede explicarse después.'
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
  help: 'Elige una forma de hacer el deber más fácil. Si tu hijo lo intenta con ayuda, puedes celebrar ese esfuerzo.',
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
  childName: '',
  childAge: '',
  avatar: 'omi',
  goalLimit: DEFAULT_GOAL_LIMIT,
  activeGoals: goalOptions.slice(0, DEFAULT_GOAL_LIMIT),
  weeklyReward: rewardOptions[0].label,
  customGoals: [],
  customRewards: [],
  stamps: [],
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
    borderRadius: 27,
    padding: '17px 20px',
    color: '#fff',
    fontWeight: 900,
    fontSize: 17,
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
  const { data, setData, profiles, addProfile, switchProfile, deleteProfile } = useFamilyData();
  const [language, setLanguage] = useState(getLanguage);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [screen, setScreenState] = useState(() => getScreenFromHash() || 'landing');
  const [registerIntent, setRegisterIntent] = useState('');
  const [celebration, setCelebration] = useState('');
  const registerStampLocks = useRef(new Set());

  const weekStamps = useMemo(() => currentWeekItems(data.stamps), [data.stamps]);

  useEffect(() => {
    document.documentElement.lang = language;
    if (language !== 'en') return undefined;
    translatePageToEnglish();
    const observer = new MutationObserver(() => translatePageToEnglish());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language, screen, celebration]);

  useEffect(() => {
    if (!profiles.length && screen !== 'landing') {
      setShowOnboarding(true);
    }
  }, [profiles.length, screen]);

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
    setCelebration(language === 'en' ? translateToEnglish(message) : message);
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
    return true;
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
    const confirmed = window.confirm(language === 'en'
      ? 'Remove 1 recent paw print? Use this only if it was added by mistake.'
      : '¿Quitar 1 huellita reciente? Usa esto solo si se agregó por error.');
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

  function updateLanguage(nextLanguage) {
    const cleanLanguage = nextLanguage === 'en' ? 'en' : 'es';
    localStorage.setItem(LANGUAGE_KEY, cleanLanguage);
    setLanguage(cleanLanguage);
    window.location.reload();
  }

  const screenProps = {
    data,
    weekStamps,
    addStamp,
    addNote,
    updateGoals,
    addCustomGoal,
    deleteCustomGoal,
    updateGoalLimit,
    updateReward,
    deleteCustomReward,
    updateProfile,
    profiles,
    addProfile,
    switchProfile,
    deleteProfile,
    language,
    updateLanguage,
    undoRecentStamps,
    setScreen,
    openGuide: () => setShowOnboarding(true),
    registerIntent
  };

  if (showOnboarding) {
    return (
      <Onboarding
        language={language}
        updateLanguage={updateLanguage}
        onComplete={(profile) => {
          if (!profiles.length) {
            addProfile(profile || { childName: '', childAge: '', avatar: 'omi' });
          }
          localStorage.setItem(ONBOARDING_KEY, 'complete');
          setShowOnboarding(false);
          setScreen('home');
        }}
        onClose={() => setShowOnboarding(false)}
        canClose={profiles.length > 0}
      />
    );
  }

  if (screen === 'landing') {
    return <LandingScreen onStart={() => {
      if (profiles.length && localStorage.getItem(ONBOARDING_KEY)) setScreen('home');
      else setShowOnboarding(true);
    }} language={language} updateLanguage={updateLanguage} />;
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
    <div className="omekid-app-shell" style={{
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
      <div className="omekid-phone-frame" style={styles.phoneFrame}>
        <StatusBar onLogoClick={() => setScreen('landing')} />
        <div key={screen} className="omekid-scroll-content" style={styles.scrollContent}>
          <Screen {...screenProps} />
        </div>
        <NavBar active={screen === 'adultSupport' ? 'settings' : screen} onChange={setScreen} />
        {celebration && <Celebration message={celebration} />}
      </div>
      <div className="omekid-desktop-caption" style={{ marginTop: 22, fontSize: 12, color: 'rgba(7,24,59,0.52)', textAlign: 'center', fontWeight: 800 }}>
        OmeKid · Hábitos positivos para niños y familias
      </div>
    </div>
  );
}

function Onboarding({ language, updateLanguage, onComplete, onClose, canClose }) {
  const [step, setStep] = useState(0);
  const [profileName, setProfileName] = useState('');
  const [profileAge, setProfileAge] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('omi');
  const [isFinishing, setIsFinishing] = useState(false);
  const pages = [
    {
      eyebrow: languageText('Bienvenido a OmeKid', 'Welcome to OmeKid'),
      title: languageText('Las pequeñas decisiones crean grandes hábitos.', 'Small choices become strong habits.'),
      emoji: '🌟'
    },
    {
      eyebrow: languageText('Paso 1', 'Step 1'),
      title: languageText('Crea el primer perfil de tu hijo o hija.', 'Create your first family profile.'),
      emoji: '👦'
    },
    {
      eyebrow: languageText('Paso 2', 'Step 2'),
      title: languageText('Elige un premio semanal.', 'Choose a weekly reward.'),
      emoji: '🎁'
    },
    {
      eyebrow: languageText('Paso 3', 'Step 3'),
      title: languageText('Elige hasta 3 deberes para enfocarse.', 'Choose up to 3 tasks to focus on.'),
      emoji: '🎯'
    },
    {
      eyebrow: languageText('Paso 4', 'Step 4'),
      title: languageText('Gana huellitas durante la semana para acercarte a tu premio.', 'Earn paw prints throughout the week.'),
      emoji: '🐾'
    },
    {
      eyebrow: languageText('Celebren juntos', 'Celebrate together'),
      title: languageText('Alcanza la meta y celebren en familia.', 'Reach the goal and celebrate together.'),
      emoji: '🏆'
    }
  ];
  const page = pages[step];

  return (
    <main className="onboarding-shell">
      {canClose && (
        <button type="button" className="onboarding-close" onClick={onClose}>
          {languageText('Cerrar', 'Close')}
        </button>
      )}
      <div className="onboarding-language">
        <LanguagePills language={language} updateLanguage={updateLanguage} />
      </div>
      <section className="onboarding-card">
        <img src="/avatars/omi.png" alt="Omi" className="onboarding-omi" />
        <div className="onboarding-icon" aria-hidden="true">{page.emoji}</div>
        <div className="onboarding-eyebrow">{page.eyebrow}</div>
        <h1>{page.title}</h1>
        {step === 1 && (
          <div className="onboarding-profile-form">
            <input
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              placeholder={languageText('Nombre del niño', "Child's name")}
            />
            <input
              value={profileAge}
              onChange={(event) => setProfileAge(event.target.value)}
              inputMode="numeric"
              placeholder={languageText('Edad', 'Age')}
            />
            <div className="onboarding-avatar-row">
              {avatarOptions.slice(0, 4).map((option) => (
                <button key={option.id} type="button" className={profileAvatar === option.id ? 'is-active' : ''} onClick={() => setProfileAvatar(option.id)}>
                  <Avatar emoji={option.id} small />
                </button>
              ))}
            </div>
            <div className="onboarding-profile-optional">
              {languageText('Puedes completar el perfil después en Ajustes.', 'You can finish the profile later in Settings.')}
            </div>
          </div>
        )}
        <div className="onboarding-dots" aria-label={`${step + 1} / ${pages.length}`}>
          {pages.map((_, index) => <span key={index} className={index === step ? 'is-active' : ''} />)}
        </div>
        <button
          type="button"
          className="blue-glass-action onboarding-next"
          onClick={() => {
            if (step !== pages.length - 1) {
              setStep(step + 1);
              return;
            }
            if (isFinishing) return;
            setIsFinishing(true);
            const profile = profileName.trim()
              ? { childName: profileName.trim(), childAge: profileAge.trim(), avatar: profileAvatar }
              : null;
            onComplete(profile);
          }}
          disabled={isFinishing}
        >
          {step === pages.length - 1
            ? languageText('Comenzar', "Let's Begin")
            : languageText('Siguiente', 'Next')}
        </button>
      </section>
    </main>
  );
}

function LandingScreen({ onStart, language, updateLanguage }) {
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
      <div style={{
        position: 'absolute',
        top: 'clamp(16px, 3vh, 28px)',
        right: 'clamp(12px, 3vw, 34px)',
        zIndex: 3
      }}>
        <LanguagePills language={language} updateLanguage={updateLanguage} />
      </div>
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
            filter: 'drop-shadow(0 12px 24px rgba(7,24,59,0.18))'
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

function HomeScreen({ data, weekStamps, addStamp, undoRecentStamps, setScreen, openGuide, profiles, switchProfile }) {
  const progress = Math.min(100, (weekStamps.length / WEEKLY_TARGET) * 100);
  const [stampFeedback, setStampFeedback] = useState(false);
  const [feedbackGoal, setFeedbackGoal] = useState(null);
  const [omiMessage, setOmiMessage] = useState('');
  const stampFeedbackTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(stampFeedbackTimer.current), []);

  function addHomeStamp(goal) {
    if (stampFeedback) return;
    addStamp(goal);
    const messages = OMI_PAW_MESSAGES[getLanguage()];
    setOmiMessage(messages[Math.floor(Math.random() * messages.length)]);
    setFeedbackGoal(goal);
    setStampFeedback(true);
    window.clearTimeout(stampFeedbackTimer.current);
    stampFeedbackTimer.current = window.setTimeout(() => setStampFeedback(false), 3000);
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
            <div style={{ fontSize: 25, fontWeight: 950, color: '#fff', lineHeight: 1.2 }}>
              {data.childName
                ? languageText(`¡Hola, ${data.childName}! 👋`, `Hi, ${data.childName}! 👋`)
                : languageText('¡Hola! 👋', 'Hi! 👋')}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.72)', marginTop: 4 }}>¿Cómo estuvo tu día?</div>
          </div>
          <Avatar emoji={data.avatar} />
        </div>

        {profiles.length > 1 && (
          <div className="profile-switcher">
            {profiles.map((profile) => (
              <button key={profile.id} type="button" className={profile.id === data.id ? 'is-active' : ''} onClick={() => switchProfile(profile.id)}>
                <img src={getAvatar(profile.avatar).image} alt="" />
                <span>{profile.childName || languageText('Mi peque', 'My child')}</span>
              </button>
            ))}
          </div>
        )}

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
              {languageText(`${weekStamps.length} / 10 huellitas`, `${weekStamps.length} / 10 paw prints`)}
            </div>
            <div style={{ marginTop: 11, width: 'min(100%, 220px)' }}>
              <ProgressBar pct={progress} color="linear-gradient(90deg, #D8B8FF, #8C65E8)" height={11} />
              <div style={{ color: 'rgba(255,255,255,0.86)', fontSize: 10, fontWeight: 900, marginTop: 5 }}>
                {languageText(
                  `${Math.max(0, WEEKLY_TARGET - weekStamps.length)} huellitas para el premio`,
                  `${Math.max(0, WEEKLY_TARGET - weekStamps.length)} paw prints to the reward`
                )}
              </div>
            </div>
          </div>
          <div style={{ padding: '8px 4px 2px' }}>
            <WeekDots count={weekStamps.length} />
          </div>
        </div>
      </div>

      <button type="button" className="home-guide-button" onClick={openGuide}>
        <span aria-hidden="true">✨</span>
        <span>
          <strong>{languageText('Cómo usar OmeKid', 'How to use OmeKid')}</strong>
          <small>{languageText('Guía rápida para navegar la app', 'A quick guide to navigate the app')}</small>
        </span>
        <span aria-hidden="true">›</span>
      </button>

      <div style={sectionLabel}>{languageText(
        `Deberes de hoy (${data.activeGoals.length} de ${data.goalLimit})`,
        `Today's tasks (${data.activeGoals.length} of ${data.goalLimit})`
      )}</div>
      {data.activeGoals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          count={goalStampCount(goal, weekStamps)}
          addingPaw={stampFeedback && feedbackGoal?.id === goal.id}
          pawDisabled={stampFeedback}
          onAddPaw={() => addHomeStamp(goal)}
        />
      ))}

      {stampFeedback && (
        <div className="paw-celebration" role="status">
          <div className="paw-celebration-flight">🐾</div>
          <div>
            <strong>{languageText('¡Muy bien!', 'Great Job!')}</strong>
            <span>{languageText(
              `+1 Huellita para ${feedbackGoal?.label || ''}`,
              `+1 Paw Print for ${translateToEnglish(feedbackGoal?.label || '')}`
            )}</span>
            <small>Omi: {omiMessage}</small>
          </div>
          <i aria-hidden="true">✦</i>
        </div>
      )}
      <div style={{
        textAlign: 'center',
        margin: '10px 0 2px'
      }}>
        <div style={{ color: colors.textMuted, fontSize: 11, fontWeight: 900, marginBottom: 6 }}>
          ¿Te equivocaste?
        </div>
        <button type="button" onClick={undoRecentStamps} disabled={data.stamps.length < 1} style={{
          minHeight: 38,
          border: `1.5px solid ${data.stamps.length < 1 ? '#E1E6ED' : colors.lavender + '80'}`,
          borderRadius: 14,
          background: data.stamps.length < 1 ? '#F1F3F6' : 'rgba(255,255,255,0.82)',
          color: data.stamps.length < 1 ? colors.textSoft : '#7452A8',
          fontSize: 12,
          fontWeight: 950,
          padding: '7px 16px',
          cursor: data.stamps.length < 1 ? 'default' : 'pointer',
          boxShadow: data.stamps.length < 1 ? 'none' : '0 5px 14px rgba(116,82,168,0.12)'
        }}>
          Quitar 1 huellita
        </button>
      </div>
      {stampFeedback && (
        <div style={{ textAlign: 'center', color: colors.mintDark, fontSize: 12, fontWeight: 900, margin: '9px 0 4px' }}>
          {languageText(`${feedbackGoal?.label || ''} sigue avanzando.`, `${translateToEnglish(feedbackGoal?.label || '')} keeps moving forward.`)}
        </div>
      )}
      {!stampFeedback && weekStamps.length >= 7 && weekStamps.length < WEEKLY_TARGET && (
        <OmiNote text={languageText('¡Ya casi llegan al premio!', "You're almost at the reward!")} />
      )}
      {!stampFeedback && weekStamps.length >= WEEKLY_TARGET && (
        <OmiNote text={languageText('¡Lo lograron! Es momento de celebrar juntos.', 'You did it! Time to celebrate together.')} />
      )}

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
          <div style={{ fontSize: 12, color: colors.textMuted }}>
            {languageText(`${weekStamps.length} de 10 huellitas`, `${weekStamps.length} of 10 paw prints`)}
          </div>
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

function RegisterScreen({ registerIntent, setScreen }) {
  const [selectedSupport, setSelectedSupport] = useState(supportOptions[0]);
  const [supportStep, setSupportStep] = useState(supportActionOptions.help[0]);
  const decisionRef = useRef(null);
  const adultSupportRef = useRef(null);
  const supportSteps = supportActionOptions[selectedSupport.id] || [];

  useEffect(() => {
    if (!['support', 'adultSupportCard'].includes(registerIntent)) return;
    window.setTimeout(() => {
      const target = registerIntent === 'adultSupportCard' ? adultSupportRef.current : decisionRef.current;
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }, [registerIntent]);

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
            Elige una ayuda para acompañar este momento.
          </div>
        </div>
      </div>

      {
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
                }}
              />
            ))}
          </div>
        </>
      }

      {
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
      }

      {supportSteps.length > 0 && (
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
              {selectedSupport.id === 'repair' ? 'Podemos reconectar' : '¿Cómo puedes ayudar?'}
            </span>
          </div>
          {supportSteps.map((action) => (
            <button key={action.id} type="button" onClick={() => {
              setSupportStep(action);
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
  const [omiRewardMessage, setOmiRewardMessage] = useState('');
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
    setOmiRewardMessage(languageText('¡Gran elección para celebrar juntos!', 'Great choice to celebrate together!'));
    setCustomReward('');
  }

  function chooseReward(reward) {
    updateReward(reward.label);
    setOmiRewardMessage(languageText('¡Ese premio hará especial la semana!', 'That reward will make the week special!'));
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

      {omiRewardMessage && <OmiNote text={omiRewardMessage} />}

      {allRewards.map((reward) => (
        <RewardOption
          key={reward.id}
          reward={reward}
          active={data.weeklyReward === reward.label}
          onClick={() => chooseReward(reward)}
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
          placeholder={languageText('Ejemplo: Desayuno de hot cakes', 'Example: Pancake breakfast')}
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

function SummaryScreen({ data, weekStamps, addNote }) {
  const [observation, setObservation] = useState('');
  const topGoal = getTopGoal(weekStamps, data.activeGoals);
  const notes = currentWeekItems(data.notes || []);
  const rewardEarned = weekStamps.length >= WEEKLY_TARGET;
  const biggestWin = weekStamps.length
    ? languageText(
      `${weekStamps.length} huellitas hacia ${data.weeklyReward}`,
      `${weekStamps.length} paw prints toward ${translateToEnglish(data.weeklyReward)}`
    )
    : languageText('El plan familiar está listo para la primera huellita.', 'The family plan is ready for the first paw print.');

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
                {rewardEarned
                  ? languageText('Premio ganado', 'Reward earned')
                  : languageText(`${weekStamps.length} huellitas ganadas`, `${weekStamps.length} paw prints earned`)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <OmiNote text={rewardEarned
        ? languageText('¡Lo lograron! Celebren este gran paso.', 'You did it! Celebrate this big step.')
        : languageText('Cada huellita cuenta. Sigan avanzando juntos.', 'Every paw print counts. Keep moving forward together.')} />

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
          <VictoryTile emoji="🎁" label="Premio" value={rewardEarned
            ? languageText('Ganado', 'Earned')
            : languageText(
              `Faltan ${Math.max(0, WEEKLY_TARGET - weekStamps.length)} huellitas`,
              `${Math.max(0, WEEKLY_TARGET - weekStamps.length)} paw prints to go`
            )} />
          <VictoryTile emoji="🌟" label="Mayor logro" value={biggestWin} />
          <VictoryTile emoji="🎯" label="Deber favorito" value={topGoal} />
          <VictoryTile emoji="❤️" label="Logro familiar" value="Seguimos avanzando juntos" />
        </div>
      </div>

      <div style={{
        ...styles.card,
        background: 'rgba(255,255,255,0.94)',
        border: `2px solid ${colors.sunYellow}55`
      }}>
        <div style={{ fontSize: 16, fontWeight: 950, color: colors.text, marginBottom: 12 }}>Logros de la semana</div>
        <SummaryMiniRow emoji="🐾" title="Huellitas ganadas" value={languageText(`${weekStamps.length} esta semana`, `${weekStamps.length} this week`)} />
        <SummaryMiniRow emoji="🎯" title="Deber más reforzado" value={topGoal} />
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
          {languageText(
            `Esta semana funcionó bien reforzar “${topGoal}”. La próxima semana puedes mantener solo 2 deberes si quieres hacerlo más fácil.`,
            `Celebrating “${translateToEnglish(topGoal)}” worked well this week. Next week, you can keep only 2 tasks to make things easier.`
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ data, updateGoals, addCustomGoal, deleteCustomGoal, updateGoalLimit, updateReward, deleteCustomReward, updateProfile, profiles, addProfile, switchProfile, deleteProfile, language, updateLanguage, setScreen }) {
  const [name, setName] = useState(data.childName);
  const [age, setAge] = useState(data.childAge);
  const [avatar, setAvatar] = useState(data.avatar);
  const [newProfileName, setNewProfileName] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [customReward, setCustomReward] = useState('');
  const allGoals = [...goalOptions, ...(data.customGoals || [])];
  const allRewards = [
    ...rewardOptions.map((reward) => ({ ...reward, custom: false })),
    ...(data.customRewards || []).map((reward) => ({ ...reward, custom: true }))
  ];

  useEffect(() => {
    setName(data.childName);
    setAge(data.childAge);
    setAvatar(data.avatar);
  }, [data.id]);

  function saveProfile() {
    updateProfile({ childName: name.trim() || data.childName, childAge: age.trim(), avatar });
  }

  function saveNewProfile() {
    const childName = newProfileName.trim();
    if (!childName) return;
    addProfile({
      childName,
      childAge: '',
      avatar: avatarOptions[profiles.length % avatarOptions.length].id
    });
    setNewProfileName('');
  }

  function removeProfile(profile) {
    const profileName = profile.childName || languageText('este perfil', 'this profile');
    const confirmed = window.confirm(language === 'en'
      ? `Remove ${profileName} from this device?`
      : `¿Quitar ${profileName} de este dispositivo?`);
    if (confirmed) deleteProfile(profile.id);
  }

  function saveCustomGoal() {
    addCustomGoal(customGoal);
    setCustomGoal('');
  }

  function saveCustomReward() {
    const reward = customReward.trim();
    if (!reward) return;
    updateReward(reward, { id: crypto.randomUUID(), emoji: '✨', label: reward, desc: 'Premio personalizado' });
    setCustomReward('');
  }

  function removeCustomReward(reward) {
    const confirmed = window.confirm(getLanguage() === 'en'
      ? `Remove the custom reward “${reward.label}”?`
      : `¿Quitar el premio personalizado “${reward.label}”?`);
    if (!confirmed) return;
    deleteCustomReward(reward.id);
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: colors.text }}>Ajustes</div>
          <LanguagePills language={language} updateLanguage={updateLanguage} />
        </div>
        <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>Plan familiar de esta semana</div>
      </div>

      <div style={styles.card}>
        <div style={{ fontSize: 16, fontWeight: 900, color: colors.text }}>Perfiles de la familia</div>
        <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 1.45 }}>
          Cada niño conserva sus propios deberes, huellitas y premio.
        </div>
        <div className="family-profile-list">
          {profiles.map((profile) => (
            <div key={profile.id} className={`family-profile-row ${profile.id === data.id ? 'is-active' : ''}`}>
              <button type="button" onClick={() => switchProfile(profile.id)}>
                <img src={getAvatar(profile.avatar).image} alt="" />
                <span>
                  <strong>{profile.childName || languageText('Perfil sin nombre', 'Unnamed profile')}</strong>
                  <small>{profile.id === data.id ? languageText('Perfil activo', 'Active profile') : languageText('Cambiar a este niño', 'Switch to this child')}</small>
                </span>
              </button>
              {profiles.length > 1 && (
                <button type="button" className="family-profile-remove" onClick={() => removeProfile(profile)} aria-label={languageText(`Quitar ${profile.childName || 'perfil sin nombre'}`, `Remove ${profile.childName || 'unnamed profile'}`)}>
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 950, color: colors.text, marginTop: 15 }}>Agregar otro niño</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 7 }}>
          <input
            value={newProfileName}
            onChange={(event) => setNewProfileName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') saveNewProfile();
            }}
            placeholder={languageText('Nombre del niño', "Child's name")}
            style={{
              minWidth: 0,
              flex: 1,
              border: '2px solid #DDE5F0',
              borderRadius: 14,
              minHeight: 44,
              padding: '0 11px',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
          <button type="button" className={newProfileName.trim() ? 'blue-glass-action' : ''} onClick={saveNewProfile} disabled={!newProfileName.trim()} style={{
            minWidth: 94,
            border: 'none',
            borderRadius: 14,
            background: newProfileName.trim() ? BLUE_GLASS_BACKGROUND : '#E8ECF0',
            color: newProfileName.trim() ? '#fff' : colors.textSoft,
            fontWeight: 950,
            boxShadow: newProfileName.trim() ? BLUE_GLASS_SHADOW : 'none'
          }}>Agregar perfil</button>
        </div>
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
            <div style={{ fontWeight: 900, fontSize: 16, color: colors.text }}>
              {name.trim() || data.childName || languageText('Perfil sin nombre', 'Unnamed profile')}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              {age.trim() || data.childAge
                ? languageText(`${age.trim() || data.childAge} años`, `${age.trim() || data.childAge} years old`)
                : languageText('Edad pendiente', 'Age not set')}
            </div>
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

      <div style={sectionLabel}>Premio de la semana</div>
      <div style={{
        ...styles.card,
        padding: '16px 18px',
        border: `2px solid ${colors.lavender}55`,
        background: `linear-gradient(135deg, ${colors.lavLight}, rgba(255,255,255,0.94))`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: '#fff', display: 'grid', placeItems: 'center', fontSize: 25, boxShadow: '0 4px 12px rgba(45,55,72,0.08)' }}>🎁</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: colors.textMuted }}>Premio seleccionado</div>
            <div style={{ fontSize: 15, fontWeight: 950, color: colors.text, marginTop: 2 }}>{data.weeklyReward}</div>
          </div>
        </div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: colors.textMuted, marginBottom: 6 }} htmlFor="weekly-reward-select">
          Cambiar premio
        </label>
        <select id="weekly-reward-select" value={data.weeklyReward} onChange={(event) => updateReward(event.target.value)} style={{
          width: '100%',
          minHeight: 46,
          border: '2px solid #DDE5F0',
          borderRadius: 15,
          background: '#fff',
          color: colors.text,
          padding: '0 11px',
          fontFamily: 'inherit',
          fontWeight: 850,
          outline: 'none'
        }}>
          {allRewards.map((reward) => <option key={reward.id} value={reward.label}>{reward.emoji} {reward.label}</option>)}
        </select>
        <div style={{ fontSize: 12, fontWeight: 950, color: colors.text, marginTop: 16 }}>Premio personalizado</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 7 }}>
          <input
            value={customReward}
            onChange={(event) => setCustomReward(event.target.value)}
            placeholder={languageText('Ejemplo: Desayuno de hot cakes', 'Example: Pancake breakfast')}
            style={{
              minWidth: 0,
              flex: 1,
              border: '2px solid #DDE5F0',
              borderRadius: 14,
              minHeight: 44,
              padding: '0 11px',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
          <button type="button" className={customReward.trim() ? 'blue-glass-action' : ''} onClick={saveCustomReward} disabled={!customReward.trim()} style={{
            minWidth: 86,
            border: 'none',
            borderRadius: 14,
            background: customReward.trim() ? BLUE_GLASS_BACKGROUND : '#E8ECF0',
            color: customReward.trim() ? '#fff' : colors.textSoft,
            fontWeight: 950,
            boxShadow: customReward.trim() ? BLUE_GLASS_SHADOW : 'none'
          }}>Guardar</button>
        </div>
        {(data.customRewards || []).length > 0 && (
          <div style={{ marginTop: 16, borderTop: '1.5px solid rgba(185,155,234,0.3)', paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 950, color: colors.textMuted, marginBottom: 7 }}>
              Premios personalizados guardados
            </div>
            {(data.customRewards || []).map((reward) => (
              <div key={reward.id} style={{
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '7px 8px 7px 11px',
                borderTop: '1px solid rgba(221,229,240,0.82)'
              }}>
                <span style={{ fontSize: 18 }}>{reward.emoji || '✨'}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 900, color: colors.text }}>{reward.label}</span>
                {data.weeklyReward === reward.label && (
                  <span style={{ fontSize: 10, fontWeight: 950, color: '#176DCA' }}>Seleccionado</span>
                )}
                <button type="button" onClick={() => removeCustomReward(reward)} aria-label={`Quitar ${reward.label}`} style={{
                  minHeight: 32,
                  border: '1.5px solid #D7DEEA',
                  borderRadius: 11,
                  background: '#fff',
                  color: colors.textMuted,
                  padding: '5px 9px',
                  fontSize: 11,
                  fontWeight: 950
                }}>Quitar</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={sectionLabel}>
        {languageText(`Deberes activos · máximo ${data.goalLimit}`, `Active tasks · maximum ${data.goalLimit}`)}
      </div>
      <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 700, lineHeight: 1.45, margin: '-4px 0 12px' }}>
        Recomendamos empezar con 3. La familia puede crecer a 5 o 7 cuando la rutina ya se sienta fácil.
      </div>

      <div style={{
        ...styles.card,
        padding: '14px 16px',
        border: '2px solid #EEF0F4'
      }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: colors.text, marginBottom: 4 }}>Límite de deberes semanales</div>
        <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 700, lineHeight: 1.4, marginBottom: 12 }}>
          Elige cuántos deberes pueden estar activos esta semana. Manténlo simple cuando la semana esté pesada.
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
              {languageText(`${limit} deberes`, `${limit} tasks`)}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        ...styles.card,
        padding: '16px 18px',
        border: '2px dashed rgba(78,143,84,0.34)'
      }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: colors.text }}>Deber personalizado</div>
        <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 700, lineHeight: 1.4, marginTop: 4 }}>
          Agrega un deber concreto para esta familia. Si hay espacio, se activa automáticamente.
        </div>
        <input
          value={customGoal}
          onChange={(event) => setCustomGoal(event.target.value)}
          placeholder={languageText('Ejemplo: Bañarse sin pelear', 'Example: Bath time without arguing')}
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
        }}>Guardar deber</button>
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

function LanguagePills({ language, updateLanguage }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: 4,
      borderRadius: 999,
      background: 'rgba(255,255,255,0.72)',
      border: '1px solid rgba(139,182,241,0.42)',
      boxShadow: '0 8px 24px rgba(7,24,59,0.14)',
      backdropFilter: 'blur(14px)',
      flexShrink: 0
    }}>
      {[
        { id: 'en', label: 'English' },
        { id: 'es', label: 'Español' }
      ].map((option) => {
        const active = language === option.id;
        return (
          <button key={option.id} type="button" onClick={() => updateLanguage(option.id)} style={{
            minHeight: 34,
            padding: '0 13px',
            border: active ? '1px solid rgba(190,235,255,0.94)' : '1px solid transparent',
            borderRadius: 999,
            background: active ? BLUE_GLASS_BACKGROUND : 'transparent',
            color: active ? '#fff' : colors.text,
            fontFamily: 'inherit',
            fontSize: 11,
            fontWeight: 950,
            boxShadow: active ? '0 5px 12px rgba(20,104,225,0.26), inset 0 1px 0 rgba(255,255,255,0.56)' : 'none',
            cursor: 'pointer'
          }}>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function NavBar({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'register', icon: 'heart', label: 'Ayuda' },
    { id: 'rewards', icon: 'gift', label: 'Premios' },
    { id: 'summary', icon: 'chart', label: 'Semana' },
    { id: 'settings', icon: 'user', label: 'Ajustes' }
  ];

  return (
    <div className="omekid-nav-bar" style={styles.navBar}>
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)} type="button" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          cursor: 'pointer',
          padding: '4px 8px',
          opacity: 1,
          transition: 'all 0.2s',
          background: 'transparent',
          border: 'none'
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: active === tab.id ? 'linear-gradient(145deg, rgba(139,211,255,0.96), rgba(26,119,224,1))' : 'rgba(255,255,255,0.84)',
            border: active === tab.id ? '1.5px solid #0B4FA4' : '1.5px solid #AEBACB',
            boxShadow: active === tab.id ? '0 5px 12px rgba(23,109,202,0.28)' : '0 2px 5px rgba(18,33,64,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name={tab.icon} size={20} color={active === tab.id ? '#fff' : '#31435F'} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 900, color: active === tab.id ? '#125BAF' : '#506078' }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function StatusBar({ onLogoClick }) {
  return (
    <div className="omekid-status-bar" style={styles.statusBar}>
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
          filter: 'none'
        }} />
      </button>
      <div className="omekid-fake-system-status" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
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
          Elige un deber, celebra el avance o acompaña con apoyo.
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

function GoalCard({ goal, count, dark = false, selected = false, onClick, onAddPaw, addingPaw = false, pawDisabled = false }) {
  const hasStamps = count > 0;
  const activeColor = colors.mintDark;
  const visualColor = selected ? activeColor : goal.color;

  return (
    <div onClick={onClick} style={{
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
          <span>{languageText(
            `${count} ${count === 1 ? 'huellita' : 'huellitas'} esta semana`,
            `${count} ${count === 1 ? 'paw print' : 'paw prints'} this week`
          )}</span>
        </div>
      </div>
      {onAddPaw ? (
        <button
          type="button"
          className={`goal-paw-button blue-glass-action${addingPaw ? ' goal-paw-button-success' : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            onAddPaw();
          }}
          disabled={pawDisabled}
          aria-label={languageText(`Agregar huellita a ${goal.label}`, `Add paw print for ${translateToEnglish(goal.label)}`)}
        >
          <span>{addingPaw ? '✓' : '+'}</span>
          <span>{addingPaw ? '✨' : '🐾'}</span>
        </button>
      ) : (
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
      )}
    </div>
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

function OmiNote({ text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      margin: '10px 0 14px',
      borderRadius: 18,
      background: 'linear-gradient(135deg, rgba(231,240,255,0.96), rgba(240,232,255,0.92))',
      border: '1px solid rgba(139,182,241,0.34)',
      boxShadow: '0 8px 20px rgba(30,85,170,0.1)'
    }}>
      <img src="/avatars/omi.png" alt="Omi" style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        objectFit: 'cover',
        flexShrink: 0,
        border: '2px solid rgba(100,190,255,0.62)'
      }} />
      <div style={{ color: colors.text, fontSize: 12, lineHeight: 1.35, fontWeight: 900 }}>
        <span style={{ color: '#176DCA' }}>Omi:</span> {text}
      </div>
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
    heart: <path d="M20.8 4.7a5.4 5.4 0 0 0-7.7 0L12 5.8l-1.1-1.1a5.4 5.4 0 1 0-7.7 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6z" strokeWidth="2" stroke={color} fill={color} fillOpacity="0.18" strokeLinecap="round" strokeLinejoin="round" />,
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
  if (!stamps.length) return goals[0]?.label || 'un deber sencillo';
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
  const language = getLanguage();
  const month = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es', { month: 'long' }).format(end);
  return language === 'en'
    ? `${month} ${start.getDate()} – ${end.getDate()}`
    : `${start.getDate()} – ${end.getDate()} de ${month}`;
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat(getLanguage() === 'en' ? 'en-US' : 'es', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(value));
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
    "Pick Friday's Dinner": 'Elegir comida del viernes',
    'Campout night': 'Una ida al parque de diversiones',
    'Noche de campamento': 'Una ida al parque de diversiones'
  };
  return englishToSpanish[label] || label || rewardOptions[0].label;
}

function useFamilyData() {
  const [family, setFamily] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAMILY_STORAGE_KEY));
      const profiles = Array.isArray(saved?.profiles)
        ? saved.profiles.map((profile) => normalizeData(profile))
        : [];
      const activeProfileId = profiles.some((profile) => profile.id === saved?.activeProfileId)
        ? saved.activeProfileId
        : profiles[0]?.id || null;
      return { profiles, activeProfileId };
    } catch {
      return { profiles: [], activeProfileId: null };
    }
  });

  const data = family.profiles.find((profile) => profile.id === family.activeProfileId)
    || family.profiles[0]
    || normalizeData({ ...defaultData, id: 'preview-profile' });

  function saveFamily(nextFamily) {
    localStorage.setItem(FAMILY_STORAGE_KEY, JSON.stringify(nextFamily));
    return nextFamily;
  }

  function setData(nextData) {
    setFamily((currentFamily) => {
      const currentProfile = currentFamily.profiles.find((profile) => profile.id === currentFamily.activeProfileId)
        || currentFamily.profiles[0];
      if (!currentProfile) return currentFamily;
      const resolvedData = typeof nextData === 'function' ? nextData(currentProfile) : nextData;
      const cleanData = normalizeData({ ...resolvedData, id: currentProfile.id });
      return saveFamily({
        ...currentFamily,
        activeProfileId: currentProfile.id,
        profiles: currentFamily.profiles.map((profile) => profile.id === currentProfile.id ? cleanData : profile)
      });
    });
  }

  function addProfile(profile) {
    const cleanProfile = normalizeData({
      ...defaultData,
      ...profile,
      id: crypto.randomUUID(),
      customGoals: [],
      customRewards: [],
      stamps: [],
      notes: []
    });
    setFamily((currentFamily) => saveFamily({
      profiles: [...currentFamily.profiles, cleanProfile],
      activeProfileId: cleanProfile.id
    }));
  }

  function switchProfile(profileId) {
    setFamily((currentFamily) => {
      if (!currentFamily.profiles.some((profile) => profile.id === profileId)) return currentFamily;
      return saveFamily({ ...currentFamily, activeProfileId: profileId });
    });
  }

  function deleteProfile(profileId) {
    setFamily((currentFamily) => {
      const profiles = currentFamily.profiles.filter((profile) => profile.id !== profileId);
      return saveFamily({
        profiles,
        activeProfileId: currentFamily.activeProfileId === profileId
          ? profiles[0]?.id || null
          : currentFamily.activeProfileId
      });
    });
  }

  return {
    data,
    setData,
    profiles: family.profiles,
    activeProfileId: family.activeProfileId,
    addProfile,
    switchProfile,
    deleteProfile
  };
}

function normalizeData(value) {
  const goalLimit = getGoalLimit(value?.goalLimit);
  const defaultActiveGoals = getDefaultActiveGoals(goalLimit);
  const savedGoals = Array.isArray(value?.activeGoals)
    ? value.activeGoals.map(normalizeGoal)
    : defaultActiveGoals;
  const activeGoals = shouldUseDefaultTestGoals(value?.activeGoals)
    ? defaultActiveGoals
    : savedGoals.slice(0, goalLimit);
  const normalizedData = {
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
    notes: Array.isArray(value?.notes) ? value.notes : []
  };
  delete normalizedData.supportLogs;
  return normalizedData;
}

function getDefaultActiveGoals(goalLimit = DEFAULT_GOAL_LIMIT) {
  const defaultIds = ['morning-routine', 'bath-no-fight', 'pick-up-toys'];
  return defaultIds.map(getGoalById).filter(Boolean).slice(0, goalLimit);
}

function shouldUseDefaultTestGoals(activeGoals) {
  if (!Array.isArray(activeGoals)) return false;
  const activeIds = activeGoals.map((goal) => goal?.id).filter(Boolean).sort();
  const legacyDefaultIds = ['calm-voice', 'homework', 'pick-up-toys'].sort();
  return activeIds.length === legacyDefaultIds.length
    && activeIds.every((id, index) => id === legacyDefaultIds[index]);
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
