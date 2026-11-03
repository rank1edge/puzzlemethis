// Italian: interface text and painting texts.
// Keys and structure match the English in i18n.js and paintings.js; anything
// left out falls back to English.
export const LOCALE_IT = {
  code: "it",
  name: "Italiano",
  ui: {
    "app.tagline": "Sedici dipinti celebri da ricomporre",
    "stats.mainMenu": "Menu principale",
    "stats.round": "Turno",
    "stats.placed": "al loro posto",
    "btn.menu": "← Menu principale",
    "btn.menu.title": "Lascia questo tavolo e torna al menu principale",
    "btn.story": "Storia",
    "btn.gallery": "Dipinti",
    "btn.guide": "Guida",
    "btn.guide.title": "Mostra una copia tenue del dipinto sul piano. Se disattivata, il piano è sfocato.",
    "btn.guide.hardTitle": "Al livello difficile il piano è sempre sfocato",
    "btn.tidy": "Riordina",
    "btn.tidy.title": "Sparpaglia di nuovo i pezzi liberi intorno al piano",
    "btn.sound": "Suono",
    "lang.label": "Lingua",
    "canvas.label": "Tavolo del puzzle. Trascina i pezzi sul piano.",
    "hint": "Trascina un pezzo sul piano. Vicino al suo posto si incastra da solo.",

    "after.finished": "Completato",
    "after.next": "Dipinto successivo →",
    "after.story": "Leggi la storia",
    "after.wait": "{name} sceglie il prossimo dipinto",

    "menu.eyebrow": "Un gioco lento di dipinti celebri",
    "menu.lede": "Ricomponi sedici capolavori, da Leonardo a Hokusai, da solo o con gli amici allo stesso tavolo. Ogni dipinto completato ha la sua storia.",
    "menu.name": "Il tuo nome",
    "menu.name.placeholder": "Scrivi il tuo nome",
    "menu.colours": "Colore dell’avatar",
    "menu.colour": "Colore {n}",
    "menu.level": "Livello",
    "level.easy": "Facile",
    "level.medium": "Medio",
    "level.hard": "Difficile",
    "level.easy.note": "circa 16 pezzi",
    "level.medium.note": "circa 36 pezzi",
    "level.hard.note": "circa 100, guida sfocata",
    "menu.start": "Apri un tavolo",
    "menu.or": "oppure siediti al tavolo di un amico",
    "menu.code.placeholder": "Codice",
    "menu.code.label": "Codice del tavolo",
    "menu.join": "Entra",
    "menu.joinNote": "Giocherai al livello del tuo amico.",
    "menu.ownTable": "Preferisco aprire un tavolo mio",
    "menu.banner.title": "Sei invitato al tavolo {code}",
    "menu.banner.text": "Scrivi il tuo nome e premi Entra. Giocherai al livello di chi guida il tavolo.",

    "pop.eyebrow": "Sei invitato",
    "pop.title": "Entra al tavolo {code}",
    "pop.note": "Un amico ti ha mandato il link del suo tavolo. Giocherai al suo livello.",
    "pop.close": "Chiudi e vai al menu principale",
    "pop.code": "Codice del tavolo",
    "pop.join": "Entra al tavolo",

    "card.close": "Chiudi",
    "info.story": "La storia",
    "info.roundDone": "Turno {n} completato",
    "info.artist": "Artista",
    "info.made": "Data",
    "info.medium": "Tecnica",
    "info.home": "Dove si trova",
    "info.yourTime": "Il tuo tempo",
    "info.tableTime": "Tempo del tavolo",
    "info.level": "Livello",
    "info.levelValue": { one: "{level} · {n} pezzo", other: "{level} · {n} pezzi" },
    "info.next": "Dipinto successivo",
    "info.admire": "Ammira il dipinto",
    "info.wait": "{name} sceglie il prossimo dipinto.",

    "gal.eyebrow": "La collezione",
    "gal.title": "Scegli un dipinto",
    "gal.note": "Il puzzle in corso viene messo da parte e il dipinto scelto inizia come nuovo turno allo stesso livello, per tutto il tavolo.",
    "gal.noteFollower": "Solo {name}, che guida il tavolo, può scegliere il dipinto. Qui puoi sfogliare la collezione.",
    "gal.solved": "Completato",

    "inv.eyebrow": "Giocare insieme",
    "inv.title": "Invita gli amici",
    "inv.copyLink": "Copia il link",
    "inv.copyCode": "Copia il codice",
    "inv.linkCopied": "Link copiato",
    "inv.codeCopied": "Codice copiato",
    "inv.selected": "Selezionato. Copialo per inviarlo.",
    "inv.step1": "Invia il link. Apre questo tavolo: gli amici devono solo scrivere il nome e premere Entra.",
    "inv.step2": "Oppure invia il codice. Gli amici aprono il gioco e lo inseriscono sotto «oppure siediti al tavolo di un amico».",
    "inv.step3": "Guidi tu il tavolo: scegli ogni dipinto e puoi rimuovere chiunque entri.",
    "inv.claudeNote": "La pagina resta privata finché non la condividi con i tuoi amici dal menu Condividi. Per spostare i pezzi serve l’accesso da collaboratore o editor; con l’accesso in sola lettura possono guardare.",
    "inv.count": { one: "Al tavolo c’è {n} persona.", other: "Al tavolo ci sono {n} persone." },
    "inv.alone": "Non c’è ancora nessun altro.",
    "inv.off": "Qui i tavoli non possono collegarsi, quindi non è possibile invitare amici. Puoi continuare a giocare da solo.",

    "exit.eyebrow": "Menu principale",
    "exit.title": "Lasciare questo tavolo?",
    "exit.stay": "Continua a giocare",
    "exit.go": "Torna al menu principale",
    "progress.you": { one: "Hai messo {placed} pezzo su {n} di «{title}».", other: "Hai messo {placed} pezzi su {n} di «{title}»." },
    "progress.table": { one: "Il tuo tavolo ha messo {placed} pezzo su {n} di «{title}».", other: "Il tuo tavolo ha messo {placed} pezzi su {n} di «{title}»." },
    "exit.friendLeads": "Il tuo amico continua a giocare e la persona successiva guiderà il tavolo.",
    "exit.friendsLead": "I tuoi {n} amici continuano a giocare e la persona successiva guiderà il tavolo.",
    "exit.friend": "Il tuo amico continua a giocare senza di te.",
    "exit.friends": "I tuoi {n} amici continuano a giocare senza di te.",
    "exit.rejoin": "Puoi rientrare con il codice {code}.",
    "exit.notSaved": "Il puzzle non verrà salvato.",

    "switch.eyebrow": "Puzzle in corso",
    "switch.titleNew": "Iniziare «{title}»?",
    "switch.titleSame": "Ricominciare «{title}»?",
    "switch.clears": "Iniziando un nuovo dipinto andranno persi.",
    "switch.clearsTable": "Iniziando un nuovo dipinto andranno persi per tutto il tavolo.",
    "switch.mixes": "Ricominciando, tutti i pezzi verranno rimescolati.",
    "switch.mixesTable": "Ricominciando, tutti i pezzi verranno rimescolati per tutto il tavolo.",
    "switch.keep": "Continua «{title}»",
    "switch.go": "Inizia «{title}»",
    "switch.again": "Ricomincia",

    "kick.eyebrow": "Guida del tavolo",
    "kick.title": "Rimuovere {name}?",
    "kick.thisPlayer": "questo giocatore",
    "kick.note": "Lascerà subito il tavolo e non potrà rientrarvi. I pezzi che ha messo restano sul piano.",
    "kick.yes": "Rimuovi dal tavolo",
    "kick.no": "Continua insieme",

    "players.you": "tu",
    "players.leader": "guida",
    "players.guest": "ospite",
    "players.friend": "Amico",
    "players.invite": "Invita gli amici",
    "players.remove": "Rimuovi {name} dal tavolo",
    "players.watching": "Solo visione: per spostare i pezzi serve l’accesso in modifica",
    "leader.fallback": "Chi guida il tavolo",

    "msg.needName": "Prima scrivi il tuo nome, così gli amici sanno chi sei.",
    "msg.setting": "Stiamo preparando il tavolo…",
    "msg.codeLength": "Il codice di un tavolo ha 5 lettere e cifre.",
    "msg.looking": "Cerco il tavolo {code}…",
    "msg.noRooms": "Qui i tavoli non possono collegarsi. Puoi comunque aprire un tavolo tuo e giocare da solo.",
    "msg.banned": "{name} ti ha rimosso dal tavolo {code}, quindi non puoi rientrare.",
    "msg.nobody": "Al momento non c’è nessuno al tavolo {code}. Controlla il codice con il tuo amico o apri un tavolo tuo.",
    "msg.removed": "{name} ti ha rimosso dal tavolo."
  },
  paintings: {
    "mona-lisa": {
      title: "La Gioconda", artist: "Leonardo da Vinci", year: "1503–1519 circa",
      medium: "Olio su tavola di pioppo, 77 × 53 cm", home: "Museo del Louvre, Parigi",
      story: [
        "La donna ritratta è quasi certamente Lisa Gherardini, moglie del mercante di seta fiorentino Francesco del Giocondo: da qui il nome «Gioconda». Leonardo non consegnò mai il ritratto. Ci lavorò per anni e lo portò con sé in Francia, dove entrò nella collezione reale.",
        "Per secoli fu ammirata, ma non era famosa in tutto il mondo. Tutto cambiò nell’agosto del 1911, quando Vincenzo Peruggia, un operaio che aveva lavorato al Louvre, la portò via sotto il camice. La parete vuota finì sui giornali di mezzo mondo, e il dipinto restò scomparso per più di due anni, finché Peruggia non tentò di venderlo a Firenze e fu arrestato.",
        "Lo sfumato, i contorni morbidi e fumosi del volto, Leonardo lo ottenne con moltissimi strati sottilissimi di velatura. Oggi il dipinto è esposto dietro un vetro protettivo e attira milioni di visitatori ogni anno."
      ] },
    "starry-night": {
      title: "Notte stellata", artist: "Vincent van Gogh", year: "1889",
      medium: "Olio su tela, 73,7 × 92,1 cm", home: "Museum of Modern Art, New York",
      story: [
        "Van Gogh la dipinse nel giugno 1889 nell’ospedale di Saint-Paul-de-Mausole a Saint-Rémy-de-Provence, dove si era fatto ricoverare dopo una crisi. È la vista dalla finestra della sua camera, rivolta a est, poco prima dell’alba. Il paese con il campanile lo aggiunse di fantasia.",
        "Non gli era permesso dipingere in camera: lì faceva schizzi e lavorava alla tela di giorno, in uno studio al piano terra. La «stella» più luminosa vicino all’orizzonte è probabilmente Venere, visibile nel cielo dell’alba quel mese.",
        "Van Gogh stesso non teneva il quadro in grande considerazione. Morì l’anno dopo, e solo decenni più tardi l’opera divenne una delle immagini più note al mondo."
      ] },
    "scream": {
      title: "L’urlo", artist: "Edvard Munch", year: "1893",
      medium: "Tempera e pastello su cartone, 91 × 73,5 cm", home: "Museo nazionale, Oslo",
      story: [
        "Munch raccontò il momento da cui nacque: passeggiando al tramonto vicino a Oslo, il cielo si tinse di rosso sangue e sentì un grande urlo attraversare la natura. La figura più che urlare sente quell’urlo, con le mani premute sul capo.",
        "Ne esistono diverse versioni: due dipinti, due pastelli e una serie di litografie. Questo dipinto del 1893 fu rubato il giorno dell’apertura delle Olimpiadi invernali di Lillehammer, nel 1994: i ladri salirono con una scala e lasciarono un biglietto per ringraziare il museo della scarsa sorveglianza. Fu ritrovato pochi mesi dopo. Un’altra versione fu rapinata a mano armata dal Museo Munch nel 2004 e ritrovata due anni più tardi.",
        "Una minuscola scritta a matita nel cielo dice: «Può essere stato dipinto solo da un pazzo». A lungo la si attribuì a un vandalo. Nel 2021 il museo ha confermato che la grafia è dello stesso Munch."
      ] },
    "great-wave": {
      title: "La grande onda di Kanagawa", artist: "Katsushika Hokusai", year: "1831 circa",
      medium: "Xilografia, inchiostro e colori su carta, circa 26 × 38 cm", home: "Molte collezioni, tra cui il Met e il British Museum",
      story: [
        "È una stampa, non un dipinto unico. Apriva la serie di Hokusai Trentasei vedute del monte Fuji, e dalle matrici intagliate furono tirate migliaia di copie: per questo se ne trovano esemplari in musei di tutto il mondo.",
        "Hokusai aveva circa settant’anni. Oltre la cresta a forma di artiglio si scorge il monte Fuji, piccolo e calmo, nel cavo dell’onda, e tre barche veloci con i loro rematori.",
        "Il blu intenso è blu di Prussia, un pigmento sintetico arrivato da poco in Giappone. La stampa giunse poi in Europa e influenzò Monet, Van Gogh e il compositore Debussy."
      ] },
    "grande-jatte": {
      title: "Una domenica pomeriggio sull’isola della Grande-Jatte", artist: "Georges Seurat", year: "1884–1886",
      medium: "Olio su tela, 207,5 × 308,1 cm", home: "Art Institute of Chicago",
      story: [
        "Seurat lavorò circa due anni a questa enorme tela, che mostra parigini a riposo su un’isola della Senna. Fece decine di disegni e bozzetti a olio sul posto, poi costruì il quadro finale in studio.",
        "È l’esempio più celebre di puntinismo: invece di mescolare i colori sulla tavolozza, Seurat accostava piccoli punti di colore puro e lasciava che fosse l’occhio a fonderli. Si basava sulla scienza del colore del suo tempo.",
        "Cerca i dettagli: una donna che pesca, una scimmietta al guinzaglio, un trombettista. Più tardi Seurat aggiunse una cornice dipinta a puntini. Morì a soli 31 anni."
      ] },
    "impression-sunrise": {
      title: "Impressione, levar del sole", artist: "Claude Monet", year: "1872",
      medium: "Olio su tela, 48 × 63 cm", home: "Musée Marmottan Monet, Parigi",
      story: [
        "Monet dipinse il porto di Le Havre, la sua città, nella nebbia del mattino, con il sole arancione riflesso nell’acqua. Lo espose in una mostra indipendente a Parigi nel 1874.",
        "Il critico Louis Leroy derise il titolo in una recensione e chiamò l’intero gruppo «impressionisti». Gli artisti adottarono l’insulto come nome, e questa piccola tela diede il nome a un intero movimento.",
        "Il sole sembra brillante, ma ha quasi la stessa luminosità del cielo grigio intorno: a farlo risaltare è il contrasto di colore, non la luce. Rubato dal museo nel 1985, il quadro fu ritrovato in Corsica cinque anni dopo."
      ] },
    "water-lily-pond": {
      title: "Lo stagno delle ninfee", artist: "Claude Monet", year: "1899",
      medium: "Olio su tela", home: "Diverse versioni, tra cui alla National Gallery di Londra",
      story: [
        "Nella sua casa di Giverny, Monet deviò un ruscello per creare uno stagno, lo riempì di ninfee e vi costruì un ponte in stile giapponese. Diceva che il giardino era il suo capolavoro più bello.",
        "Dipinse il ponte e le ninfee ancora e ancora; le ninfee divennero il suo soggetto principale negli ultimi trent’anni di vita, circa 250 quadri in tutto.",
        "Negli ultimi anni la cataratta gli offuscò la vista e i suoi colori divennero più caldi e sfumati. Fu operato nel 1923 e continuò a dipingere fino alla morte, nel 1926."
      ] },
    "boating-party": {
      title: "La colazione dei canottieri", artist: "Pierre-Auguste Renoir", year: "1880–1881",
      medium: "Olio su tela, 130,2 × 175,6 cm", home: "The Phillips Collection, Washington",
      story: [
        "La scena è sulla terrazza della Maison Fournaise, un ristorante sulla Senna a Chatou amato dai canottieri. Renoir la riempì di amici, che vennero a posare per diversi mesi.",
        "La giovane a sinistra che gioca con un cagnolino è Aline Charigot, una sarta che in seguito sposò Renoir. L’uomo seduto a cavalcioni su una sedia, in basso a destra, è il pittore Gustave Caillebotte, che sosteneva gli amici artisti anche comprandone le opere.",
        "Il collezionista americano Duncan Phillips acquistò il quadro nel 1923, e ancora oggi è l’opera più famosa del museo da lui fondato."
      ] },
    "folies-bergere": {
      title: "Il bar delle Folies-Bergère", artist: "Édouard Manet", year: "1882",
      medium: "Olio su tela, 96 × 130 cm", home: "The Courtauld Gallery, Londra",
      story: [
        "Fu l’ultimo grande dipinto di Manet, realizzato quando era già gravemente malato. La barista era una vera dipendente del music-hall parigino, di nome Suzon, che posò per lui dietro un bancone allestito nello studio.",
        "Alle sue spalle c’è uno specchio, e il riflesso non torna: la sua schiena riflessa è spostata molto a destra, e davanti a lei compare un uomo che dovrebbe coprirci la vista. Se Manet l’abbia fatto apposta si discute ancora oggi.",
        "Nell’angolo in alto a sinistra si vedono i piedi con scarpette verdi di una trapezista. Sul bancone, le bottiglie con il triangolo rosso sull’etichetta sono di birra Bass."
      ] },
    "whistlers-mother": {
      title: "La madre di Whistler", artist: "James McNeill Whistler", year: "1871",
      medium: "Olio su tela, 144,3 × 162,4 cm", home: "Musée d’Orsay, Parigi",
      story: [
        "Il suo vero titolo è Arrangiamento in grigio e nero n. 1. Whistler voleva che fosse visto come uno studio di colore e forma, e mal sopportava chi si interessava soprattutto a chi fosse ritratto.",
        "La donna è sua madre, Anna McNeill Whistler. Secondo un aneddoto, una modella non si presentò e lei la sostituì. Stare in piedi a lungo la stancava, così Whistler la dipinse seduta.",
        "Lo Stato francese lo acquistò nel 1891. Negli anni Trenta il quadro girò gli Stati Uniti e nel 1934 comparve su un francobollo americano per la Festa della mamma, diventando un’icona della maternità."
      ] },
    "temeraire": {
      title: "Il Téméraire rimorchiato al suo ultimo ancoraggio", artist: "J. M. W. Turner", year: "1839",
      medium: "Olio su tela, 90,7 × 121,6 cm", home: "National Gallery, Londra",
      story: [
        "La HMS Temeraire combatté nella battaglia di Trafalgar nel 1805. Nel 1838 la vecchia nave da guerra fu rimorchiata lungo il Tamigi da un rimorchiatore a vapore per essere demolita. Turner mostra il veliero spettrale dietro il rimorchiatore scuro e fumante, sotto un tramonto infuocato.",
        "Viene spesso letto come un addio all’epoca della vela. Turner si prese qualche libertà: a quella data gli alberi della nave erano già stati rimossi.",
        "Lo chiamava il suo «tesoro», rifiutò di venderlo e lo lasciò alla nazione. Nel 2005 fu votato il più grande dipinto britannico in un sondaggio della radio della BBC, e nel 2020 è comparso sulla banconota da 20 sterline della Banca d’Inghilterra accanto a Turner."
      ] },
    "woman-in-gold": {
      title: "Ritratto di Adele Bloch-Bauer I", artist: "Gustav Klimt", year: "1907",
      medium: "Olio, argento e foglia d’oro su tela, 140 × 140 cm", home: "Neue Galerie, New York",
      story: [
        "Adele era la moglie di Ferdinand Bloch-Bauer, ricco industriale viennese dello zucchero che commissionò il ritratto. Klimt ci lavorò per diversi anni, coprendo la tela di vera foglia d’oro e d’argento durante il suo celebre «periodo aureo».",
        "Dopo l’annessione dell’Austria nel 1938, i nazisti sottrassero il dipinto alla famiglia ebrea. In seguito fu esposto al Belvedere di Vienna con il titolo «La signora in oro», che evitava di nominare la donna ebrea ritratta.",
        "La nipote di Adele, Maria Altmann, fece causa all’Austria e nel 2006 ottenne la restituzione del quadro. Fu poi venduto a Ronald Lauder per 135 milioni di dollari, secondo la stampa, un record per l’epoca. La vicenda è raccontata nel film Woman in Gold del 2015."
      ] },
    "card-players": {
      title: "I giocatori di carte", artist: "Paul Cézanne", year: "anni Novanta dell’Ottocento",
      medium: "Olio su tela", home: "Cinque versioni, a Parigi, Londra, New York, Filadelfia e in una collezione privata",
      story: [
        "All’inizio degli anni Novanta dell’Ottocento, Cézanne dipinse cinque volte dei giocatori di carte, facendo posare contadini della tenuta di famiglia vicino ad Aix-en-Provence. Di versione in versione la scena si stringe, fino a due uomini uno di fronte all’altro al tavolo.",
        "Nessuno parla, nessuno sorride, e le carte contano appena. Cézanne trattò le figure quasi come oggetti di natura morta, costruendole con blocchi di colore compatti, un approccio che in seguito ispirò il cubismo.",
        "Una delle versioni con due giocatori, di proprietà privata, sarebbe stata venduta nel 2011 alla famiglia reale del Qatar per oltre 250 milioni di dollari, uno dei prezzi più alti mai pagati per un dipinto."
      ] },
    "irises": {
      title: "Iris", artist: "Vincent van Gogh", year: "1889",
      medium: "Olio su tela, 74,3 × 94,3 cm", home: "J. Paul Getty Museum, Los Angeles",
      story: [
        "Van Gogh dipinse gli Iris nella sua prima settimana all’ospedale di Saint-Rémy, nel giardino della struttura. Diceva che la pittura era il parafulmine della sua malattia, un modo per restare in equilibrio.",
        "Cerca l’unico iris bianco tra quelli blu. I contorni decisi e le campiture piatte mostrano quanto avesse imparato dalle stampe giapponesi.",
        "Il fratello Theo lo inviò a una mostra a Parigi quello stesso anno. Nel 1987 fu venduto all’asta per 53,9 milioni di dollari, allora un record mondiale. Il Getty Museum lo acquistò nel 1990."
      ] },
    "wheatfield-crows": {
      title: "Campo di grano con volo di corvi", artist: "Vincent van Gogh", year: "1890",
      medium: "Olio su tela, 50,5 × 103 cm", home: "Museo Van Gogh, Amsterdam",
      story: [
        "Van Gogh lo dipinse nel luglio 1890 ad Auvers-sur-Oise, un villaggio a nord di Parigi, poche settimane prima di morire. Sotto un cielo in tempesta, tre sentieri si perdono in un campo di grano senza portare da nessuna parte, mentre si alzano in volo corvi neri.",
        "Spesso lo si definisce il suo ultimo quadro, ma è un mito: le lettere e altre opere mostrano che dopo dipinse ancora diverse tele.",
        "In una lettera di quel mese descrisse vasti campi di grano sotto cieli tormentati, con cui voleva esprimere tristezza e solitudine estrema, ma anche la forza sana e rigenerante che trovava nella campagna."
      ] },
    "composition-vii": {
      title: "Composizione VII", artist: "Vasilij Kandinskij", year: "1913",
      medium: "Olio su tela, 200 × 300 cm", home: "Galleria statale Tret’jakov, Mosca",
      story: [
        "Kandinskij è spesso considerato un pioniere dell’arte astratta, e riteneva Composizione VII l’opera più complessa realizzata prima della Prima guerra mondiale. La preparò con più di trenta disegni, acquerelli e studi a olio.",
        "Dopo tanta preparazione, dipinse l’enorme tela finale in circa quattro giorni.",
        "Kandinskij associava il colore al suono e chiamava le sue opere maggiori «composizioni», come un compositore. C’è chi vi vede temi nascosti, il diluvio, la resurrezione o il Giudizio universale, dissolti in puro colore e linea."
      ] }
  }
};
