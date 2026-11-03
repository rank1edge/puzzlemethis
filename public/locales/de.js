// German: interface text and painting texts.
// Keys and structure match the English in i18n.js and paintings.js; anything
// left out falls back to English.
export const LOCALE_DE = {
  code: "de",
  name: "Deutsch",
  ui: {
    "app.tagline": "Sechzehn berühmte Gemälde zum Zusammensetzen",
    "stats.mainMenu": "Hauptmenü",
    "stats.round": "Runde",
    "stats.placed": "gelegt",
    "btn.menu": "← Hauptmenü",
    "btn.menu.title": "Diesen Tisch verlassen und zum Hauptmenü zurückkehren",
    "btn.story": "Geschichte",
    "btn.gallery": "Gemälde",
    "btn.guide": "Vorlage",
    "btn.guide.title": "Eine blasse Kopie des Gemäldes auf dem Brett zeigen. Ausgeschaltet ist das Brett verschwommen.",
    "btn.guide.hardTitle": "Auf der Stufe „Schwer“ ist das Brett immer verschwommen",
    "btn.tidy": "Aufräumen",
    "btn.tidy.title": "Die losen Teile wieder rund um das Brett verteilen",
    "btn.sound": "Ton",
    "lang.label": "Sprache",
    "canvas.label": "Puzzletisch. Ziehen Sie die Teile auf das Brett.",
    "hint": "Ziehen Sie ein Teil auf das Brett. In der Nähe seines Platzes rastet es von selbst ein.",

    "after.finished": "Fertig",
    "after.next": "Nächstes Gemälde →",
    "after.story": "Geschichte lesen",
    "after.wait": "{name} wählt das nächste Gemälde",

    "menu.eyebrow": "Ein ruhiges Spiel mit berühmten Gemälden",
    "menu.lede": "Setzen Sie sechzehn Meisterwerke zusammen, von Leonardo bis Hokusai, allein oder mit Freunden am selben Tisch. Zu jedem fertigen Gemälde gibt es seine Geschichte.",
    "menu.name": "Ihr Name",
    "menu.name.placeholder": "Namen eingeben",
    "menu.colours": "Avatarfarbe",
    "menu.colour": "Farbe {n}",
    "menu.level": "Stufe",
    "level.easy": "Leicht",
    "level.medium": "Mittel",
    "level.hard": "Schwer",
    "level.easy.note": "etwa 16 Teile",
    "level.medium.note": "etwa 36 Teile",
    "level.hard.note": "etwa 100, verschwommene Vorlage",
    "menu.start": "Tisch eröffnen",
    "menu.or": "oder an den Tisch eines Freundes setzen",
    "menu.code.placeholder": "Code",
    "menu.code.label": "Tischcode",
    "menu.join": "Beitreten",
    "menu.joinNote": "Sie spielen auf der Stufe Ihres Freundes.",
    "menu.ownTable": "Lieber einen eigenen Tisch eröffnen",
    "menu.banner.title": "Sie sind an Tisch {code} eingeladen",
    "menu.banner.text": "Geben Sie Ihren Namen ein und tippen Sie auf Beitreten. Sie spielen auf der Stufe der Spielleitung.",

    "pop.eyebrow": "Sie sind eingeladen",
    "pop.title": "Tisch {code} beitreten",
    "pop.note": "Ein Freund hat Ihnen einen Link zu seinem Tisch geschickt. Sie spielen auf seiner Stufe.",
    "pop.close": "Schließen und zum Hauptmenü",
    "pop.code": "Tischcode",
    "pop.join": "Tisch beitreten",

    "card.close": "Schließen",
    "info.story": "Die Geschichte",
    "info.roundDone": "Runde {n} geschafft",
    "info.artist": "Künstler",
    "info.made": "Entstanden",
    "info.medium": "Technik",
    "info.home": "Ort",
    "info.yourTime": "Ihre Zeit",
    "info.tableTime": "Zeit am Tisch",
    "info.level": "Stufe",
    "info.levelValue": { one: "{level} · {n} Teil", other: "{level} · {n} Teile" },
    "info.next": "Nächstes Gemälde",
    "info.admire": "Gemälde betrachten",
    "info.wait": "{name} wählt das nächste Gemälde.",

    "gal.eyebrow": "Die Sammlung",
    "gal.title": "Gemälde wählen",
    "gal.note": "Das aktuelle Puzzle wird beiseitegelegt, und das gewählte Gemälde beginnt als neue Runde auf derselben Stufe, für alle am Tisch.",
    "gal.noteFollower": "Nur {name}, die Spielleitung, kann das Gemälde wählen. Hier können Sie sich die Sammlung ansehen.",
    "gal.solved": "Gelöst",

    "inv.eyebrow": "Gemeinsam spielen",
    "inv.title": "Freunde einladen",
    "inv.copyLink": "Link kopieren",
    "inv.copyCode": "Code kopieren",
    "inv.linkCopied": "Link kopiert",
    "inv.codeCopied": "Code kopiert",
    "inv.selected": "Markiert. Zum Senden kopieren.",
    "inv.step1": "Senden Sie den Link. Er öffnet diesen Tisch, Ihre Freunde geben nur ihren Namen ein und tippen auf Beitreten.",
    "inv.step2": "Oder senden Sie den Code. Ihre Freunde öffnen das Spiel und geben ihn unter „oder an den Tisch eines Freundes setzen“ ein.",
    "inv.step3": "Sie leiten den Tisch: Sie wählen jedes Gemälde und können jeden entfernen, der beitritt.",
    "inv.claudeNote": "Die Seite bleibt privat, bis Sie sie über das Menü „Teilen“ mit Ihren Freunden teilen. Zum Verschieben der Teile brauchen sie Mitwirkenden- oder Bearbeitungszugriff; mit Lesezugriff können sie zuschauen.",
    "inv.count": { one: "Gerade ist {n} Person an diesem Tisch.", other: "Gerade sind {n} Personen an diesem Tisch." },
    "inv.alone": "Noch ist niemand sonst hier.",
    "inv.off": "Tische können sich hier nicht verbinden, daher ist das Einladen nicht möglich. Sie können allein weiterspielen.",

    "exit.eyebrow": "Hauptmenü",
    "exit.title": "Diesen Tisch verlassen?",
    "exit.stay": "Weiterspielen",
    "exit.go": "Zum Hauptmenü",
    "progress.you": { one: "Sie haben {placed} von {n} Teil von „{title}“ gelegt.", other: "Sie haben {placed} von {n} Teilen von „{title}“ gelegt." },
    "progress.table": { one: "Ihr Tisch hat {placed} von {n} Teil von „{title}“ gelegt.", other: "Ihr Tisch hat {placed} von {n} Teilen von „{title}“ gelegt." },
    "exit.friendLeads": "Ihr Freund spielt weiter, und die nächste Person übernimmt die Spielleitung.",
    "exit.friendsLead": "Ihre {n} Freunde spielen weiter, und die nächste Person übernimmt die Spielleitung.",
    "exit.friend": "Ihr Freund spielt ohne Sie weiter.",
    "exit.friends": "Ihre {n} Freunde spielen ohne Sie weiter.",
    "exit.rejoin": "Mit dem Tischcode {code} können Sie zurückkehren.",
    "exit.notSaved": "Ihr Puzzle wird nicht gespeichert.",

    "switch.eyebrow": "Puzzle läuft",
    "switch.titleNew": "„{title}“ beginnen?",
    "switch.titleSame": "„{title}“ neu beginnen?",
    "switch.clears": "Ein neues Gemälde entfernt sie wieder.",
    "switch.clearsTable": "Ein neues Gemälde entfernt sie für alle am Tisch.",
    "switch.mixes": "Ein Neustart mischt alle Teile durch.",
    "switch.mixesTable": "Ein Neustart mischt alle Teile für alle am Tisch durch.",
    "switch.keep": "„{title}“ weiterspielen",
    "switch.go": "„{title}“ beginnen",
    "switch.again": "Neu beginnen",

    "kick.eyebrow": "Spielleitung",
    "kick.title": "{name} entfernen?",
    "kick.thisPlayer": "diese Person",
    "kick.note": "Die Person verlässt den Tisch sofort und kann ihm nicht wieder beitreten. Ihre gelegten Teile bleiben auf dem Brett.",
    "kick.yes": "Vom Tisch entfernen",
    "kick.no": "Gemeinsam weiterspielen",

    "players.you": "Sie",
    "players.leader": "Leitung",
    "players.guest": "Gast",
    "players.friend": "Freund",
    "players.invite": "Freunde einladen",
    "players.remove": "{name} vom Tisch entfernen",
    "players.watching": "Nur zuschauen: Zum Verschieben der Teile ist Bearbeitungszugriff nötig",
    "leader.fallback": "Die Spielleitung",

    "msg.needName": "Geben Sie zuerst Ihren Namen ein, damit Ihre Freunde wissen, wer Sie sind.",
    "msg.setting": "Tisch wird vorbereitet …",
    "msg.codeLength": "Ein Tischcode hat 5 Buchstaben und Ziffern.",
    "msg.looking": "Tisch {code} wird gesucht …",
    "msg.noRooms": "Tische können sich hier nicht verbinden. Sie können einen eigenen Tisch eröffnen und allein spielen.",
    "msg.banned": "{name} hat Sie von Tisch {code} entfernt, daher können Sie nicht zurückkehren.",
    "msg.nobody": "An Tisch {code} ist gerade niemand. Prüfen Sie den Code mit Ihrem Freund oder eröffnen Sie einen eigenen Tisch.",
    "msg.removed": "{name} hat Sie vom Tisch entfernt."
  },
  paintings: {
    "mona-lisa": {
      title: "Mona Lisa", artist: "Leonardo da Vinci", year: "um 1503–1519",
      medium: "Öl auf Pappelholz, 77 × 53 cm", home: "Musée du Louvre, Paris",
      story: [
        "Die Dargestellte ist fast sicher Lisa Gherardini, Ehefrau des Florentiner Seidenhändlers Francesco del Giocondo, daher auch der Name „La Gioconda“. Leonardo lieferte das Bild nie ab: Er arbeitete jahrelang daran weiter und nahm es mit nach Frankreich, wo es in die königliche Sammlung kam.",
        "Jahrhundertelang wurde es bewundert, war aber nicht weltberühmt. Das änderte sich im August 1911, als Vincenzo Peruggia, ein Handwerker, der im Louvre gearbeitet hatte, es unter seinem Kittel hinaustrug. Die leere Wand ging durch die Weltpresse, und das Bild blieb über zwei Jahre verschwunden, bis Peruggia es in Florenz verkaufen wollte und gefasst wurde.",
        "Die weichen, rauchigen Übergänge im Gesicht, das Sfumato, schuf Leonardo aus vielen hauchdünnen Lasurschichten. Heute hängt das Bild hinter Schutzglas und zieht jedes Jahr Millionen Besucher an."
      ] },
    "starry-night": {
      title: "Sternennacht", artist: "Vincent van Gogh", year: "1889",
      medium: "Öl auf Leinwand, 73,7 × 92,1 cm", home: "Museum of Modern Art, New York",
      story: [
        "Van Gogh malte sie im Juni 1889 in der Heilanstalt Saint-Paul-de-Mausole in Saint-Rémy-de-Provence, in die er sich nach einem Zusammenbruch selbst begeben hatte. Es ist der Blick aus seinem nach Osten gelegenen Schlafzimmerfenster kurz vor Sonnenaufgang. Das Dorf mit dem Kirchturm fügte er aus der Fantasie hinzu.",
        "Im Schlafzimmer durfte er nicht malen. Dort fertigte er Skizzen an und arbeitete tagsüber in einem Atelier im Erdgeschoss an der Leinwand. Der hellste „Stern“ nahe dem Horizont ist vermutlich die Venus, die in jenem Monat am Morgenhimmel stand.",
        "Van Gogh selbst hielt nicht viel von dem Bild. Er starb im folgenden Jahr, und erst Jahrzehnte später wurde es zu einem der bekanntesten Bilder der Welt."
      ] },
    "scream": {
      title: "Der Schrei", artist: "Edvard Munch", year: "1893",
      medium: "Tempera und Kreide auf Karton, 91 × 73,5 cm", home: "Nationalmuseum, Oslo",
      story: [
        "Munch beschrieb den Moment dahinter: Bei einem Spaziergang bei Sonnenuntergang nahe Oslo färbte sich der Himmel blutrot, und er spürte einen großen Schrei durch die Natur gehen. Die Figur schreit weniger, als dass sie ihn hört, die Hände an den Kopf gepresst.",
        "Es gibt mehrere Fassungen: zwei Gemälde, zwei Pastelle und eine Reihe Lithografien. Dieses Gemälde von 1893 wurde am Eröffnungstag der Olympischen Winterspiele 1994 in Lillehammer gestohlen; die Diebe stiegen über eine Leiter ein und hinterließen einen Dank für die schlechte Sicherung. Es wurde wenige Monate später gefunden. Eine andere Fassung wurde 2004 mit vorgehaltener Waffe aus dem Munch-Museum geraubt und zwei Jahre später gefunden.",
        "Eine winzige Bleistiftzeile im Himmel lautet: „Kann nur von einem Verrückten gemalt worden sein“. Lange hielt man sie für das Werk eines Vandalen. 2021 bestätigte das Museum, dass es Munchs eigene Handschrift ist."
      ] },
    "great-wave": {
      title: "Die große Welle vor Kanagawa", artist: "Katsushika Hokusai", year: "um 1831",
      medium: "Farbholzschnitt, Tusche und Farbe auf Papier, etwa 26 × 38 cm", home: "Viele Sammlungen, darunter das Met und das British Museum",
      story: [
        "Es ist ein Druck, kein einzelnes Gemälde. Er eröffnete Hokusais Reihe „36 Ansichten des Berges Fuji“, und von den geschnittenen Druckstöcken wurden Tausende Abzüge gemacht, darum gibt es Exemplare in Museen auf der ganzen Welt.",
        "Hokusai war etwa siebzig, als er ihn schuf. Hinter dem krallenartigen Wellenkamm entdeckt man den Fuji, klein und ruhig im Wellental, und drei schnelle Boote mit ihren Ruderern.",
        "Das tiefe Blau ist Preußischblau, ein synthetisches Pigment, das damals neu nach Japan kam. Später gelangte der Druck nach Europa und beeinflusste Monet, Van Gogh und den Komponisten Debussy."
      ] },
    "grande-jatte": {
      title: "Ein Sonntagnachmittag auf der Insel La Grande Jatte", artist: "Georges Seurat", year: "1884–1886",
      medium: "Öl auf Leinwand, 207,5 × 308,1 cm", home: "Art Institute of Chicago",
      story: [
        "Seurat arbeitete rund zwei Jahre an dieser riesigen Leinwand, die Pariser beim Ausruhen auf einer Insel in der Seine zeigt. Er fertigte vor Ort Dutzende Zeichnungen und Ölskizzen an und baute das endgültige Bild dann im Atelier auf.",
        "Es ist das bekannteste Beispiel des Pointillismus: Statt Farben auf der Palette zu mischen, setzte Seurat kleine Punkte reiner Farbe nebeneinander und überließ das Mischen dem Auge. Er stützte sich dabei auf die Farbenlehre seiner Zeit.",
        "Achten Sie auf die Details: eine Frau beim Angeln, ein Affe an der Leine, ein Trompeter. Später fügte Seurat einen gemalten Rand aus Punkten hinzu. Er starb mit nur 31 Jahren."
      ] },
    "impression-sunrise": {
      title: "Impression, Sonnenaufgang", artist: "Claude Monet", year: "1872",
      medium: "Öl auf Leinwand, 48 × 63 cm", home: "Musée Marmottan Monet, Paris",
      story: [
        "Monet malte den Hafen von Le Havre, seiner Heimatstadt, im Morgennebel, die orangefarbene Sonne spiegelt sich im Wasser. 1874 zeigte er das Bild auf einer unabhängigen Ausstellung in Paris.",
        "Der Kritiker Louis Leroy spottete in einer Besprechung über den Titel und nannte die ganze Gruppe „Impressionisten“. Die Künstler übernahmen den Spott als Namen, und diese kleine Leinwand gab einer ganzen Bewegung ihren Namen.",
        "Die Sonne wirkt hell, hat aber fast dieselbe Helligkeit wie der graue Himmel um sie: Sie leuchtet durch den Farbkontrast, nicht durch Helligkeit. 1985 wurde das Bild aus dem Museum gestohlen und fünf Jahre später auf Korsika wiedergefunden."
      ] },
    "water-lily-pond": {
      title: "Der Seerosenteich", artist: "Claude Monet", year: "1899",
      medium: "Öl auf Leinwand", home: "Mehrere Fassungen, darunter in der National Gallery, London",
      story: [
        "An seinem Haus in Giverny leitete Monet einen Bach um, legte einen Teich an, bepflanzte ihn mit Seerosen und baute eine Brücke im japanischen Stil darüber. Er sagte, sein Garten sei sein schönstes Meisterwerk.",
        "Er malte die Brücke und die Seerosen immer wieder; die Seerosen wurden in den letzten dreißig Jahren seines Lebens sein Hauptmotiv, insgesamt rund 250 Bilder.",
        "Im Alter trübte ein Grauer Star sein Sehen, und seine Farben wurden wärmer und verschwommener. 1923 wurde er operiert und malte weiter bis zu seinem Tod 1926."
      ] },
    "boating-party": {
      title: "Das Frühstück der Ruderer", artist: "Pierre-Auguste Renoir", year: "1880–1881",
      medium: "Öl auf Leinwand, 130,2 × 175,6 cm", home: "The Phillips Collection, Washington, D.C.",
      story: [
        "Schauplatz ist der Balkon der Maison Fournaise, eines bei Ruderern beliebten Restaurants an der Seine in Chatou. Renoir füllte die Szene mit seinen Freunden, die über mehrere Monate zum Modellsitzen kamen.",
        "Die junge Frau links, die mit einem Hündchen spielt, ist Aline Charigot, eine Näherin, die Renoir später heiratete. Der Mann rechts unten, der verkehrt herum auf einem Stuhl sitzt, ist der Maler Gustave Caillebotte, der seine Künstlerfreunde auch durch Ankäufe unterstützte.",
        "Der amerikanische Sammler Duncan Phillips kaufte das Bild 1923, und es ist bis heute das bekannteste Werk des von ihm gegründeten Museums."
      ] },
    "folies-bergere": {
      title: "Bar in den Folies-Bergère", artist: "Édouard Manet", year: "1882",
      medium: "Öl auf Leinwand, 96 × 130 cm", home: "The Courtauld Gallery, London",
      story: [
        "Es war Manets letztes großes Gemälde, entstanden, als er bereits schwer krank war. Die Bardame war eine echte Angestellte des Pariser Varietés namens Suzon, die ihm an einer im Atelier aufgebauten Theke Modell stand.",
        "Hinter ihr ist ein Spiegel, und das Spiegelbild stimmt nicht: Ihr Rücken erscheint weit nach rechts verschoben, und vor ihr steht ein Mann, der uns eigentlich die Sicht versperren müsste. Ob Manet das absichtlich tat, wird bis heute diskutiert.",
        "Oben links sieht man die grün beschuhten Füße einer Trapezkünstlerin. Die Flaschen auf der Theke mit dem roten Dreieck auf dem Etikett sind Bass Pale Ale."
      ] },
    "whistlers-mother": {
      title: "Whistlers Mutter", artist: "James McNeill Whistler", year: "1871",
      medium: "Öl auf Leinwand, 144,3 × 162,4 cm", home: "Musée d’Orsay, Paris",
      story: [
        "Der eigentliche Titel lautet „Arrangement in Grau und Schwarz Nr. 1“. Whistler wollte, dass man darin eine Studie von Farbe und Form sieht, und ärgerte sich, wenn man sich vor allem für die Dargestellte interessierte.",
        "Dargestellt ist seine Mutter, Anna McNeill Whistler. Einer Anekdote nach kam ein Modell nicht, und sie sprang ein. Langes Stehen war ihr zu anstrengend, daher malte Whistler sie sitzend.",
        "Der französische Staat kaufte das Bild 1891. In den 1930er-Jahren tourte es durch die USA, und 1934 erschien es auf einer amerikanischen Briefmarke zum Muttertag, was es zu einer Ikone der Mutterschaft machte."
      ] },
    "temeraire": {
      title: "Die letzte Fahrt der Temeraire", artist: "J. M. W. Turner", year: "1839",
      medium: "Öl auf Leinwand, 90,7 × 121,6 cm", home: "National Gallery, London",
      story: [
        "Die HMS Temeraire kämpfte 1805 in der Schlacht von Trafalgar. 1838 wurde das alte Kriegsschiff von einem Dampfschlepper die Themse hinaufgezogen, um abgewrackt zu werden. Turner zeigt das geisterhafte Segelschiff hinter dem dunklen, rauchenden Schlepper unter einem glühenden Sonnenuntergang.",
        "Das Bild wird oft als Abschied vom Zeitalter der Segelschiffe gelesen. Turner nahm sich Freiheiten: Die Masten waren damals schon entfernt.",
        "Er nannte es seinen „Liebling“, wollte es nicht verkaufen und vermachte es der Nation. 2005 wurde es in einer Umfrage der BBC zum größten britischen Gemälde gewählt, und 2020 erschien es neben Turner auf der 20-Pfund-Note der Bank of England."
      ] },
    "woman-in-gold": {
      title: "Bildnis Adele Bloch-Bauer I", artist: "Gustav Klimt", year: "1907",
      medium: "Öl, Silber und Blattgold auf Leinwand, 140 × 140 cm", home: "Neue Galerie, New York",
      story: [
        "Adele war die Frau von Ferdinand Bloch-Bauer, einem wohlhabenden Wiener Zuckerindustriellen, der das Porträt in Auftrag gab. Klimt arbeitete mehrere Jahre daran und überzog die Leinwand in seiner berühmten „Goldenen Periode“ mit echtem Blattgold und Silber.",
        "Nach dem „Anschluss“ Österreichs 1938 raubten die Nationalsozialisten das Bild der jüdischen Familie. Später hing es im Wiener Belvedere unter dem Titel „Die Dame in Gold“, der den Namen der jüdischen Dargestellten verschwieg.",
        "Adeles Nichte Maria Altmann verklagte Österreich und erhielt das Bild 2006 zurück. Danach wurde es an Ronald Lauder verkauft, Berichten zufolge für 135 Millionen Dollar, damals ein Rekord. Die Geschichte erzählt der Film „Die Frau in Gold“ von 2015."
      ] },
    "card-players": {
      title: "Die Kartenspieler", artist: "Paul Cézanne", year: "1890er-Jahre",
      medium: "Öl auf Leinwand", home: "Fünf Fassungen, in Paris, London, New York, Philadelphia und in Privatbesitz",
      story: [
        "Anfang der 1890er-Jahre malte Cézanne fünfmal Kartenspieler und ließ dafür Landarbeiter vom Familiengut bei Aix-en-Provence Modell sitzen. Von Fassung zu Fassung schrumpft die Szene, bis nur zwei Männer einander am Tisch gegenübersitzen.",
        "Niemand spricht, niemand lächelt, und die Karten sind kaum wichtig. Cézanne behandelte die Figuren fast wie Gegenstände eines Stilllebens und baute sie aus festen Farbflächen auf, ein Ansatz, der später den Kubismus inspirierte.",
        "Eine der Fassungen mit zwei Spielern aus Privatbesitz soll 2011 für über 250 Millionen Dollar an die Königsfamilie von Katar verkauft worden sein, einer der höchsten Preise, die je für ein Gemälde gezahlt wurden."
      ] },
    "irises": {
      title: "Schwertlilien", artist: "Vincent van Gogh", year: "1889",
      medium: "Öl auf Leinwand, 74,3 × 94,3 cm", home: "J. Paul Getty Museum, Los Angeles",
      story: [
        "Van Gogh malte die Schwertlilien in seiner ersten Woche in der Heilanstalt von Saint-Rémy, im Garten der Klinik. Er nannte die Malerei den Blitzableiter seiner Krankheit, eine Art, im Gleichgewicht zu bleiben.",
        "Suchen Sie die einzige weiße Iris zwischen den blauen. Die kräftigen Umrisse und flachen Farbflächen zeigen, wie viel er vom japanischen Holzschnitt gelernt hatte.",
        "Sein Bruder Theo schickte das Bild noch im selben Jahr zu einer Ausstellung in Paris. 1987 wurde es für 53,9 Millionen Dollar versteigert, damals ein Weltrekord. Das Getty Museum kaufte es 1990."
      ] },
    "wheatfield-crows": {
      title: "Weizenfeld mit Raben", artist: "Vincent van Gogh", year: "1890",
      medium: "Öl auf Leinwand, 50,5 × 103 cm", home: "Van Gogh Museum, Amsterdam",
      story: [
        "Van Gogh malte es im Juli 1890 in Auvers-sur-Oise, einem Dorf nördlich von Paris, wenige Wochen vor seinem Tod. Unter einem Gewitterhimmel führen drei Wege ins Weizenfeld und enden im Nichts, während schwarze Raben auffliegen.",
        "Oft heißt es, es sei sein letztes Bild, doch das ist ein Mythos: Briefe und andere Werke zeigen, dass er danach noch mehrere Leinwände malte.",
        "In einem Brief aus jenem Monat schrieb er von weiten Weizenfeldern unter aufgewühltem Himmel; er wolle Traurigkeit und äußerste Einsamkeit ausdrücken, aber auch die gesunde, stärkende Kraft, die er auf dem Land fand."
      ] },
    "composition-vii": {
      title: "Komposition VII", artist: "Wassily Kandinsky", year: "1913",
      medium: "Öl auf Leinwand, 200 × 300 cm", home: "Staatliche Tretjakow-Galerie, Moskau",
      story: [
        "Kandinsky gilt oft als Wegbereiter der abstrakten Kunst, und „Komposition VII“ hielt er für sein komplexestes Werk vor dem Ersten Weltkrieg. Er bereitete es mit über dreißig Zeichnungen, Aquarellen und Ölstudien vor.",
        "Nach all dieser Vorbereitung malte er die riesige endgültige Leinwand in nur etwa vier Tagen.",
        "Kandinsky verband Farbe mit Klang und nannte seine großen Werke „Kompositionen“, wie ein Komponist. Manche sehen darin verborgene Themen wie Sintflut, Auferstehung oder Jüngstes Gericht, aufgelöst in reine Farbe und Linie."
      ] }
  }
};
