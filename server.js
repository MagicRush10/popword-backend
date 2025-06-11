const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// Abilita CORS per tutte le origini o solo per la tua frontend
app.use(cors({
  origin: 'https://thewordgames.netlify.app',  // il dominio della tua app frontend
  methods: ["GET", "POST"],
  credentials: true
}));
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.use(express.static(path.join(__dirname, 'public')));





const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://thewordgames.netlify.app",  // IMPORTANTE
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Un client si è connesso');
  // gestione socket qui
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Server in ascolto');
});

const PORT = process.env.PORT || 3000;
const POINTS_TO_WIN = 10000; // Punteggio target per la vittoria
const QUESTION_TIME = 20; // Tempo per rispondere ad ogni domanda in secondi
const TIME_BETWEEN_ROUNDS = 5; // Tempo tra una domanda e l'altra


// --- Dati del gioco (simulazione di un DB) ---
const questions = [
  {id: 'q1', type: 'text', question: "Qual è il pianeta più vicino al Sole?", answer: "Mercurio", category: "Scienza", hint: "Piccolo e roccioso"},
  {id: 'q2', type: 'text', question: "Chi ha scritto 'La Divina Commedia'?", answer: "Dante Alighieri", category: "Letteratura", hint: "Poeta fiorentino"},
  {id: 'q3', type: 'text', question: "Qual è la capitale della Francia?", answer: "Parigi", category: "Geografia", hint: "Città delle luci"},
  {id: 'q4', type: 'text', question: "In che anno è caduto il muro di Berlino?", answer: "1989", category: "Storia", hint: "Fine anni '80"},
  {id: 'q5', type: 'text', question: "Chi ha dipinto la Gioconda?", answer: "Leonardo da Vinci", category: "Arte", hint: "Genio rinascimentale italiano"},
  {id: 'q6', type: 'text', question: "Qual è il simbolo chimico dell'acqua?", answer: "H2O", category: "Scienza", hint: "Due atomi di idrogeno + uno di ossigeno"},
  {id: 'q7', type: 'text', question: "Chi è l'autore della serie 'Harry Potter'?", answer: "J.K. Rowling", category: "Intrattenimento", hint: "Scrittrice britannica"},
  {id: 'q8', type: 'text', question: "Qual è il fiume più lungo del mondo?", answer: "Nilo", category: "Geografia", hint: "Scorre in Egitto"},
  {id: 'q9', type: 'text', question: "Qual è il muscolo più forte del corpo umano?", answer: "Massetere", category: "Scienza", hint: "Muscolo della masticazione"},
  {id: 'q10', type: 'text', question: "In che anno Cristoforo Colombo scoprì l'America?", answer: "1492", category: "Storia", hint: "Fine del Quattrocento"},
  {id: 'q11', type: 'text', question: "Qual è l'animale terrestre più veloce?", answer: "Ghepardo", category: "Scienza", hint: "Raggiunge i 100 km/h"},
  {id: 'q12', type: 'text', question: "Chi ha composto la Nona Sinfonia?", answer: "Beethoven", category: "Musica", hint: "Sinfonia con Inno alla Gioia"},
  {id: 'q13', type: 'text', question: "Qual è la valuta del Giappone?", answer: "Yen", category: "Economia", hint: "Simbolo ¥"},
  {id: 'q14', type: 'text', question: "Qual è il Monte più alto del mondo?", answer: "Everest", category: "Geografia", hint: "Si trova tra Nepal e Cina"},
  {id: 'q15', type: 'text', question: "Chi ha dipinto 'La Notte Stellata'?", answer: "Van Gogh", category: "Arte", hint: "Artista olandese"},
  {id: 'q16', type: 'text', question: "Chi ha vinto la Champions League 2024/2025?.", answer: "PSG", category: "Sport", hint: "Squadra francese"},
  {id: 'q17', type: 'text', question: "Qual è il gas più abbondante nell'atmosfera terrestre?", answer: "Azoto", category: "Scienza", hint: "Costituisce circa il 78%"},
  {id: 'q18', type: 'text', question: "Per quale film Leonardo DiCaprio ha vinto il suo primo Oscar?", answer: "The Revenant", category: "Cinema", hint: "Vincitore di 3 Oscar"},
  {id: 'q19', type: 'text', question: "Qual è la capitale del Brasile?", answer: "Brasilia", category: "Geografia", hint: "Città moderna costruita ex novo"},
  {id: 'q20', type: 'text', question: "In che anno è iniziata la Prima Guerra Mondiale?", answer: "1914", category: "Storia", hint: "Assassinio di Francesco Ferdinando"},
  {id: 'q21', type: 'text', question: "Chi ha scritto la musica dell'opera 'La Traviata'?", answer: "Giuseppe Verdi", category: "Musica", hint: "Compositore italiano"},
  {id: 'q22', type: 'text', question: "Qual è la formula chimica dell'anidride carbonica?", answer: "CO2", category: "Scienza", hint: "Un atomo di carbonio e due di ossigeno"},
  {id: 'q23', type: 'text', question: "Chi ha diretto il film 'Inception'?", answer: "Christopher Nolan", category: "Cinema", hint: "Regista britannico-americano"},
  {id: 'q24', type: 'text', question: "Qual è il laghetto più grande d'Italia?", answer: "Lago di Garda", category: "Geografia", hint: "Tra Lombardia, Veneto e Trentino"},
  {id: 'q25', type: 'text', question: "Chi ha scoperto la penicillina?", answer: "Alexander Fleming", category: "Scienza", hint: "Medico e biologo scozzese"},
  {id: 'q26', type: 'text', question: "Qual è la moneta ufficiale del Regno Unito?", answer: "Sterlina", category: "Economia", hint: "Pound sterling"},
  {id: 'q27', type: 'text', question: "Chi ha scritto '1984'?", answer: "George Orwell", category: "Letteratura", hint: "Romanzo distopico"},
  {id: 'q28', type: 'text', question: "Qual è la capitale dell'Australia?", answer: "Canberra", category: "Geografia", hint: "Non Sydney né Melbourne"},
  {id: 'q29', type: 'text', question: "In che anno è stato lanciato il primo uomo sulla Luna?", answer: "1969", category: "Storia", hint: "Missione Apollo 11"},
  {id: 'q30', type: 'text', question: "Qual è l'organo principale del sistema circolatorio umano?", answer: "Cuore", category: "Scienza", hint: "Pompa di sangue"},
  {id: 'q31', type: 'text', question: "Chi ha composto 'Il Barbiere di Siviglia'?", answer: "Gioachino Rossini", category: "Musica", hint: "Comico e italiano"},
  {id: 'q32', type: 'text', question: "Qual è stata la serie Netflix più vista nel 2020?", answer: "La casa di carta", category: "Serie TV", hint: "La più grande rapina della storia"},
  {id: 'q33', type: 'text', question: "Chi ha diretto il film 'Il Padrino'?", answer: "Francis Ford Coppola", category: "Cinema", hint: "Famiglia mafiosa"},
  {id: 'q34', type: 'text', question: "Qual è la montagna più alta d'Europa (oltre i confini asiatici)?", answer: "Monte Bianco", category: "Geografia", hint: "Al confine tra Francia e Italia"},
  {id: 'q35', type: 'text', question: "Chi ha scoperto l'America?", answer: "Cristoforo Colombo", category: "Storia", hint: "Navigatore genovese"},
  {id: 'q36', type: 'text', question: "Qual è il primo libro della Bibbia?", answer: "Genesi", category: "Letteratura", hint: "L'inizio di tutto"},
  {id: 'q37', type: 'text', question: "Dove si sono svolti i Giochi Olimpici del 1992?", answer: "Barcellona", category: "Sport", hint: "Città spagnola"},
  {id: 'q38', type: 'text', question: "Qual è la capitale del Canada?", answer: "Ottawa", category: "Geografia", hint: "Non Toronto né Vancouver"},
  {id: 'q39', type: 'text', question: "In che anno è caduta Roma (Fine dell'Impero Romano d'Occidente)?", answer: "476", category: "Storia", hint: "Quinta centuria d.C."},
  {id: 'q40', type: 'text', question: "Chi ha dipinto 'Il Bacio'?", answer: "Gustav Klimt", category: "Arte", hint: "Artista austriaco dorato"},
  {id: 'q41', type: 'text', question: "Chi era il cantante dei Queen?", answer: "Freddy Mercury", category: "Musica", hint: "Famoso per i suoi baffi"},
  {id: 'q42', type: 'text', question: "Chi ha composto 'La Bohème'?", answer: "Giacomo Puccini", category: "Musica", hint: "Verista italiano"},
  {id: 'q43', type: 'text', question: "Qual è la valenza del carbonio nei composti organici?", answer: "4", category: "Scienza", hint: "Tetraedrica struttura"},
  {id: 'q44', type: 'text', question: "Chi ha diretto 'Titanic' (1997)?", answer: "James Cameron", category: "Cinema", hint: "Regista canadese"},
  {id: 'q45', type: 'text', question: "Qual è il deserto più grande del mondo?", answer: "Sahara", category: "Geografia", hint: "In Africa settentrionale"},
  {id: 'q46', type: 'text', question: "Chi ha scoperto l'elettromagnetismo?", answer: "Hans Christian Orsted", category: "Scienza", hint: "Fisico danese"},
  {id: 'q47', type: 'text', question: "Qual è il simbolo chimico del ferro?", answer: "Fe", category: "Scienza", hint: "Dal latino Ferrum"},
  {id: 'q48', type: 'text', question: "Qual è l'album più venduto della storia?", answer: "Thriller", category: "Musica", hint: "Album del grande Michael Jackson"},
  {id: 'q49', type: 'text', question: "Qual è la capitale della Spagna?", answer: "Madrid", category: "Geografia", hint: "Nel centro della penisola iberica"},
  {id: 'q50', type: 'text', question: "In che anno fu fondata Roma, secondo la leggenda?", answer: "753 a.C.", category: "Storia", hint: "Romolo e Remo"},
  {id: 'q51', type: 'text', question: "Chi ha dipinto il 'Guernica'?", answer: "Pablo Picasso", category: "Arte", hint: "Spagnolo cubista"},
  {id: 'q52',type: 'text',question: "Chi ha vinto i Mondiali di calcio 2022?",answer: "Argentina",category: "Sport",hint: "Paese sudamericano guidato da Messi"},
  {id: 'q53',type: 'text',question: "Quante medaglie d'oro ha vinto Michael Phelps alle Olimpiadi?",answer: "23",category: "Sport",hint: "Più di 20"},
  {id: 'q54', type: 'text', question: "Qual è il più grande oceano del mondo?", answer: "Oceano Pacifico", category: "Geografia", hint: "Tra Asia e Americhe"},
  {id: 'q55', type: 'text', question: "Chi ha scoperto l'America per gli Europei (secondo la narrativa storica)?", answer: "Cristoforo Colombo", category: "Storia", hint: "1492"},
  {id: 'q56', type: 'text', question: "Qual è la particella con carica negativa presente nell'atomo?", answer: "Elettrone", category: "Scienza", hint: "Orbita intorno al nucleo"},
  {id: 'q57', type: 'text', question: "Chi ha diretto 'Pulp Fiction'?", answer: "Quentin Tarantino", category: "Cinema", hint: "Regista cult anni '90"},
  {id: 'q58', type: 'text', question: "Qual è la nazione più popolosa del mondo?", answer: "Cina", category: "Geografia", hint: "Oltre 1 miliardo di abitanti"},
  {id: 'q59', type: 'text', question: "In che anno terminò la Seconda Guerra Mondiale?", answer: "1945", category: "Storia", hint: "Caduta di Berlino e Hiroshima"},
  {id: 'q60', type: 'text', question: "Chi ha scritto 'Orgoglio e pregiudizio'?", answer: "Jane Austen", category: "Letteratura", hint: "Scrittrice inglese"},
  {id: 'q61', type: 'text', question: "Qual è il più piccolo stato del mondo?", answer: "Città del Vaticano", category: "Geografia", hint: "Enclave a Roma"},
  {id: 'q62', type: 'text', question: "Chi ha composto 'Le quattro stagioni'?", answer: "Antonio Vivaldi", category: "Musica", hint: "Barocco veneziano"},
  {id: 'q63', type: 'text', question: "Qual è l'unità di misura della corrente elettrica?", answer: "Ampere", category: "Scienza", hint: "Simbolo A"},
  {id: 'q64', type: 'text', question: "Chi ha dipinto 'La Creazione di Adamo'?", answer: "Michelangelo", category: "Arte", hint: "Soffitto della Cappella Sistina"},
  {id: 'q65', type: 'text', question: "Qual è la stella più vicina alla Terra (escluso il Sole)?", answer: "Proxima Centauri", category: "Scienza", hint: "Sistema Alpha Centauri"},
  {id: 'q66', type: 'text', question: "Chi ha diretto 'Il Cavaliere Oscuro'?", answer: "Christopher Nolan", category: "Cinema", hint: "Batman trilogy"},
  {id: 'q67', type: 'text', question: "Qual è la capitale dell'Italia?", answer: "Roma", category: "Geografia", hint: "Città Eterna"},
  {id: 'q68', type: 'text', question: "In che anno iniziò la Rivoluzione Francese?", answer: "1789", category: "Storia", hint: "Preso della Bastiglia"},
  {id: 'q69', type: 'text', question: "Chi ha scritto 'Moby Dick'?", answer: "Herman Melville", category: "Letteratura", hint: "Balena bianca"},
  {id: 'q70', type: 'text', question: "Qual è il gas responsabile dell'effetto serra più comune?", answer: "Anidride carbonica", category: "Scienza", hint: "CO₂"},
  {id: 'q71', type: 'text', question: "Chi ha composto 'Boléro'?", answer: "Maurice Ravel", category: "Musica", hint: "Ripetitivo crescendo"},
  {id: 'q72', type: 'text', question: "Qual è la capitale della Russia?", answer: "Mosca", category: "Geografia", hint: "Cremlino"},
  {id: 'q73', type: 'text', question: "In che anno cadde Costantinopoli?", answer: "1453", category: "Storia", hint: "Fine dell'Impero Bizantino"},
  {id: 'q74', type: 'text', question: "Chi ha dipinto 'Guernica'?", answer: "Pablo Picasso", category: "Arte", hint: "Protesta contro la guerra"},
  {id: 'q75', type: 'text', question: "Qual è l'unità di misura della frequenza?", answer: "Hertz", category: "Scienza", hint: "Cicli al secondo"},
  {id: 'q76', type: 'text', question: "Chi ha diretto 'Forrest Gump'?", answer: "Robert Zemeckis", category: "Cinema", hint: "Tom Hanks film"},
  {id: 'q77', type: 'text', question: "Qual è il continente più vasto?", answer: "Asia", category: "Geografia", hint: "Copre entrambi i fossati Europa/Asia"},
  {id: 'q78', type: 'text', question: "In che anno terminò la Guerra dei Cent'anni?", answer: "1453", category: "Storia", hint: "Francia vs Inghilterra"},
  {id: 'q79', type: 'text', question: "Chi ha scritto 'Guerra e Pace'?", answer: "Lev Tolstoj", category: "Letteratura", hint: "Romanzo russo epico"},
  {id: 'q80',type: 'text',question: "Qual è il nome dell'antica arma associata all'isola di Skypiea e menzionata da Nico Robin?",answer: "Poseidon",category: "Anime e Manga",hint: "È una delle tre armi ancestrali, ma il suo vero potere si scopre molto dopo"},
  {id: 'q81', type: 'text', question: "Chi ha composto la 'Grande Fuga' (The Great Escape Theme)?", answer: "Elmer Bernstein", category: "Musica", hint: "Colonna sonora celebre"},
  {id: 'q82', type: 'text', question: "Qual è la capitale dell'Egitto?", answer: "Il Cairo", category: "Geografia", hint: "Vicino alle piramidi"},
  {id: 'q83', type: 'text', question: "In che anno fu scoperta l'America da Colombo?", answer: "1492", category: "Storia", hint: "Ripetuta domanda sulle scoperte"},
  {id: 'q84', type: 'text', question: "Chi ha dipinto 'I Girasoli'?", answer: "Van Gogh", category: "Arte", hint: "Serie di fiori gialli"},
  {id: 'q85', type: 'text', question: "Qual è l'unità di misura della pressione?", answer: "Pascal", category: "Scienza", hint: "Pa"},
  {id: 'q86', type: 'text', question: "Chi ha diretto 'Schindler's List'?", answer: "Steven Spielberg", category: "Cinema", hint: "Olocausto film"},
  {id: 'q87', type: 'text', question: "Qual è l'isola più grande del mondo?", answer: "Groenlandia", category: "Geografia", hint: "Territorio danese"},
  {id: 'q88', type: 'text', question: "In che anno scoppiò la Rivoluzione americana?", answer: "1775", category: "Storia", hint: "Battaglia di Lexington"},
  {id: 'q89', type: 'text', question: "Chi ha scritto 'Don Chisciotte'?", answer: "Miguel de Cervantes", category: "Letteratura", hint: "Cavaliere spagnolo"},
  {id: 'q90', type: 'text', question: "Qual è la particella neutra nel nucleo atomico?", answer: "Neutrone", category: "Scienza", hint: "Insieme al protone"},
  {id: 'q91', type: 'text', question: "Chi ha composto il 'Boléro'?", answer: "Maurice Ravel", category: "Musica", hint: "Ripetitivo crescendo (ri‑rip.!!)"},
  {id: 'q92', type: 'text', question: "Qual è il mare che bagna le coste italiane orientali?", answer: "Adriatico", category: "Geografia", hint: "Tra Italia e Balcani"},
  {id: 'q93', type: 'text', question: "In che anno fu inventata la radio da Marconi?", answer: "1895", category: "Storia/Scienza", hint: "Fine XIX secolo"},
  {id: 'q94', type: 'text', question: "Chi ha dipinto 'Notte stellata sopra il Rodano'?", answer: "Van Gogh", category: "Arte", hint: "Van Gogh e stelle blu"},
  {id: 'q95', type: 'text', question: "Qual è l'unità di misura dell'energia?", answer: "Joule", category: "Scienza", hint: "Simbolo J"},
  {id: 'q96', type: 'text', question: "Chi ha diretto 'Avatar' (2009)?", answer: "James Cameron", category: "Cinema", hint: "Film 3D rivoluzionario"},
  {id: 'q97', type: 'text', question: "Qual è il fiume più lungo d'Italia?", answer: "Po", category: "Geografia", hint: "Scorre nell'Italia settentrionale"},
  {id: 'q98', type: 'text', question: "In che anno fu inventato l'automobile da Karl Benz?", answer: "1886", category: "Storia/Scienza", hint: "Primo motore a combustione"),
  {id: 'q99', type: 'text', question: "Chi ha scritto 'Il ritratto di Dorian Gray'?", answer: "Oscar Wilde", category: "Letteratura", hint: "Romanzo decadente"},
  {id: 'q100', type: 'text', question: "Qual è la particella con carica positiva nel protone?", answer: "Protone", category: "Scienza", hint: "Nucleo atomico"},
  {id: 'q101', type: 'text', question: "Come si chiama il protagonista di 'Naruto'?", answer: "Naruto", category: "Anime e Manga", hint: "Ninja biondo"},
  {id: 'q102', type: 'text', question: "In 'Dragon Ball', chi è il padre di Goku?", answer: "Bardack", category: "Anime e Manga", hint: "Saiyan guerriero"},
  {id: 'q103', type: 'text', question: "Qual è il nome dello Shinigami di Light Yagami?", answer: "Ryuk", category: "Anime e Manga", hint: "Mela e risate"},
  {id: 'q104', type: 'text', question: "Chi è l'autore di 'One Piece'?", answer: "Eiichiro Oda", category: "Anime e Manga", hint: "Mangaka giapponese"},
  {id: 'q105', type: 'text', question: "In 'Attack on Titan', come si chiama il protagonista?", answer: "Eren Jaeger", category: "Anime e Manga", hint: "Diventa un Titano"},
  {id: 'q106', type: 'text', question: "Qual è il potere di Lelouch in 'Code Geass'?", answer: "Geass", category: "Anime e Manga", hint: "Controlla la volontà"},
  {id: 'q107', type: 'text', question: "Chi è il rivale principale di Yugi in 'Yu-Gi-Oh!'?", answer: "Seto Kaiba", category: "Anime e Manga", hint: "Draghi bianchi"},
  {id: 'q108', type: 'text', question: "Qual è il nome del robot gigante in 'Neon Genesis Evangelion'?", answer: "Eva-01", category: "Anime e Manga", hint: "Pilotato da Shinji"},
  {id: 'q109', type: 'text', question: "Chi è l'autore di 'Berserk'?", answer: "Kentaro Miura", category: "Anime e Manga", hint: "Scomparso nel 2021"},
  {id: 'q110', type: 'text', question: "In 'Fullmetal Alchemist', chi è il fratello maggiore?", answer: "Edward Elric", category: "Anime e Manga", hint: "Alchimista di Stato"},
  {id: 'q111', type: 'text', question: "Qual è il frutto del diavolo di Luffy?", answer: "Gum Gum", category: "Anime e Manga", hint: "Lo trasforma in un uomo di gomma"},
  {id: 'q112', type: 'text', question: "Come si chiama il quirk di Izuku Midoriya?", answer: "One For All", category: "Anime e Manga", hint: "Ereditato da All Might"},
  {id: 'q113', type: 'text', question: "In 'Demon Slayer', chi è il fratello di Nezuko?", answer: "Tanjiro Kamado", category: "Anime e Manga", hint: "Porta sempre la spada"},
  {id: 'q114', type: 'text', question: "In 'Bleach', chi è il protagonista?", answer: "Ichigo Kurosaki", category: "Anime e Manga", hint: "Diventa un Soul Reaper"},
  {id: 'q115', type: 'text', question: "Come si chiama il dio della distruzione in 'Dragon Ball Super'?", answer: "Beerus", category: "Anime e Manga", hint: "Ama il budino"},
  {id: 'q116', type: 'text', question: "In 'Tokyo Ghoul', chi diventa un mezzo ghoul?", answer: "Ken Kaneki", category: "Anime e Manga", hint: "Capelli neri → bianchi"},
  {id: 'q117', type: 'text', question: "Come si chiama la scuola in 'My Hero Academia'?", answer: "U.A. High School", category: "Anime e Manga", hint: "Addestra giovani eroi"},
  {id: 'q118', type: 'text', question: "In 'One Punch Man', chi è l'eroe protagonista?", answer: "Saitama", category: "Anime e Manga", hint: "Calvo e fortissimo"},
  {id: 'q119', type: 'text', question: "Come si chiama la ragazza con i capelli blu in 'Re:Zero'?", answer: "Rem", category: "Anime e Manga", hint: "Gemella di Ram"},
  {id: 'q120', type: 'text', question: "Chi è il detective che dà la caccia a Kira in 'Death Note'?", answer: "L", category: "Anime e Manga", hint: "Mangia dolci e si accovaccia"}
];

// Mappa per tenere traccia delle lobby attive
const lobbies = {}; // lobbyId: { hostId, players: [{ id, name, score }], chatMessages: [], currentState, game: { ... } }
const playersInLobby = {}; // socket.id: lobbyId

// Funzione per generare un ID lobby casuale
function generateLobbyId() {
    let id;
    do {
        id = Math.random().toString(36).substring(2, 7).toUpperCase();
    } while (lobbies[id]);
    return id;
}

// Funzione per inviare la lista aggiornata dei giocatori a una lobby
function updateLobbyPlayers(lobbyId) {
    const lobby = lobbies[lobbyId];
    if (lobby) {
        io.to(lobbyId).emit('updatePlayersList', { players: lobby.players.map(p => ({ id: p.id, name: p.name, score: p.score })) });
    }
}

// Funzione per distribuire le categorie disponibili all'host
function sendAvailableCategories(lobbyId) {
    const lobby = lobbies[lobbyId];
    if (lobby && lobby.hostId) {
        const allCategories = [...new Set(questions.map(q => q.category))];
        io.to(lobby.hostId).emit('availableCategories', { categories: allCategories });
        // Imposta le categorie selezionate di default per la lobby all'inizio
        lobby.selectedCategories = allCategories;
        io.to(lobbyId).emit('updateSelectedCategories', { categories: allCategories });
    }
}

// Funzione per avviare il timer di gioco
function startQuestionTimer(lobbyId) {
    const lobby = lobbies[lobbyId];
    if (!lobby || lobby.game.timer) return; // Se il timer è già attivo o la lobby non esiste

    lobby.game.timeLeft = QUESTION_TIME;
    io.to(lobbyId).emit('timerUpdate', { timeLeft: lobby.game.timeLeft, players: lobby.players });

    lobby.game.timer = setInterval(() => {
        lobby.game.timeLeft--;
        if (lobby.game.timeLeft >= 0) {
            io.to(lobbyId).emit('timerUpdate', { timeLeft: lobby.game.timeLeft, players: lobby.players });
        } else {
            clearInterval(lobby.game.timer);
            lobby.game.timer = null;
            // Tempo scaduto, rivela la risposta e passa alla prossima domanda
            revealAnswerAndNextQuestion(lobbyId);
        }
    }, 1000);
}

// Funzione per passare alla prossima domanda o terminare il gioco
function nextQuestion(lobbyId) {
    const lobby = lobbies[lobbyId];
    if (!lobby) return;

    // Resetta lo stato di risposta dei giocatori per la nuova domanda
    lobby.players.forEach(p => p.hasAnsweredCorrectly = false);

    // Se ci sono ancora domande
    if (lobby.game.currentQuestionIndex < lobby.game.questionOrder.length) {
        lobby.game.currentQuestion = lobby.game.questionOrder[lobby.game.currentQuestionIndex];
        lobby.game.currentQuestionIndex++;
        lobby.game.timeLeft = QUESTION_TIME; // Reset del tempo
        lobby.game.hintUsed = false; // Reset dello stato del suggerimento
        lobby.game.playersAnswered = 0; // Reset dei contatori di risposta

        io.to(lobbyId).emit('newQuestion', {
            question: {
                id: lobby.game.currentQuestion.id,
                type: lobby.game.currentQuestion.type,
                question: lobby.game.currentQuestion.question,
                imageUrl: lobby.game.currentQuestion.imageUrl // Invia anche l'URL dell'immagine
            },
            timeLeft: lobby.game.timeLeft,
            players: lobby.players.map(p => ({ id: p.id, name: p.name, score: p.score })) // Invia i punteggi aggiornati
        });
        startQuestionTimer(lobbyId); // Avvia il timer per la nuova domanda
    } else {
        // Nessuna domanda rimasta o tempo scaduto, termina il gioco
        endGame(lobbyId);
    }
}

// Funzione per rivelare la risposta e passare alla prossima domanda dopo un ritardo
function revealAnswerAndNextQuestion(lobbyId) {
    const lobby = lobbies[lobbyId];
    if (!lobby) return;

    // Arresta qualsiasi timer in corso
    if (lobby.game.timer) {
        clearInterval(lobby.game.timer);
        lobby.game.timer = null;
    }
    if (lobby.game.roundEndTimer) {
        clearTimeout(lobby.game.roundEndTimer);
        lobby.game.roundEndTimer = null;
    }

    const correctAnswer = lobby.game.currentQuestion ? lobby.game.currentQuestion.answer : 'N/A';
    io.to(lobbyId).emit('roundEnded', {
        correctAnswer: correctAnswer,
        players: lobby.players.map(p => ({ id: p.id, name: p.name, score: p.score }))
        // Non inviamo playerGivenAnswer qui perché roundEnded è per tutti.
        // La logica di "tua risposta" è gestita lato client in base al feedback di 'answerResult'
    });

    // Avvia un timer per passare alla prossima domanda dopo un breve ritardo
    lobby.game.roundEndTimer = setTimeout(() => {
        // Controlla se qualcuno ha raggiunto il punteggio per vincere
        const winner = lobby.players.find(p => p.score >= POINTS_TO_WIN);
        if (winner) {
            endGame(lobbyId, winner.name);
        } else {
            nextQuestion(lobbyId);
        }
    }, TIME_BETWEEN_ROUNDS * 1000); // 5 secondi di pausa
}

// Funzione per terminare il gioco
function endGame(lobbyId, winnerName = null) {
    const lobby = lobbies[lobbyId];
    if (!lobby) return;

    if (lobby.game.timer) {
        clearInterval(lobby.game.timer);
        lobby.game.timer = null;
    }
    if (lobby.game.roundEndTimer) {
        clearTimeout(lobby.game.roundEndTimer);
        lobby.game.roundEndTimer = null;
    }

    lobby.currentState = 'gameOver';
    io.to(lobbyId).emit('gameOver', { winnerName: winnerName, players: lobby.players.map(p => ({ id: p.id, name: p.name, score: p.score })) });
}

io.on('connection', (socket) => {
    console.log(`[SERVER LOG] Utente connesso: ${socket.id}`);

    // --- Gestione Lobby ---
    socket.on('createLobby', ({ playerName }) => {
        const lobbyId = generateLobbyId();
        lobbies[lobbyId] = {
            hostId: socket.id,
            players: [{ id: socket.id, name: playerName, score: 0, hasAnsweredCorrectly: false }], // NUOVA LOGICA: Aggiungi stato risposta
            chatMessages: [],
            currentState: 'waiting', // waiting, inGame, gameOver
            selectedCategories: [], // Categorie selezionate per il gioco
            game: {
                questionOrder: [], // L'ordine delle domande per questa partita
                currentQuestionIndex: 0,
                currentQuestion: null,
                timer: null,
                roundEndTimer: null,
                timeLeft: QUESTION_TIME,
                hintUsed: false,
                playersAnswered: 0 // Quanti giocatori hanno risposto a questa domanda
            }
        };
        socket.join(lobbyId);
        playersInLobby[socket.id] = lobbyId;
        socket.emit('lobbyCreated', { lobbyId, playerName });
        updateLobbyPlayers(lobbyId);
        sendAvailableCategories(lobbyId); // Invia le categorie all'host
        console.log(`[SERVER LOG] Lobby creata: ${lobbyId} da ${playerName} (${socket.id})`);
    });

    socket.on('joinLobby', ({ playerName, lobbyId }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.currentState === 'waiting') {
            // Controlla se il nome è già in uso nella lobby
            const nameExists = lobby.players.some(p => p.name.toLowerCase() === playerName.toLowerCase());
            if (nameExists) {
                socket.emit('lobbyError', { message: 'Nome già in uso in questa lobby.' });
                return;
            }

            lobby.players.push({ id: socket.id, name: playerName, score: 0, hasAnsweredCorrectly: false }); // NUOVA LOGICA: Aggiungi stato risposta
            socket.join(lobbyId);
            playersInLobby[socket.id] = lobbyId;
            socket.emit('lobbyJoined', { lobbyId, playerName, isHost: false });
            io.to(lobbyId).emit('playerJoined', { playerName, lobbyId });
            updateLobbyPlayers(lobbyId);
            // Invia le categorie selezionate all'utente che si unisce (se già selezionate dall'host)
            io.to(socket.id).emit('updateSelectedCategories', { categories: lobby.selectedCategories || [] });
            console.log(`[SERVER LOG] Giocatore ${playerName} (${socket.id}) unito alla lobby: ${lobbyId}`);
        } else if (lobby && lobby.currentState !== 'waiting') {
            socket.emit('lobbyError', { message: 'La lobby è già in gioco o terminata.' });
        } else {
            socket.emit('lobbyError', { message: 'Lobby non trovata.' });
        }
    });

    socket.on('leaveLobby', ({ lobbyId }) => {
        const lobby = lobbies[lobbyId];
        if (lobby) {
            // Rimuovi il giocatore dalla lobby
            lobby.players = lobby.players.filter(p => p.id !== socket.id);
            socket.leave(lobbyId);
            delete playersInLobby[socket.id];
            io.to(lobbyId).emit('playerLeft', { playerName: socket.id, lobbyId }); // Potresti passare il nome del giocatore
            updateLobbyPlayers(lobbyId);
            console.log(`[SERVER LOG] Giocatore ${socket.id} ha lasciato la lobby: ${lobbyId}`);

            // Se la lobby si svuota, eliminala
            if (lobby.players.length === 0) {
                if (lobby.game.timer) clearInterval(lobby.game.timer);
                if (lobby.game.roundEndTimer) clearTimeout(lobby.game.roundEndTimer);
                delete lobbies[lobbyId];
                console.log(`[SERVER LOG] Lobby ${lobbyId} eliminata (vuota).`);
            } else if (lobby.hostId === socket.id) {
                // Se l'host ha lasciato, nomina un nuovo host
                const newHost = lobby.players[0]; // Il primo giocatore rimasto diventa il nuovo host
                lobby.hostId = newHost.id;
                io.to(lobbyId).emit('hostChanged', { newHostName: newHost.name, newHostId: newHost.id });
                // Il nuovo host riceve le categorie
                io.to(newHost.id).emit('availableCategories', { categories: [...new Set(questions.map(q => q.category))] });
                console.log(`[SERVER LOG] Host di ${lobbyId} cambiato in ${newHost.name} (${newHost.id}).`);
            }
        }
    });

    // --- Chat della Lobby ---
    socket.on('chatMessage', ({ lobbyId, message }) => {
        const lobby = lobbies[lobbyId];
        if (lobby) {
            const player = lobby.players.find(p => p.id === socket.id);
            if (player) {
                io.to(lobbyId).emit('chatMessage', { sender: player.name, message });
            }
        }
    });

    // --- Selezione Categorie (Host) ---
    socket.on('requestAvailableCategories', ({ lobbyId }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.hostId === socket.id) {
            sendAvailableCategories(lobbyId);
        }
    });

    socket.on('updateSelectedCategories', ({ lobbyId, categories }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.hostId === socket.id) {
            lobby.selectedCategories = categories;
            io.to(lobbyId).emit('updateSelectedCategories', { categories });
            console.log(`[SERVER LOG] Categorie selezionate per lobby ${lobbyId}: ${categories.join(', ')}`);
        }
    });

    // --- Gestione Gioco ---
    socket.on('startGame', ({ lobbyId }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.hostId === socket.id && lobby.players.length >= 2 && lobby.currentState === 'waiting') {
            lobby.currentState = 'inGame';
            // Filtra le domande in base alle categorie selezionate
            const gameQuestions = questions.filter(q => lobby.selectedCategories.includes(q.category));
            if (gameQuestions.length === 0) {
                // Gestisci il caso in cui non ci sono domande per le categorie selezionate
                socket.emit('lobbyError', { message: 'Nessuna domanda trovata per le categorie selezionate. Seleziona più categorie.' });
                lobby.currentState = 'waiting'; // Torna allo stato di attesa
                return;
            }
            // Mescola le domande e assegna l'ordine per questa partita
            lobby.game.questionOrder = gameQuestions.sort(() => 0.5 - Math.random());
            lobby.game.currentQuestionIndex = 0;
            lobby.players.forEach(p => p.score = 0); // Resetta i punteggi all'inizio del gioco
            // NUOVA LOGICA: Resetta lo stato di risposta dei giocatori
            lobby.players.forEach(p => p.hasAnsweredCorrectly = false);

            io.to(lobbyId).emit('gameStarted', {
                players: lobby.players.map(p => ({ id: p.id, name: p.name, score: p.score })),
                categories: lobby.selectedCategories
            });
            console.log(`[SERVER LOG] Gioco iniziato nella lobby: ${lobbyId}`);
            nextQuestion(lobbyId); // Inizia la prima domanda
        } else {
            console.log(`[SERVER LOG] Errore: Impossibile avviare il gioco nella lobby ${lobbyId}. Host: ${socket.id === lobby.hostId}, Giocatori: ${lobby.players.length}, Stato: ${lobby.currentState}`);
            socket.emit('lobbyError', { message: 'Impossibile avviare il gioco. Assicurati di essere l\'host e ci siano almeno 2 giocatori.' });
        }
    });

    socket.on('submitAnswer', ({ lobbyId, answer }) => {
        const lobby = lobbies[lobbyId];
        if (!lobby || lobby.currentState !== 'inGame') {
            return;
        }

        const player = lobby.players.find(p => p.id === socket.id);
        if (!player) {
            return;
        }

        // NUOVA LOGICA: Se il giocatore ha già risposto correttamente, ignora risposte successive
        if (player.hasAnsweredCorrectly) {
            return;
        }

        const currentQuestion = lobby.game.currentQuestion;
        if (!currentQuestion) {
            return;
        }

        const isCorrect = answer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();

        let scoreChange = 0;
        if (isCorrect) {
            const timeElapsed = QUESTION_TIME - lobby.game.timeLeft;
            // Punti in base al tempo, con un minimo e massimo
            scoreChange = Math.max(50, 200 - (timeElapsed * 5)); // Es. 200 punti al tempo 0, 50 punti al tempo 30s
            player.score += scoreChange;
            player.hasAnsweredCorrectly = true; // NUOVA LOGICA: Imposta lo stato di risposta corretta

            // Incrementa il contatore delle risposte corrette totali per la domanda
            lobby.game.playersAnswered++;

            // Invia il risultato della risposta SOLO al giocatore che ha risposto
            socket.emit('answerResult', {
                isCorrect: true,
                scoreChange: scoreChange,
                playerId: socket.id,
                totalScore: player.score,
                currentQuestionId: currentQuestion.id // Per riferire a quale domanda si è risposto
            });

        } else {
            // Se la risposta è sbagliata, invia il risultato al giocatore
            // Non incrementa playersAnswered, può riprovare
            socket.emit('answerResult', {
                isCorrect: false,
                scoreChange: 0,
                playerId: socket.id,
                totalScore: player.score,
                currentQuestionId: currentQuestion.id
            });
        }

        // Aggiorna la classifica per tutti i giocatori nella lobby
        io.to(lobbyId).emit('updateGameLeaderboard', lobby.players.map(p => ({
            id: p.id,
            name: p.name,
            score: p.score
        })));

        // MODIFICA ESISTENTE: Controlla se tutti i giocatori NECESSARI hanno risposto correttamente
        // Non tutti i giocatori devono rispondere, solo quelli che non hanno ancora indovinato
        const playersStillNeedingToAnswer = lobby.players.filter(p => !p.hasAnsweredCorrectly);
        if (playersStillNeedingToAnswer.length === 0) {
            // Se tutti i giocatori hanno risposto correttamente, finisci il round in anticipo
            revealAnswerAndNextQuestion(lobbyId);
        }
    });

    socket.on('revealHint', ({ lobbyId }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.currentState === 'inGame' && lobby.game.currentQuestion && !lobby.game.hintUsed) {
            lobby.game.hintUsed = true;
            io.to(lobbyId).emit('hintRevealed', { hint: lobby.game.currentQuestion.hint });
        }
    });

    // --- Chat di gioco ---
    socket.on('gameChatMessage', ({ lobbyId, message }) => {
        const lobby = lobbies[lobbyId];
        if (lobby) {
            const player = lobby.players.find(p => p.id === socket.id);
            if (player) {
                io.to(lobbyId).emit('gameChatMessage', { sender: player.name, message });
            }
        }
    });

    // --- Fine Partita / Gioca di Nuovo ---
    socket.on('playAgain', ({ lobbyId }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.hostId === socket.id && lobby.currentState === 'gameOver') {
            // Reset dello stato della lobby per una nuova partita
            lobby.currentState = 'waiting';
            lobby.game = {
                questionOrder: [],
                currentQuestionIndex: 0,
                currentQuestion: null,
                timer: null,
                roundEndTimer: null,
                timeLeft: QUESTION_TIME,
                hintUsed: false,
                playersAnswered: 0
            };
            lobby.players.forEach(p => {
                p.score = 0; // Resetta i punteggi
                p.hasAnsweredCorrectly = false; // NUOVA LOGICA: Resetta lo stato di risposta
            });
            // Riemetti le categorie di default per l'host per la nuova partita
            lobby.selectedCategories = [...new Set(questions.map(q => q.category))];

            io.to(lobbyId).emit('gameReset', {
                lobbyId: lobbyId,
                players: lobby.players.map(p => ({ id: p.id, name: p.name, score: p.score }))
            });
            // Invia le categorie all'host per la nuova partita
            sendAvailableCategories(lobbyId);
            console.log(`[SERVER LOG] Lobby ${lobbyId} resettata per una nuova partita.`);
        }
    });

    socket.on('returnToLobbyFromEndGame', ({ lobbyId }) => {
        const lobby = lobbies[lobbyId];
        if (lobby && lobby.currentState === 'gameOver') {
            // Se un non-host vuole tornare alla lobby, semplicemente aggiorna la sua vista
            // Il server non cambia lo stato della lobby a meno che non sia l'host a decidere di "Giocare di nuovo"
            // o se la lobby si svuota.
            // Per il non-host, la sua interfaccia tornerà alla lobby, la logica è lato client.
            // Se l'host torna alla lobby, viene gestito da 'playAgain' (che resetta la lobby)
            // o da 'leaveLobby' se l'host vuole abbandonare.
            // Questo listener è più per coerenza lato client.
            console.log(`[SERVER LOG] Giocatore ${socket.id} chiede di tornare alla lobby da fine gioco.`);
            // Aggiorna solo i giocatori correnti e la chat della lobby
            updateLobbyPlayers(lobbyId); // Assicurati che il client veda la lista corretta
            // Potresti inviare la chat della lobby se è persistente
        }
    });

    // --- Gestione Disconnessione / Riconnessione ---
    socket.on('disconnect', () => {
        console.log(`[SERVER LOG] Utente disconnesso: ${socket.id}`);
        const lobbyId = playersInLobby[socket.id];
        if (lobbyId) {
            const lobby = lobbies[lobbyId];
            if (lobby) {
                // Rimuovi il giocatore dalla lobby
                lobby.players = lobby.players.filter(p => p.id !== socket.id);
                delete playersInLobby[socket.id];
                io.to(lobbyId).emit('playerLeft', { playerName: socket.id, lobbyId }); // Potrebbe essere il nome del giocatore
                updateLobbyPlayers(lobbyId);

                // Se la lobby si svuota
                if (lobby.players.length === 0) {
                    if (lobby.game.timer) clearInterval(lobby.game.timer);
                    if (lobby.game.roundEndTimer) clearTimeout(lobby.game.roundEndTimer);
                    delete lobbies[lobbyId];
                    console.log(`[SERVER LOG] Lobby ${lobbyId} eliminata (vuota dopo disconnessione).`);
                } else if (lobby.hostId === socket.id) {
                    // Se l'host si è disconnesso, nomina un nuovo host
                    const newHost = lobby.players[0]; // Il primo giocatore rimasto
                    lobby.hostId = newHost.id;
                    io.to(lobbyId).emit('hostChanged', { newHostName: newHost.name, newHostId: newHost.id });
                    // Tutti i giocatori nella lobby vengono notificati del cambio host
                    // Il nuovo host riceve le categorie
                    io.to(newHost.id).emit('availableCategories', { categories: [...new Set(questions.map(q => q.category))] });
                    // Tutti i giocatori nella lobby dovrebbero essere reindirizzati alla lobby screen
                    // o comunque vedere lo stato aggiornato
                    io.to(lobbyId).emit('kickedFromLobby', { lobbyId: lobbyId, message: `L'host si è disconnesso. ${newHost.name} è il nuovo host.` });
                    console.log(`[SERVER LOG] Host di ${lobbyId} cambiato in ${newHost.name} (${newHost.id}) a causa di disconnessione.`);
                }
            }
        }
    });

    socket.on('rejoinLobby', ({ lobbyId, playerName }) => {
        const lobby = lobbies[lobbyId];
        if (lobby) {
            // Controlla se un giocatore con questo ID esiste già
            const existingPlayer = lobby.players.find(p => p.id === socket.id);
            if (existingPlayer) {
                console.log(`[SERVER LOG] Riconnessione di giocatore esistente: ${playerName} (${socket.id}) nella lobby ${lobbyId}`);
                socket.emit('lobbyJoined', { lobbyId, playerName: existingPlayer.name, isHost: socket.id === lobby.hostId });
                updateLobbyPlayers(lobbyId);
            } else {
                console.log(`[SERVER LOG] Tentativo di riconnessione come nuovo giocatore: ${playerName} (${socket.id}) nella lobby ${lobbyId}`);
                // Se vuoi preservare il punteggio, dovresti avere un ID utente persistente o cercarlo per nome
                lobby.players.push({ id: socket.id, name: playerName, score: 0, hasAnsweredCorrectly: false }); // Aggiungi come nuovo giocatore (o ripristina punteggio se hai ID persistenti)
                socket.join(lobbyId);
                playersInLobby[socket.id] = lobbyId;
                socket.emit('lobbyJoined', { lobbyId, playerName, isHost: socket.id === lobby.hostId });
                io.to(lobbyId).emit('playerJoined', { playerName, lobbyId });
                updateLobbyPlayers(lobbyId);
            }
        } else {
            socket.emit('lobbyError', { message: 'Lobby non trovata per la riconnessione.' });
        }
    });
});

