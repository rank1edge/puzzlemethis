// Interface text in every language the game supports.
//
// Adding a language (French, Italian, German, Japanese, ...):
//   1. add it to LANGUAGES, with fonts that cover its script if the default
//      fonts don't (Japanese needs its own, for example),
//   2. add a dictionary to STRINGS with the same keys as `en`,
//   3. optionally add painting texts (see paintings.ru.js) to PAINTING_TEXT in game.js.
// Missing keys fall back to English, so a half-finished dictionary still works.
//
// Values may contain {placeholders}. A value can also be an object of plural
// forms ({ one, few, many, other }), chosen by Intl.PluralRules from vars.n.

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский',
    // Marcellus and Karla have no Cyrillic: Forum and Golos Text keep the same feel
    fonts: { display: '"Forum", "Marcellus", Georgia, serif', body: '"Golos Text", "Karla", system-ui, sans-serif',
             css: 'https://fonts.googleapis.com/css2?family=Forum&family=Golos+Text:wght@400;500;700&display=swap' } }
];

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
  },

  ru: {
    'app.tagline': 'Шестнадцать знаменитых картин, которые нужно собрать',
    'stats.mainMenu': 'Главное меню',
    'stats.round': 'Раунд',
    'stats.placed': 'на месте',
    'btn.menu': '← Главное меню',
    'btn.menu.title': 'Покинуть стол и вернуться в главное меню',
    'btn.story': 'История',
    'btn.gallery': 'Картины',
    'btn.guide': 'Подсказка',
    'btn.guide.title': 'Показывать на поле бледную копию картины. Если выключить, поле будет размытым.',
    'btn.guide.hardTitle': 'На сложном уровне поле всегда размыто',
    'btn.tidy': 'Разложить',
    'btn.tidy.title': 'Снова разложить свободные фрагменты вокруг поля',
    'btn.sound': 'Звук',
    'lang.label': 'Язык',
    'canvas.label': 'Стол с пазлом. Перетаскивайте фрагменты на поле.',
    'hint': 'Перетащите фрагмент на поле — рядом со своим местом он встанет сам.',

    'after.finished': 'Готово',
    'after.next': 'Следующая картина →',
    'after.story': 'Прочитать историю',
    'after.wait': 'Следующую картину выбирает {name}',

    'menu.eyebrow': 'Неспешная игра со знаменитыми картинами',
    'menu.lede': 'Соберите шестнадцать шедевров — от Леонардо до Хокусая — в одиночку или с друзьями за одним столом. К каждой собранной картине прилагается её история.',
    'menu.name': 'Ваше имя',
    'menu.name.placeholder': 'Введите имя',
    'menu.colours': 'Цвет аватара',
    'menu.colour': 'Цвет {n}',
    'menu.level': 'Уровень',
    'level.easy': 'Лёгкий',
    'level.medium': 'Средний',
    'level.hard': 'Сложный',
    'level.easy.note': 'около 16 фрагментов',
    'level.medium.note': 'около 36 фрагментов',
    'level.hard.note': 'около 100, размытая подсказка',
    'menu.start': 'Открыть стол',
    'menu.or': 'или сядьте за стол друга',
    'menu.code.placeholder': 'Код',
    'menu.code.label': 'Код стола',
    'menu.join': 'Войти',
    'menu.joinNote': 'Уровень сложности задаёт тот, кто открыл стол.',
    'menu.ownTable': 'Лучше открыть свой стол',
    'menu.banner.title': 'Вас приглашают за стол {code}',
    'menu.banner.text': 'Введите имя и нажмите «Войти». Уровень сложности задаёт ведущий стола.',

    'pop.eyebrow': 'Вас пригласили',
    'pop.title': 'Стол {code}',
    'pop.note': 'Друг прислал вам ссылку на свой стол. Уровень сложности задаёт ведущий стола.',
    'pop.close': 'Закрыть и перейти в главное меню',
    'pop.code': 'Код стола',
    'pop.join': 'Сесть за стол',

    'card.close': 'Закрыть',
    'info.story': 'История',
    'info.roundDone': 'Раунд {n} завершён',
    'info.artist': 'Художник',
    'info.made': 'Создана',
    'info.medium': 'Техника',
    'info.home': 'Где хранится',
    'info.yourTime': 'Ваше время',
    'info.tableTime': 'Время стола',
    'info.level': 'Уровень',
    'info.levelValue': { one: '{level} · {n} фрагмент', few: '{level} · {n} фрагмента', many: '{level} · {n} фрагментов', other: '{level} · {n} фрагмента' },
    'info.next': 'Следующая картина',
    'info.admire': 'Полюбоваться картиной',
    'info.wait': 'Следующую картину выбирает {name}.',

    'gal.eyebrow': 'Коллекция',
    'gal.title': 'Выберите картину',
    'gal.note': 'Текущий пазл откладывается, а выбранная картина начнётся новым раундом того же уровня — у всех за столом.',
    'gal.noteFollower': 'Картину выбирает ведущий стола — {name}. Здесь можно просто посмотреть коллекцию.',
    'gal.solved': 'Собрана',

    'inv.eyebrow': 'Играть вместе',
    'inv.title': 'Пригласить друзей',
    'inv.copyLink': 'Скопировать ссылку',
    'inv.copyCode': 'Скопировать код',
    'inv.linkCopied': 'Ссылка скопирована',
    'inv.codeCopied': 'Код скопирован',
    'inv.selected': 'Выделено — скопируйте и отправьте.',
    'inv.step1': 'Отправьте ссылку. Она открывает этот стол — друзьям останется ввести имя и нажать «Сесть за стол».',
    'inv.step2': 'Или отправьте код. Друзья откроют игру и введут его в поле «или сядьте за стол друга».',
    'inv.step3': 'Вы ведущий стола: вы выбираете картины и можете удалить любого, кто присоединился.',
    'inv.claudeNote': 'Страница закрыта, пока вы не поделитесь ею с друзьями через меню «Поделиться». Чтобы двигать фрагменты, им нужен доступ участника или редактора; с доступом только на просмотр они смогут наблюдать.',
    'inv.count': { one: 'Сейчас за столом {n} человек.', few: 'Сейчас за столом {n} человека.', many: 'Сейчас за столом {n} человек.', other: 'Сейчас за столом {n} человека.' },
    'inv.alone': 'Пока за столом больше никого нет.',
    'inv.off': 'Здесь столы не подключаются, поэтому пригласить друзей нельзя. Можно играть одному.',

    'exit.eyebrow': 'Главное меню',
    'exit.title': 'Покинуть стол?',
    'exit.stay': 'Продолжить игру',
    'exit.go': 'Выйти в главное меню',
    'progress.you': { one: 'Вы собрали {placed} из {n} фрагмента картины «{title}».', few: 'Вы собрали {placed} из {n} фрагментов картины «{title}».', many: 'Вы собрали {placed} из {n} фрагментов картины «{title}».', other: 'Вы собрали {placed} из {n} фрагмента картины «{title}».' },
    'progress.table': { one: 'За столом собрано {placed} из {n} фрагмента картины «{title}».', few: 'За столом собрано {placed} из {n} фрагментов картины «{title}».', many: 'За столом собрано {placed} из {n} фрагментов картины «{title}».', other: 'За столом собрано {placed} из {n} фрагмента картины «{title}».' },
    'exit.friendLeads': 'Ваш друг продолжит игру, а ведущим станет следующий игрок.',
    'exit.friendsLead': 'Ваши друзья продолжат игру, а ведущим станет следующий игрок.',
    'exit.friend': 'Ваш друг продолжит игру без вас.',
    'exit.friends': 'Ваши друзья продолжат игру без вас.',
    'exit.rejoin': 'Вернуться можно по коду стола {code}.',
    'exit.notSaved': 'Пазл не сохранится.',

    'switch.eyebrow': 'Пазл не закончен',
    'switch.titleNew': 'Начать «{title}»?',
    'switch.titleSame': 'Начать «{title}» заново?',
    'switch.clears': 'Если начать новую картину, они пропадут.',
    'switch.clearsTable': 'Если начать новую картину, они пропадут у всех за столом.',
    'switch.mixes': 'Если начать заново, все фрагменты перемешаются.',
    'switch.mixesTable': 'Если начать заново, все фрагменты перемешаются у всех за столом.',
    'switch.keep': 'Продолжить «{title}»',
    'switch.go': 'Начать «{title}»',
    'switch.again': 'Начать заново',

    'kick.eyebrow': 'Ведущий стола',
    'kick.title': 'Удалить из-за стола: {name}?',
    'kick.thisPlayer': 'этот игрок',
    'kick.note': 'Игрок сразу покинет стол и не сможет вернуться за него. Собранные им фрагменты останутся на поле.',
    'kick.yes': 'Удалить из-за стола',
    'kick.no': 'Продолжить вместе',

    'players.you': 'вы',
    'players.leader': 'ведущий',
    'players.guest': 'гость',
    'players.friend': 'Друг',
    'players.invite': 'Пригласить друзей',
    'players.remove': 'Удалить из-за стола: {name}',
    'players.watching': 'Только просмотр: чтобы двигать фрагменты, нужен доступ на редактирование',
    'leader.fallback': 'Ведущий',

    'msg.needName': 'Сначала введите имя, чтобы друзья знали, кто вы.',
    'msg.setting': 'Готовим стол…',
    'msg.codeLength': 'Код стола состоит из 5 букв и цифр.',
    'msg.looking': 'Ищем стол {code}…',
    'msg.noRooms': 'Здесь столы не подключаются. Можно открыть свой стол и играть одному.',
    'msg.banned': 'Вас удалили из-за стола {code} (ведущий — {name}), поэтому вернуться за него нельзя.',
    'msg.nobody': 'Сейчас за столом {code} никого нет. Уточните код у друга или откройте свой стол.',
    'msg.removed': 'Вас удалили из-за стола (ведущий — {name}).'
  }
};

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
