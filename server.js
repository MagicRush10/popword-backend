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
    {
        id: 'q1',
        type: 'text',
        question: "Chi ha detto: 'L'unica cosa che dobbiamo temere è la paura stessa'?",
        answer: "Roosevelt",
        category: "Storia",
        hint: "Un famoso presidente americano."
    },
    {
        id: 'q2',
        type: 'image',
        question: "Da dove proviene questa immagine?",
        imageUrl: "/images/star_wars_vader.jpg", // Assicurati di avere questa immagine in public/images
        answer: "Star Wars",
        category: "Cinema",
        hint: "Una saga spaziale epica."
    },
    {
        id: 'q3',
        type: 'text',
        question: "Qual è la capitale del Giappone?",
        answer: "Tokyo",
        category: "Geografia",
        hint: "È una megalopoli asiatica."
    },
    {
        id: 'q4',
        type: 'text',
        question: "Chi ha dipinto la 'Gioconda'?",
        answer: "Leonardo da Vinci",
        category: "Arte",
        hint: "Artista rinascimentale italiano."
    },
    {
        id: 'q5',
        type: 'text',
        question: "Qual è l'elemento chimico con simbolo H?",
        answer: "Idrogeno",
        category: "Scienze",
        hint: "È il primo elemento della tavola periodica."
    },
    {
        id: 'q6',
        type: 'text',
        question: "In che anno è caduto il Muro di Berlino?",
        answer: "1989",
        category: "Storia",
        hint: "Un evento significativo alla fine della Guerra Fredda."
    },
    {
        id: 'q7',
        type: 'text',
        question: "Qual è il fiume più lungo del mondo?",
        answer: "Nilo",
        category: "Geografia",
        hint: "Scorre in Africa."
    },
    {
        id: 'q8',
        type: 'text',
        question: "Chi ha scritto 'Romeo e Giulietta'?",
        answer: "William Shakespeare",
        category: "Letteratura",
        hint: "Un drammaturgo inglese molto famoso."
    },
    {
        id: 'q9',
        type: 'text',
        question: "Qual è il pianeta più grande del sistema solare?",
        answer: "Giove",
        category: "Scienze",
        hint: "È un gigante gassoso."
    },
    {
        id: 'q10',
        type: 'text',
        question: "Chi ha composto la 'Nona Sinfonia'?",
        answer: "Beethoven",
        category: "Musica",
        hint: "Un compositore tedesco sordo."
    },
    {
        id: 'q11',
        type: 'text',
        question: "Qual è la valuta ufficiale del Regno Unito?",
        answer: "Sterlina",
        category: "Economia",
        hint: "Spesso associata a Londra."
    },
    {
        id: 'q12',
        type: 'text',
        question: "Qual è il nome scientifico dell'uomo?",
        answer: "Homo sapiens",
        category: "Scienze",
        hint: "La nostra specie."
    },
    {
        id: 'q13',
        type: 'text',
        question: "Chi ha fondato Microsoft?",
        answer: "Bill Gates",
        category: "Tecnologia",
        hint: "Un magnate dell'informatica."
    },
    {
        id: 'q14',
        type: 'text',
        question: "Qual è il colore primario che manca nel semaforo?",
        answer: "Blu",
        category: "Cultura Generale",
        hint: "Non è rosso, giallo o verde."
    },
    {
        id: 'q15',
        type: 'text',
        question: "Qual è l'organo più grande del corpo umano?",
        answer: "Pelle",
        category: "Scienze",
        hint: "Ti copre tutto."
    },
  {
        id: 'q16',
        type: 'text',
        question: "In One Piece, come si chiama il frutto del diavolo mangiato da Monkey D.Luffy?",
        answer: "Gum Gum",
        category: "Anime e Manga",
        hint: "Il frutto che lo rende un uomo di gomma."
    },
  {
        id: 'q17',
        type: 'text',
        question: "In One Piece, qual'è il nome della prima nave dei Mugiwara?",
        answer: "Going Merry",
        category: "Anime e Manga",
        hint: "La prima nave con la testa di capra."
    },
  {
        id: 'q18',
        type: 'text',
        question: "In One Piece, qual'è il soprannome di Roronoa Zoro?",
        answer: "Cacciatore di pirati",
        category: "Anime e Manga",
        hint: "Prima di entrare nella ciurma,ne andava a caccia."
    },
  {
        id: 'q19',
        type: 'text',
        question: "Nel manga di One Piece,qual'è il numero del capitolo dove appare per la prima volta Chopper?",
        answer: "134",
        category: "Anime e Manga",
        hint: "Compreso tra 120 e 140."
    },
  {
        id: 'q20',
        type: 'text',
        question: "In One piece, Qual è il nome dell'isola dove viene giustiziato Gol D. Roger?",
        answer: "Loguetown",
        category: "Anime e Manga",
        hint: "Situata nell'East Blue."
    },
  {
        id: 'q21',
        type: 'text',
        question: "In One Piece,Qual è il numero del capitolo finale della saga di Wano?",
        answer: "1057",
        category: "Anime e Manga",
        hint: "Compreso tra 1030 e 1060."
    },
  {
        id: 'q22',
        type: 'text',
        question: "In Dragon Ball,qual è il nome del pianeta natale dei Saiyan?",
        answer: "Vegeta",
        category: "Anime e Manga",
        hint: "Nome del principe dei Saiyan."
    },
  {
        id: 'q23',
        type: 'text',
        question: "In Dragon Ball,come si chiama la fusione tra Goku e Vegeta con gli orecchini Potara?",
        answer: "Vegeku",
        category: "Anime e Manga",
        hint: "Da non confondere con l'altra fusione."
    },
  {
        id: 'q24',
        type: 'text',
        question: "In Dragon Ball,come si chiama l'asssistente del Dio della Distruzione del 7 Universo?",
        answer: "Whis",
        category: "Anime e Manga",
        hint: "Appartenente alla razza aliena degli Angeli."
    },
  {
        id: 'q25',
        type: 'text',
        question: "In Dragon Ball,in quale capitolo si trasforma per la prima volta Freezer?",
        answer: "299",
        category: "Anime e Manga",
        hint: "Compreso tra 270 e 300."
    },
  {
        id: 'q26',
        type: 'text',
        question: "In Dragon Ball,qual è il numero del capitolo in cui Goku diventa Super Saiyan per la prima volta?",
        answer: "317",
        category: "Anime e Manga",
        hint: "Compreso tra 300 e 330."
    },
  {
        id: 'q27',
        type: 'text',
        question: "In Dragon Ball,qual è il numero del capitolo in cui Goku diventa Super Saiyan per la prima volta?",
        answer: "317",
        category: "Anime e Manga",
        hint: "Compreso tra 300 e 330."
    },
  {
        id: 'q28',
        type: 'text',
        question: "In Dragon Ball,a che età Piccolo sfida per la prima volta Goku?",
        answer: "3",
        category: "Anime e Manga",
        hint: "Sotto i 20."
    },
  {
        id: 'q29',
        type: 'text',
        question: "In Dragon Ball,qual è il luogo d'origine della danza della Fusione?",
        answer: "Metamor",
        category: "Anime e Manga",
        hint: "Li incontra Goku nell'aldilà."
    },
  {
        id: 'q30',
        type: 'text',
        question: "In Dragon Ball,a quanto tempo corrisponde un minuto nella Stanza dello Spirito e del Tempo?",
        answer: "6 ore",
        category: "Anime e Manga",
        hint: "Scrivi il numero + minuti/ore/giorni."
    },
  {
        id: 'q31',
        type: 'text',
        question: "In Jujustu Kaisen,qual è il nome del Re delle Maledizioni?",
        answer: "Sukuna",
        category: "Anime e Manga",
        hint: "Il più grande stregone mai esistito."
    },
  {
        id: 'q32',
        type: 'text',
        question: "In Jujustu Kaisen,qual è il nome della tecnica di Megumi Fushiguro?",
        answer: "Tecnica delle Dieci Ombre",
        category: "Anime e Manga",
        hint: "Nome completo in italiano."
    },
  {
        id: 'q33',
        type: 'text',
        question: "In Jujustu Kaisen,qual è il nome della maledizione che ha l'aspetto di un pesce?",
        answer: "Dagon",
        category: "Anime e Manga",
        hint: "Un famoso antagonista."
    },
  {
        id: 'q34',
        type: 'text',
        question: "In Jujustu Kaisen,qual è il nome del villaggio in cui è nato Yuji?",
        answer: "Sendai",
        category: "Anime e Manga",
        hint: "Villaggio nativo di Yuji e famosa città giapponese."
    },
  {
        id: 'q35',
        type: 'text',
        question: "In Jujustu Kaisen,chi è il Re dei Fratelli maledetti?",
        answer: "Choso",
        category: "Anime e Manga",
        hint: "Personaggio metà umano."
    },
  {
        id: 'q36',
        type: 'text',
        question: "In Jujustu Kaisen,qual è il numero del capitolo in cui Satoru Gojo viene sigillato?",
        answer: "90",
        category: "Anime e Manga",
        hint: "Compreso tra 70 e 100."
    },
  {
        id: 'q37',
        type: 'text',
        question: "In Attack on Titan,chi è il primo proprietario del Gigante Colossale?",
        answer: "Bertholdt",
        category: "Anime e Manga",
        hint: "Ragazzo molto silenzioso."
    },
  {
        id: 'q38',
        type: 'text',
        question: "In Attack on Titan,come si chiama il corpo che esplora oltre le mura della città?",
        answer: "Corpo di Ricerca",
        category: "Anime e Manga",
        hint: "Corpo scelto dal protagonista."
    },
  {
        id: 'q39',
        type: 'text',
        question: "In Attack on Titan,qual è il numero del capitolo in cui viene rivelata la verità sul mondo?",
        answer: "86",
        category: "Anime e Manga",
        hint: "Compreso tra 50 e 90."
    },
  {
        id: 'q40',
        type: 'text',
        question: "In Attack on Titan,qual è il nome del distretto dove vive Eren?",
        answer: "Shiganshina",
        category: "Anime e Manga",
        hint: "Luogo nativo del protagonista."
    },
  {
        id: 'q41',
        type: 'text',
        question: "In Attack on Titan,qual è il numero del capitolo finale?",
        answer: "Shiganshina",
        category: "Anime e Manga",
        hint: "Si dice che in giappone il numero successivo indichi la libertà, quella mai raggiunta da Eren."
    },
  {
        id: 'q42',
        type: 'text',
        question: "In Attack on Titan,qual è il nome della ragazza che indossa sempre una sciarpa rossa?",
        answer: "Mikasa",
        category: "Anime e Manga",
        hint: "Sorella adottiva di Eren."
    },
  {
        id: 'q43',
        type: 'text',
        question: "In Attack on Titan,cosa c'è dentro le mura?",
        answer: "Giganti",
        category: "Anime e Manga",
        hint: "Colpo di scena alla fine della 1 stagione."
    },
  {
        id: 'q44',
        type: 'text',
        question: "In Attack on Titan,di quale continente fa parte la città cinta da mura in cui vive Eren?",
        answer: "Paradis",
        category: "Anime e Manga",
        hint: "Isola dove tutto è nato."
    },
  {
        id: 'q45',
        type: 'text',
        question: "In Attack on Titan,quale arma anti Gigante ha sviluppato Hange?",
        answer: "Lance fulmine",
        category: "Anime e Manga",
        hint: "Arma usata per eliminare i giganti."
    },
  {
        id: 'q46',
        type: 'text',
        question: "In Attack on Titan,quanti giganti mutaforma esistono?",
        answer: "9",
        category: "Anime e Manga",
        hint: "Numero compreso tra 7 e 12."
    },
  {
        id: 'q47',
        type: 'image',
        question: "Come si chiama questo personaggio?",
        imageUrl: "/images/hange.jpg",
        answer: "Hange",
        category: "Anime e Manga",
        hint: "Comandante del Corpo di Ricerca dopo Erwin."
    },
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

