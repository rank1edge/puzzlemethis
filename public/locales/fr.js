// French: interface text and painting texts.
// Keys and structure match the English in i18n.js and paintings.js; anything
// left out falls back to English.
export const LOCALE_FR = {
  code: "fr",
  name: "Français",
  ui: {
    "app.tagline": "Seize tableaux célèbres à reconstituer",
    "stats.mainMenu": "Menu principal",
    "stats.round": "Manche",
    "stats.placed": "en place",
    "btn.menu": "← Menu principal",
    "btn.menu.title": "Quitter cette table et revenir au menu principal",
    "btn.story": "Histoire",
    "btn.gallery": "Tableaux",
    "btn.guide": "Modèle",
    "btn.guide.title": "Afficher une copie pâle du tableau sur le plateau. Désactivé, le plateau est flou.",
    "btn.guide.hardTitle": "Au niveau difficile, le plateau est toujours flou",
    "btn.tidy": "Ranger",
    "btn.tidy.title": "Étaler à nouveau les pièces libres autour du plateau",
    "btn.sound": "Son",
    "lang.label": "Langue",
    "canvas.label": "Table de puzzle. Faites glisser les pièces sur le plateau.",
    "hint": "Faites glisser une pièce sur le plateau. Près de sa place, elle s’y met toute seule.",

    "after.finished": "Terminé",
    "after.next": "Tableau suivant →",
    "after.story": "Lire l’histoire",
    "after.wait": "{name} choisit le prochain tableau",

    "menu.eyebrow": "Un jeu tranquille autour de tableaux célèbres",
    "menu.lede": "Reconstituez seize chefs-d’œuvre, de Léonard à Hokusai, seul ou avec des amis à la même table. Chaque tableau terminé est accompagné de son histoire.",
    "menu.name": "Votre nom",
    "menu.name.placeholder": "Saisissez votre nom",
    "menu.colours": "Couleur de l’avatar",
    "menu.colour": "Couleur {n}",
    "menu.level": "Niveau",
    "level.easy": "Facile",
    "level.medium": "Moyen",
    "level.hard": "Difficile",
    "level.easy.note": "environ 16 pièces",
    "level.medium.note": "environ 36 pièces",
    "level.hard.note": "environ 100, modèle flou",
    "menu.start": "Ouvrir une table",
    "menu.or": "ou rejoindre la table d’un ami",
    "menu.code.placeholder": "Code",
    "menu.code.label": "Code de la table",
    "menu.join": "Rejoindre",
    "menu.joinNote": "Vous jouerez au niveau choisi par votre ami.",
    "menu.ownTable": "Ouvrir plutôt ma propre table",
    "menu.banner.title": "Vous êtes invité à la table {code}",
    "menu.banner.text": "Saisissez votre nom et appuyez sur Rejoindre. Vous jouerez au niveau choisi par l’hôte.",

    "pop.eyebrow": "Vous êtes invité",
    "pop.title": "Rejoindre la table {code}",
    "pop.note": "Un ami vous a envoyé le lien de sa table. Vous jouerez à son niveau.",
    "pop.close": "Fermer et aller au menu principal",
    "pop.code": "Code de la table",
    "pop.join": "Rejoindre la table",

    "card.close": "Fermer",
    "info.story": "L’histoire",
    "info.roundDone": "Manche {n} terminée",
    "info.artist": "Artiste",
    "info.made": "Date",
    "info.medium": "Technique",
    "info.home": "Conservé à",
    "info.yourTime": "Votre temps",
    "info.tableTime": "Temps de la table",
    "info.level": "Niveau",
    "info.levelValue": { one: "{level} · {n} pièce", other: "{level} · {n} pièces" },
    "info.next": "Tableau suivant",
    "info.admire": "Admirer le tableau",
    "info.wait": "{name} choisit le prochain tableau.",

    "gal.eyebrow": "La collection",
    "gal.title": "Choisissez un tableau",
    "gal.note": "Le puzzle en cours est mis de côté et le tableau choisi commence une nouvelle manche au même niveau, pour toute la table.",
    "gal.noteFollower": "Seul {name}, l’hôte de la table, peut choisir le tableau. Vous pouvez parcourir la collection ici.",
    "gal.solved": "Terminé",

    "inv.eyebrow": "Jouer ensemble",
    "inv.title": "Inviter des amis",
    "inv.copyLink": "Copier le lien",
    "inv.copyCode": "Copier le code",
    "inv.linkCopied": "Lien copié",
    "inv.codeCopied": "Code copié",
    "inv.selected": "Sélectionné. Copiez-le pour l’envoyer.",
    "inv.step1": "Envoyez le lien. Il ouvre cette table : vos amis n’ont qu’à saisir leur nom et à appuyer sur Rejoindre.",
    "inv.step2": "Ou envoyez le code. Vos amis ouvrent le jeu et le saisissent sous « ou rejoindre la table d’un ami ».",
    "inv.step3": "Vous êtes l’hôte : vous choisissez chaque tableau et pouvez retirer n’importe quel joueur.",
    "inv.claudeNote": "La page reste privée tant que vous ne la partagez pas avec vos amis depuis le menu Partager. Pour déplacer les pièces, ils ont besoin d’un accès contributeur ou éditeur ; en lecture seule, ils peuvent regarder.",
    "inv.count": { one: "{n} personne est à cette table.", other: "{n} personnes sont à cette table." },
    "inv.alone": "Personne d’autre n’est encore là.",
    "inv.off": "Les tables ne peuvent pas se connecter ici : impossible d’inviter des amis. Vous pouvez continuer à jouer seul.",

    "exit.eyebrow": "Menu principal",
    "exit.title": "Quitter cette table ?",
    "exit.stay": "Continuer à jouer",
    "exit.go": "Retour au menu principal",
    "progress.you": { one: "Vous avez placé {placed} pièce sur {n} de « {title} ».", other: "Vous avez placé {placed} pièces sur {n} de « {title} »." },
    "progress.table": { one: "Votre table a placé {placed} pièce sur {n} de « {title} ».", other: "Votre table a placé {placed} pièces sur {n} de « {title} »." },
    "exit.friendLeads": "Votre ami continue de jouer et le joueur suivant devient l’hôte.",
    "exit.friendsLead": "Vos {n} amis continuent de jouer et le joueur suivant devient l’hôte.",
    "exit.friend": "Votre ami continue de jouer sans vous.",
    "exit.friends": "Vos {n} amis continuent de jouer sans vous.",
    "exit.rejoin": "Vous pourrez revenir avec le code {code}.",
    "exit.notSaved": "Votre puzzle ne sera pas enregistré.",

    "switch.eyebrow": "Puzzle en cours",
    "switch.titleNew": "Commencer « {title} » ?",
    "switch.titleSame": "Recommencer « {title} » ?",
    "switch.clears": "Commencer un nouveau tableau les efface.",
    "switch.clearsTable": "Commencer un nouveau tableau les efface pour toute la table.",
    "switch.mixes": "Recommencer mélange toutes les pièces.",
    "switch.mixesTable": "Recommencer mélange toutes les pièces pour toute la table.",
    "switch.keep": "Continuer « {title} »",
    "switch.go": "Commencer « {title} »",
    "switch.again": "Recommencer",

    "kick.eyebrow": "Hôte de la table",
    "kick.title": "Retirer {name} ?",
    "kick.thisPlayer": "ce joueur",
    "kick.note": "Le joueur quitte aussitôt la table et ne pourra pas y revenir. Les pièces qu’il a placées restent sur le plateau.",
    "kick.yes": "Retirer de la table",
    "kick.no": "Continuer ensemble",

    "players.you": "vous",
    "players.leader": "hôte",
    "players.guest": "invité",
    "players.friend": "Ami",
    "players.invite": "Inviter des amis",
    "players.remove": "Retirer {name} de la table",
    "players.watching": "Lecture seule : un accès éditeur est nécessaire pour déplacer les pièces",
    "leader.fallback": "L’hôte",

    "msg.needName": "Saisissez d’abord votre nom, pour que vos amis sachent qui vous êtes.",
    "msg.setting": "Préparation de la table…",
    "msg.codeLength": "Un code de table comporte 5 lettres et chiffres.",
    "msg.looking": "Recherche de la table {code}…",
    "msg.noRooms": "Les tables ne peuvent pas se connecter ici. Vous pouvez ouvrir votre propre table et jouer seul.",
    "msg.banned": "{name} vous a retiré de la table {code} : vous ne pouvez pas y revenir.",
    "msg.nobody": "Personne n’est à la table {code} pour le moment. Vérifiez le code avec votre ami ou ouvrez votre propre table.",
    "msg.removed": "{name} vous a retiré de la table."
  },
  paintings: {
    "mona-lisa": {
      title: "La Joconde", artist: "Léonard de Vinci", year: "vers 1503–1519",
      medium: "Huile sur panneau de peuplier, 77 × 53 cm", home: "Musée du Louvre, Paris",
      story: [
        "Le modèle est presque certainement Lisa Gherardini, épouse du marchand de soie florentin Francesco del Giocondo, d’où le nom de « Joconde ». Léonard ne remit jamais le portrait : il le retoucha pendant des années et l’emporta en France, où il entra dans la collection royale.",
        "Pendant des siècles, le tableau fut admiré sans être mondialement célèbre. Tout changea en août 1911, quand Vincenzo Peruggia, un ouvrier qui avait travaillé au Louvre, l’emporta sous sa blouse. Le mur vide fit la une partout, et le tableau resta introuvable plus de deux ans, jusqu’à ce que Peruggia tente de le vendre à Florence et soit arrêté.",
        "Le modelé doux et vaporeux du visage, le sfumato, Léonard l’a obtenu par de nombreuses couches de glacis très fines. Aujourd’hui, le tableau est exposé derrière une vitre de protection et attire des millions de visiteurs chaque année."
      ] },
    "starry-night": {
      title: "La Nuit étoilée", artist: "Vincent van Gogh", year: "1889",
      medium: "Huile sur toile, 73,7 × 92,1 cm", home: "Museum of Modern Art, New York",
      story: [
        "Van Gogh l’a peinte en juin 1889 à l’asile de Saint-Paul-de-Mausole, à Saint-Rémy-de-Provence, où il était entré de lui-même après une crise. C’est la vue de la fenêtre de sa chambre, orientée à l’est, juste avant l’aube. Le village et son clocher sont imaginés.",
        "Il n’avait pas le droit de peindre dans sa chambre : il y faisait des croquis et travaillait la toile le jour, dans un atelier au rez-de-chaussée. L’« étoile » la plus brillante près de l’horizon est sans doute Vénus, visible dans le ciel de l’aube ce mois-là.",
        "Van Gogh lui-même ne tenait pas ce tableau en grande estime. Il mourut l’année suivante, et ce n’est que des décennies plus tard que l’œuvre devint l’une des images les plus connues au monde."
      ] },
    "scream": {
      title: "Le Cri", artist: "Edvard Munch", year: "1893",
      medium: "Tempera et pastel sur carton, 91 × 73,5 cm", home: "Musée national, Oslo",
      story: [
        "Munch a raconté le moment qui l’inspira : en marchant au coucher du soleil près d’Oslo, le ciel devint rouge sang et il sentit un grand cri traverser la nature. La figure ne crie pas tant qu’elle entend ce cri, les mains plaquées sur la tête.",
        "Il en existe plusieurs versions : deux peintures, deux pastels et une série de lithographies. Cette peinture de 1893 fut volée le jour de l’ouverture des Jeux olympiques d’hiver de Lillehammer en 1994 ; les voleurs entrèrent par une échelle et laissèrent un mot remerciant le musée pour sa sécurité défaillante. Elle fut retrouvée quelques mois plus tard. Une autre version fut volée sous la menace d’une arme au musée Munch en 2004 et retrouvée deux ans après.",
        "Une minuscule inscription au crayon dans le ciel dit : « N’a pu être peint que par un fou ». On l’a longtemps attribuée à un vandale. En 2021, le musée a confirmé qu’elle était de la main de Munch."
      ] },
    "great-wave": {
      title: "La Grande Vague de Kanagawa", artist: "Katsushika Hokusai", year: "vers 1831",
      medium: "Estampe sur bois, encre et couleurs sur papier, environ 26 × 38 cm", home: "Nombreuses collections, dont le Met et le British Museum",
      story: [
        "Il s’agit d’une estampe, pas d’une peinture unique. Elle ouvrait la série d’Hokusai Trente-six vues du mont Fuji, et des milliers d’exemplaires furent tirés des planches gravées : c’est pourquoi on en trouve dans des musées du monde entier.",
        "Hokusai avait environ soixante-dix ans. Au-delà de la crête en forme de griffe, on découvre le mont Fuji, petit et paisible, au creux de la vague, et trois bateaux rapides avec leurs rameurs.",
        "Le bleu profond est du bleu de Prusse, un pigment synthétique tout juste arrivé au Japon. L’estampe parvint ensuite en Europe et influença Monet, Van Gogh et le compositeur Debussy."
      ] },
    "grande-jatte": {
      title: "Un dimanche après-midi à l’île de la Grande Jatte", artist: "Georges Seurat", year: "1884–1886",
      medium: "Huile sur toile, 207,5 × 308,1 cm", home: "Art Institute of Chicago",
      story: [
        "Seurat consacra environ deux ans à cette immense toile, qui montre des Parisiens se détendant sur une île de la Seine. Il fit des dizaines de dessins et d’esquisses à l’huile sur place, puis composa le tableau final en atelier.",
        "C’est l’exemple le plus célèbre du pointillisme : au lieu de mélanger les couleurs sur la palette, Seurat juxtaposait de petits points de couleur pure et laissait l’œil les mélanger. Il s’appuyait sur la science des couleurs de son époque.",
        "Cherchez les détails : une femme qui pêche, un singe en laisse, un joueur de trompette. Seurat ajouta plus tard une bordure peinte de points. Il mourut à seulement 31 ans."
      ] },
    "impression-sunrise": {
      title: "Impression, soleil levant", artist: "Claude Monet", year: "1872",
      medium: "Huile sur toile, 48 × 63 cm", home: "Musée Marmottan Monet, Paris",
      story: [
        "Monet peignit le port du Havre, sa ville natale, dans la brume du matin, le soleil orange se reflétant dans l’eau. Il exposa le tableau lors d’une exposition indépendante à Paris en 1874.",
        "Le critique Louis Leroy se moqua du titre dans un article et traita tout le groupe d’« impressionnistes ». Les artistes adoptèrent l’insulte comme nom : cette petite toile a donné son nom à tout un mouvement.",
        "Le soleil paraît éclatant, mais il a presque la même luminosité que le ciel gris qui l’entoure : c’est le contraste des couleurs, non la clarté, qui le fait briller. Volé au musée en 1985, le tableau fut retrouvé en Corse cinq ans plus tard."
      ] },
    "water-lily-pond": {
      title: "Le Bassin aux nymphéas", artist: "Claude Monet", year: "1899",
      medium: "Huile sur toile", home: "Plusieurs versions, dont la National Gallery de Londres",
      story: [
        "Dans sa maison de Giverny, Monet détourna un ruisseau pour créer un bassin, y planta des nymphéas et y jeta un pont de style japonais. Il disait que son jardin était son plus beau chef-d’œuvre.",
        "Il peignit le pont et les nymphéas encore et encore ; les nymphéas devinrent son sujet principal pendant les trente dernières années de sa vie, environ 250 tableaux en tout.",
        "Vers la fin de sa vie, la cataracte troubla sa vue et ses couleurs devinrent plus chaudes et plus floues. Il fut opéré en 1923 et peignit jusqu’à sa mort en 1926."
      ] },
    "boating-party": {
      title: "Le Déjeuner des canotiers", artist: "Pierre-Auguste Renoir", year: "1880–1881",
      medium: "Huile sur toile, 130,2 × 175,6 cm", home: "The Phillips Collection, Washington",
      story: [
        "La scène se passe sur le balcon de la Maison Fournaise, un restaurant au bord de la Seine à Chatou, apprécié des canotiers. Renoir la peupla de ses amis, venus poser pendant plusieurs mois.",
        "La jeune femme à gauche qui joue avec un petit chien est Aline Charigot, une couturière qui épousa plus tard Renoir. L’homme assis à califourchon sur une chaise, en bas à droite, est le peintre Gustave Caillebotte, qui soutenait aussi ses amis artistes en achetant leurs œuvres.",
        "Le collectionneur américain Duncan Phillips acheta le tableau en 1923 ; il reste l’œuvre la plus célèbre du musée qu’il fonda."
      ] },
    "folies-bergere": {
      title: "Un bar aux Folies Bergère", artist: "Édouard Manet", year: "1882",
      medium: "Huile sur toile, 96 × 130 cm", home: "The Courtauld Gallery, Londres",
      story: [
        "C’est le dernier grand tableau de Manet, peint alors qu’il était déjà gravement malade. La serveuse était une vraie employée du music-hall parisien, nommée Suzon, qui posa pour lui derrière un comptoir installé dans son atelier.",
        "Derrière elle, un miroir, et le reflet ne colle pas : son dos reflété est très décalé vers la droite, et un homme apparaît devant elle, qui devrait nous masquer la vue. On se demande depuis si Manet l’a fait exprès.",
        "Dans le coin supérieur gauche, on aperçoit les pieds chaussés de vert d’une trapéziste. Sur le comptoir, les bouteilles à l’étiquette marquée d’un triangle rouge sont de la bière Bass."
      ] },
    "whistlers-mother": {
      title: "La Mère de Whistler", artist: "James McNeill Whistler", year: "1871",
      medium: "Huile sur toile, 144,3 × 162,4 cm", home: "Musée d’Orsay, Paris",
      story: [
        "Son vrai titre est Arrangement en gris et noir no 1. Whistler voulait qu’on y voie une étude de couleurs et de formes, et s’agaçait qu’on s’intéresse surtout au modèle.",
        "Le modèle est sa mère, Anna McNeill Whistler. Selon une anecdote, un modèle ne vint pas et elle la remplaça. Rester debout longtemps la fatiguait trop, alors Whistler la peignit assise.",
        "L’État français l’acheta en 1891. Dans les années 1930, le tableau fit une tournée aux États-Unis et, en 1934, il figura sur un timbre américain pour la fête des Mères, ce qui en fit une icône de la maternité."
      ] },
    "temeraire": {
      title: "Le Dernier Voyage du Téméraire", artist: "J. M. W. Turner", year: "1839",
      medium: "Huile sur toile, 90,7 × 121,6 cm", home: "National Gallery, Londres",
      story: [
        "Le HMS Temeraire combattit à Trafalgar en 1805. En 1838, le vieux navire de guerre fut remorqué sur la Tamise par un remorqueur à vapeur pour être démoli. Turner montre le voilier fantomatique derrière le remorqueur sombre et fumant, sous un coucher de soleil flamboyant.",
        "On y voit souvent un adieu à l’ère de la voile. Turner a pris quelques libertés : à cette date, les mâts du navire avaient déjà été retirés.",
        "Il l’appelait son « chéri », refusa de le vendre et le légua à la nation. En 2005, il fut élu plus grand tableau britannique lors d’un sondage de la radio de la BBC, et en 2020 il apparut sur le billet de 20 livres de la Banque d’Angleterre, aux côtés de Turner."
      ] },
    "woman-in-gold": {
      title: "Portrait d’Adele Bloch-Bauer I", artist: "Gustav Klimt", year: "1907",
      medium: "Huile, argent et feuille d’or sur toile, 140 × 140 cm", home: "Neue Galerie, New York",
      story: [
        "Adele était l’épouse de Ferdinand Bloch-Bauer, riche industriel viennois du sucre, qui commanda le portrait. Klimt y travailla plusieurs années, couvrant la toile de vraie feuille d’or et d’argent pendant sa célèbre « période dorée ».",
        "Après l’annexion de l’Autriche par les nazis en 1938, le tableau fut confisqué à la famille juive. Il fut ensuite exposé au Belvédère de Vienne sous le titre « La Dame en or », qui évitait de nommer son modèle juif.",
        "La nièce d’Adele, Maria Altmann, poursuivit l’Autriche en justice et récupéra le tableau en 2006. Il fut ensuite vendu à Ronald Lauder pour 135 millions de dollars, selon la presse, un record à l’époque. L’histoire a inspiré le film La Femme au tableau en 2015."
      ] },
    "card-players": {
      title: "Les Joueurs de cartes", artist: "Paul Cézanne", year: "années 1890",
      medium: "Huile sur toile", home: "Cinq versions, à Paris, Londres, New York, Philadelphie et dans une collection privée",
      story: [
        "Au début des années 1890, Cézanne peignit cinq fois des joueurs de cartes, avec pour modèles des ouvriers agricoles du domaine familial près d’Aix-en-Provence. D’une version à l’autre, la scène se resserre, jusqu’à deux hommes face à face autour d’une table.",
        "Personne ne parle, personne ne sourit, et les cartes comptent à peine. Cézanne traitait les figures presque comme des objets de nature morte, les construisant par blocs de couleur, une approche qui inspira ensuite le cubisme.",
        "L’une des versions à deux joueurs, en mains privées, aurait été vendue à la famille royale du Qatar en 2011 pour plus de 250 millions de dollars, l’un des prix les plus élevés jamais payés pour un tableau."
      ] },
    "irises": {
      title: "Les Iris", artist: "Vincent van Gogh", year: "1889",
      medium: "Huile sur toile, 74,3 × 94,3 cm", home: "J. Paul Getty Museum, Los Angeles",
      story: [
        "Van Gogh peignit Les Iris dès sa première semaine à l’asile de Saint-Rémy, dans le jardin de l’hôpital. Il disait que la peinture était le paratonnerre de sa maladie, une manière de garder l’équilibre.",
        "Cherchez l’unique iris blanc parmi les bleus. Les contours marqués et les aplats de couleur montrent tout ce qu’il avait appris des estampes japonaises.",
        "Son frère Théo l’envoya à une exposition à Paris la même année. En 1987, il fut vendu aux enchères 53,9 millions de dollars, un record mondial à l’époque. Le musée Getty l’acheta en 1990."
      ] },
    "wheatfield-crows": {
      title: "Champ de blé aux corbeaux", artist: "Vincent van Gogh", year: "1890",
      medium: "Huile sur toile, 50,5 × 103 cm", home: "Musée Van Gogh, Amsterdam",
      story: [
        "Van Gogh le peignit en juillet 1890 à Auvers-sur-Oise, au nord de Paris, quelques semaines avant sa mort. Sous un ciel d’orage, trois chemins s’enfoncent dans un champ de blé sans mener nulle part, tandis que des corbeaux noirs s’envolent.",
        "On le dit souvent son dernier tableau, mais c’est un mythe : ses lettres et d’autres œuvres montrent qu’il peignit plusieurs toiles ensuite.",
        "Dans une lettre de ce mois-là, il décrit d’immenses étendues de blé sous des ciels troublés, où il voulait exprimer la tristesse et la solitude extrême, mais aussi la force saine et réconfortante qu’il trouvait à la campagne."
      ] },
    "composition-vii": {
      title: "Composition VII", artist: "Vassily Kandinsky", year: "1913",
      medium: "Huile sur toile, 200 × 300 cm", home: "Galerie Tretiakov, Moscou",
      story: [
        "Kandinsky est souvent considéré comme un pionnier de l’art abstrait, et il tenait Composition VII pour l’œuvre la plus complexe qu’il ait réalisée avant la Première Guerre mondiale. Il la prépara par plus de trente dessins, aquarelles et études à l’huile.",
        "Après toute cette préparation, il peignit l’immense toile finale en quatre jours environ.",
        "Kandinsky associait la couleur au son et appelait ses grandes œuvres des « compositions », comme un compositeur. Certains y voient des thèmes cachés, déluge, résurrection ou Jugement dernier, dissous dans la couleur et la ligne pures."
      ] }
  }
};
