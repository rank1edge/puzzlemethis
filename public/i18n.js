// Interface text in every language the game supports.
//
// English lives here; every other language is one file in locales/ with its
// interface text (`ui`, same keys as `en` below), its fonts if the default ones
// don't cover its script, and its painting texts (`paintings`, same ids and
// fields as paintings.js).
//
// Adding a language: copy a locales/ file, translate it, import it below and
// add it to LOCALES (and to MODULES in scripts/build-artifact.js).
// Missing keys fall back to English, so a half-finished file still works.
//
// Values may contain {placeholders}. A value can also be an object of plural
// forms ({ one, few, many, other }), chosen by Intl.PluralRules from vars.n.

import { LOCALE_FR } from './locales/fr.js';
import { LOCALE_IT } from './locales/it.js';
import { LOCALE_DE } from './locales/de.js';
import { LOCALE_RU } from './locales/ru.js';
import { LOCALE_JA } from './locales/ja.js';

// Order here is the order in the language dropdown.
const LOCALES = [LOCALE_FR, LOCALE_DE, LOCALE_IT, LOCALE_RU, LOCALE_JA];

export const LANGUAGES = [{ code: 'en', name: 'English' }]
  .concat(LOCALES.map(l => ({ code: l.code, name: l.name, fonts: l.fonts })));

// painting titles, artists, dates, media, museums and stories, per language
export const PAINTING_TEXT = Object.fromEntries(LOCALES.map(l => [l.code, l.paintings || {}]));

const STRINGS = {
  en: {
    'app.tagline': 'Sixteen famous paintings to piece together',
    'stats.mainMenu': 'Main menu',
    'stats.round': 'Round',
    'stats.placed': 'placed',
    'btn.menu': '← Main menu',
    'btn.menu.title': 'Leave this table and go back to the main menu',
    'btn.story': 'Story',
    'btn.gallery': 'Paintings',
    'btn.guide': 'Guide',
    'btn.guide.title': 'Show a faint copy of the painting on the board. When off, the board shows a soft blur.',
    'btn.guide.hardTitle': 'Hard level always uses the blurred board',
    'btn.tidy': 'Tidy',
    'btn.tidy.title': 'Spread the loose pieces around the board again',
    'btn.sound': 'Sound',
    'lang.label': 'Language',
    'canvas.label': 'Jigsaw puzzle table. Drag pieces onto the board.',
    'hint': 'Drag a piece onto the board. It settles in when it’s close.',

    'after.finished': 'Finished',
    'after.next': 'Next painting →',
    'after.story': 'Read the story',
    'after.wait': 'Waiting for {name} to choose the next painting',

    'menu.eyebrow': 'A slow game of famous paintings',
    'menu.lede': 'Piece together sixteen masterpieces, from Leonardo to Hokusai, alone or with friends at the same table. Each finished painting comes with its story.',
    'menu.name': 'Your name',
    'menu.name.placeholder': 'Type your name',
    'menu.colours': 'Avatar colour',
    'menu.colour': 'Colour {n}',
    'menu.level': 'Level',
    'level.easy': 'Easy',
    'level.medium': 'Medium',
    'level.hard': 'Hard',
    'level.easy.note': 'about 16 pieces',
    'level.medium.note': 'about 36 pieces',
    'level.hard.note': 'about 100, blurred guide',
    'menu.start': 'Start a table',
    'menu.or': 'or join a friend’s table',
    'menu.code.placeholder': 'Code',
    'menu.code.label': 'Table code',
    'menu.join': 'Join',
    'menu.joinNote': 'You’ll play at your friend’s level.',
    'menu.ownTable': 'Start my own table instead',
    'menu.banner.title': 'You’re invited to table {code}',
    'menu.banner.text': 'Type your name and press Join. You’ll play at the leader’s level.',

    'pop.eyebrow': 'You’re invited',
    'pop.title': 'Join table {code}',
    'pop.note': 'A friend sent you a link to their table. You’ll play at their level.',
    'pop.close': 'Close and go to the main menu',
    'pop.code': 'Table code',
    'pop.join': 'Join table',

    'card.close': 'Close',
    'info.story': 'The story',
    'info.roundDone': 'Round {n} complete',
    'info.artist': 'Artist',
    'info.made': 'Made',
    'info.medium': 'Medium',
    'info.home': 'Home',
    'info.yourTime': 'Your time',
    'info.tableTime': 'Table time',
    'info.level': 'Level',
    'info.levelValue': { one: '{level} · {n} piece', other: '{level} · {n} pieces' },
    'info.next': 'Next painting',
    'info.admire': 'Admire the painting',
    'info.wait': 'Waiting for {name} to choose the next painting.',

    'gal.eyebrow': 'The collection',
    'gal.title': 'Choose a painting',
    'gal.note': 'Your current puzzle is set aside and the one you pick starts as a new round at the same level, for everyone at the table.',
    'gal.noteFollower': 'Only {name}, the table leader, can choose the painting. You can browse the collection here.',
    'gal.solved': 'Solved',

    'inv.eyebrow': 'Play together',
    'inv.title': 'Invite friends',
    'inv.copyLink': 'Copy link',
    'inv.copyCode': 'Copy code',
    'inv.linkCopied': 'Link copied',
    'inv.codeCopied': 'Code copied',
    'inv.selected': 'Selected. Copy it to send.',
    'inv.step1': 'Send the link. It opens this table, so friends only type their name and press Join.',
    'inv.step2': 'Or send the code. Friends open the game and enter it under “Join a friend’s table”.',
    'inv.step3': 'You lead the table: you choose each painting and can remove anyone who joins.',
    'inv.claudeNote': 'The page is private until you share it with your friends from the Share menu. They need contributor or edit access to move pieces; with view-only access they can watch.',
    'inv.count': { one: '{n} person is at this table now.', other: '{n} people are at this table now.' },
    'inv.alone': 'Nobody else is here yet.',
    'inv.off': 'Tables can’t connect here, so inviting friends isn’t available. You can keep playing on your own.',

    'exit.eyebrow': 'Main menu',
    'exit.title': 'Leave this table?',
    'exit.stay': 'Keep playing',
    'exit.go': 'Exit to main menu',
    'progress.you': { one: 'You’ve placed {placed} of {n} piece of {title}.', other: 'You’ve placed {placed} of {n} pieces of {title}.' },
    'progress.table': { one: 'Your table has placed {placed} of {n} piece of {title}.', other: 'Your table has placed {placed} of {n} pieces of {title}.' },
    'exit.friendLeads': 'Your friend keeps playing, and the next person takes over as leader.',
    'exit.friendsLead': 'Your {n} friends keep playing, and the next person takes over as leader.',
    'exit.friend': 'Your friend keeps playing without you.',
    'exit.friends': 'Your {n} friends keep playing without you.',
    'exit.rejoin': 'You can rejoin with the table code {code}.',
    'exit.notSaved': 'Your puzzle won’t be saved.',

    'switch.eyebrow': 'Puzzle in progress',
    'switch.titleNew': 'Start {title}?',
    'switch.titleSame': 'Start {title} again?',
    'switch.clears': 'Starting a new painting clears them.',
    'switch.clearsTable': 'Starting a new painting clears them for everyone at the table.',
    'switch.mixes': 'Starting again mixes them all up.',
    'switch.mixesTable': 'Starting again mixes them all up for everyone at the table.',
    'switch.keep': 'Keep playing {title}',
    'switch.go': 'Start {title}',
    'switch.again': 'Start again',

    'kick.eyebrow': 'Table leader',
    'kick.title': 'Remove {name}?',
    'kick.thisPlayer': 'this player',
    'kick.note': 'They leave the table straight away and can’t rejoin this table. Pieces they placed stay on the board.',
    'kick.yes': 'Remove from table',
    'kick.no': 'Keep playing together',

    'players.you': 'you',
    'players.leader': 'leader',
    'players.guest': 'guest',
    'players.friend': 'Friend',
    'players.invite': 'Invite friends',
    'players.remove': 'Remove {name} from the table',
    'players.watching': 'Watching only: you need edit access to move pieces',
    'leader.fallback': 'The leader',

    'msg.needName': 'Type your name first, so friends know who you are.',
    'msg.setting': 'Setting the table…',
    'msg.codeLength': 'A table code has 5 letters and numbers.',
    'msg.looking': 'Looking for table {code}…',
    'msg.noRooms': 'Tables can’t connect in this view. You can still start your own table and play alone.',
    'msg.banned': '{name} removed you from table {code}, so you can’t rejoin it.',
    'msg.nobody': 'Nobody is at table {code} right now. Check the code with your friend, or start your own table.',
    'msg.removed': '{name} removed you from the table.'
  }
};

for (const l of LOCALES) STRINGS[l.code] = l.ui;

let current = 'en';
let plural = new Intl.PluralRules('en');

export function currentLang() { return current; }
export function hasLang(code) { return LANGUAGES.some(l => l.code === code); }

// The saved choice, else the browser's preferred language if we have it, else English.
export function pickInitialLang(saved) {
  if (saved && hasLang(saved)) return saved;
  for (const tag of (navigator.languages || [navigator.language || 'en'])) {
    const base = String(tag).toLowerCase().split('-')[0];
    if (hasLang(base)) return base;
  }
  return 'en';
}

export function setLang(code) {
  current = hasLang(code) ? code : 'en';
  plural = new Intl.PluralRules(current);
  document.documentElement.lang = current;
  const lang = LANGUAGES.find(l => l.code === current);
  const root = document.documentElement.style;
  if (lang.fonts) {
    root.setProperty('--display', lang.fonts.display);
    root.setProperty('--body', lang.fonts.body);
    if (lang.fonts.css && !document.querySelector('link[data-font="' + current + '"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = lang.fonts.css; link.dataset.font = current;
      document.head.appendChild(link);
    }
  } else {
    root.removeProperty('--display');
    root.removeProperty('--body');
  }
  return current;
}

// t('msg.looking', { code: 'ABCDE' }) -> 'Looking for table ABCDE…'
export function t(key, vars = {}) {
  let s = (STRINGS[current] && STRINGS[current][key]) ?? STRINGS.en[key] ?? key;
  if (s && typeof s === 'object') s = s[plural.select(Number(vars.n) || 0)] ?? s.other;
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
}

// Fill in every element marked with data-i18n (text), data-i18n-placeholder,
// data-i18n-title or data-i18n-label (aria-label).
export function translatePage(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  root.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  root.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nLabel)); });
}

// for tests: every key each language is missing compared with English
export function missingKeys() {
  const out = {};
  for (const { code } of LANGUAGES) out[code] = Object.keys(STRINGS.en).filter(k => !(STRINGS[code] && k in STRINGS[code]));
  return out;
}
