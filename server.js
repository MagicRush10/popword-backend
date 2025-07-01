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
const POINTS_TO_WIN = 2000; // Punteggio target per la vittoria
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
        type: 'text',
        question: "In quale film Leonardo DiCaprio interpreta il personaggio di Jack Dawson?",
        answer: "Titanic",
        category: "Cinema",
        hint: "Film tragico."
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
        answer: "Shakespeare",
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
        category: "Indovinelli",
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
        type: 'text',
        question: "In Attack on Titan,che rapporto ha Kenny lo Squartatore con Levi Ackerman?",
        answer: "Zio",
        category: "Anime e Manga",
        hint: "Rapporto con la madre."
    },
  {
        id: 'q48',
        type: 'text',
        question: "In Blue Lock,qual è il soprannome di Yoichi Isagi?",
        answer: "Reazionario",
        category: "Anime e Manga",
        hint: "Soprannome che significa non progressista."
    },
  {
        id: 'q49',
        type: 'text',
        question: "In Blue Lock,chi è il genio attaccante che Isagi vuole superare?",
        answer: "Rin Itoshi",
        category: "Anime e Manga",
        hint: "Considerato il più forte."
    },
  {
        id: 'q50',
        type: 'text',
        question: "In Blue Lock,chi è il giocatore che è ossessionato dal flow?",
        answer: "Rensuke Kunigami",
        category: "Anime e Manga",
        hint: "Ragazzo dai capelli biondi."
    },
  {
        id: 'q51',
        type: 'text',
        question: "In Blue Lock,qual è il nome della squadra formata dai migliori giocatori del Blue Lock?",
        answer: "Blue Lock Eleven",
        category: "Anime e Manga",
        hint: "Nazionale Under20 giapponese."
    },
  {
        id: 'q52',
        type: 'text',
        question: "In Blue Lock,chi è il giocatore con i capelli rosa che è molto orgoglioso?",
        answer: "Reo Mikage",
        category: "Anime e Manga",
        hint: "Ragazzo molto ricco."
    },
  {
        id: 'q53',
        type: 'text',
        question: "In Blue Lock,qual è il nome del giocatore che è il genio silenzioso?",
        answer: "Yo Hiori",
        category: "Anime e Manga",
        hint: "Figlio di atleti."
    },
  {
        id: 'q54',
        type: 'text',
        question: "In Blue Lock,qual è il numero del capitolo in cui Isagi segna il suo primo gol egoistico?",
        answer: "27",
        category: "Anime e Manga",
        hint: "Compreso tra 10 e 30"
    },
   {
        id: 'q55',
        type: 'text',
        question: "In Blue Lock,qual è il numero del capitolo in cui la squadra del Blue Lock affronta la squadra nazionale giovanile?",
        answer: "125",
        category: "Anime e Manga",
        hint: "Compreso tra 100 e 130"
    },
   {
        id: 'q56',
        type: 'text',
        question: "In Blue Lock,qual è il nome del club italiano in cui un giocatore del Blue Lock va a giocare?",
        answer: "Ubers",
        category: "Anime e Manga",
        hint: "Probabilmente si ispira alla Juventus."
    },
  {
        id: 'q57',
        type: 'text',
        question: "In Blue Lock,qual è il nome della prima fase del Blue Lock?",
        answer: "Prima Selezione",
        category: "Anime e Manga",
        hint: "La prima fase dove si sfidano le squadre."
    },
   {
        id: 'q58',
        type: 'text',
        question: "In Blue Lock,qual è il nome della prima fase del Blue Lock?",
        answer: "Prima Selezione",
        category: "Anime e Manga",
        hint: "La prima fase dove si sfidano le squadre."
    },
   {
        id: 'q59',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/hange.jpg",
        question: "Come si chiama questo personaggio?",
        answer: "Hange",
        category: "Anime e Manga",
        hint: "Comandante del Corpo di Ricerca dopo Erwin."
    },
  {
        id: 'q60',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/lucario.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Lucario",
        category: "Pokemon",
        hint: "Pokemon tipo Lotta/Acciaio di quarta generazione."
    },
  {
        id: 'q61',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/gengar.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Gengar",
        category: "Pokemon",
        hint: "Pokemon tipo Spettro molto famoso."
    },
  {
        id: 'q62',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/volbeat.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Volbeat",
        category: "Pokemon",
        hint: "Pokemon tipo Coleottero."
    },
  {
        id: 'q63',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/leavanny.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Leavanny",
        category: "Pokemon",
        hint: "Pokemon tipo Coleottero/Erba."
    },
  {
        id: 'q64',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/galvantula.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Galvantula",
        category: "Pokemon",
        hint: "Pokemon tipo Elettro/Coleottero."
    },
  {
        id: 'q65',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/centiskorch.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Centiskorch",
        category: "Pokemon",
        hint: "Pokemon tipo Fuoco/Coleottero."
    },
  {
        id: 'q66',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/vespiqueen.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Vespiqueen",
        category: "Pokemon",
        hint: "Pokemon tipo Coleottero/Volante."
    },
  {
        id: 'q67',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/wobbuffet.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Wobbuffet",
        category: "Pokemon",
        hint: "Pokemon tipo Psico."
    },
  {
        id: 'q68',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/starmie.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Starmie",
        category: "Pokemon",
        hint: "Pokemon tipo Acqua/Psico."
    },
  {
        id: 'q69',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/munna.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Munna",
        category: "Pokemon",
        hint: "Pokemon tipo Psico."
    },
  {
        id: 'q70',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/gardevoir.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Gardevoir",
        category: "Pokemon",
        hint: "Pokemon tipo Psico/Folletto."
    },
  {
        id: 'q71',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/aurorus.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Aurorus",
        category: "Pokemon",
        hint: "Pokemon tipo Roccia/Ghiaccio."
    },
  {
        id: 'q72',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/delibird.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Delibird",
        category: "Pokemon",
        hint: "Pokemon tipo Ghiaccio/Volante."
    },
    {
        id: 'q73',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/piloswine.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Piloswine",
        category: "Pokemon",
        hint: "Pokemon tipo Ghiaccio/Terra."
    },
    {
        id: 'q74',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/weavile.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Weavile",
        category: "Pokemon",
        hint: "Pokemon tipo Buio/Ghiaccio."
    },
  {
        id: 'q75',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/vanilluxe.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Vanilluxe",
        category: "Pokemon",
        hint: "Pokemon tipo Ghiaccio."
    },
  {
        id: 'q76',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/fuecoco.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Fuecoco",
        category: "Pokemon",
        hint: "Pokemon tipo Fuoco."
    },
  {
        id: 'q77',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/drifblim.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Drifblim",
        category: "Pokemon",
        hint: "Pokemon tipo Spettro/Volante."
    },
  {
        id: 'q78',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/jellicent.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Jellicent",
        category: "Pokemon",
        hint: "Pokemon tipo Acqua/Spettro."
    },
  {
        id: 'q79',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/palossand.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Palossand",
        category: "Pokemon",
        hint: "Pokemon tipo Spettro/Terra."
    }, 
  {
        id: 'q80',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/persian.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Persian",
        category: "Pokemon",
        hint: "Pokemon tipo Normale."
    },
  {
        id: 'q81',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/snorlax.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Snorlax",
        category: "Pokemon",
        hint: "Pokemon tipo Normale."
    },
  {
        id: 'q82',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/ditto.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Ditto",
        category: "Pokemon",
        hint: "Non farti ingannare!"
    },
  {
        id: 'q83',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/eevee.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Eevee",
        category: "Pokemon",
        hint: "Pokemon tipo Normale."
    },
  {
        id: 'q84',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/vaporeon.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Vaporeon",
        category: "Pokemon",
        hint: "Pokemon tipo Acqua."
    },
  {
        id: 'q85',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/flareon.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Flareon",
        category: "Pokemon",
        hint: "Pokemon tipo Fuoco."
    },
  {
        id: 'q86',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/umbreon.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Umbreon",
        category: "Pokemon",
        hint: "Pokemon tipo Buio."
    },
  {
        id: 'q87',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/espeon.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Espeon",
        category: "Pokemon",
        hint: "Pokemon tipo Psico."
    },
  {
        id: 'q88',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/glaceon.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Glaceon",
        category: "Pokemon",
        hint: "Pokemon tipo Ghiaccio."
    },
  {
        id: 'q89',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/leafeon.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Leafeon",
        category: "Pokemon",
        hint: "Pokemon tipo Erba."
    },
  {
        id: 'q90',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/sylveon.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Sylveon",
        category: "Pokemon",
        hint: "Pokemon tipo Folletto."
    },
  {
        id: 'q91',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/jolteon.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Jolteon",
        category: "Pokemon",
        hint: "Pokemon tipo Elettro."
    },
  {
        id: 'q92',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/luxray.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Luxray",
        category: "Pokemon",
        hint: "Pokemon tipo Elettro."
    },
  {
        id: 'q93',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/elekid.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Elekid",
        category: "Pokemon",
        hint: "Pokemon tipo Elettro."
    },
  {
        id: 'q94',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/gallade.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Gallade",
        category: "Pokemon",
        hint: "Pokemon tipo Psico/Lotta."
    },
  {
        id: 'q95',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/infernape.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Infernape",
        category: "Pokemon",
        hint: "Pokemon tipo Fuoco/Lotta."
    },
  {
        id: 'q96',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/blaziken.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Blaziken",
        category: "Pokemon",
        hint: "Pokemon tipo Fuoco/Lotta."
    },
  {
        id: 'q97',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/tyrogue.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Tyrogue",
        category: "Pokemon",
        hint: "Pokemon tipo Lotta."
    },
  {
        id: 'q98',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/machop.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Machop",
        category: "Pokemon",
        hint: "Pokemon tipo Lotta."
    },
  {
        id: 'q99',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/machamp.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Machamp",
        category: "Pokemon",
        hint: "Pokemon tipo Lotta."
    },
  {
        id: 'q100',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/poliwrath.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Poliwrath",
        category: "Pokemon",
        hint: "Pokemon tipo Acqua/Lotta."
    },
  {
        id: 'q101',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/meganium.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Meganium",
        category: "Pokemon",
        hint: "Pokemon tipo Erba."
    },
  {
        id: 'q102',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/meganium.jpg",
        question: "Come si chiama questo pokemon?",
        answer: "Meganium",
        category: "Pokemon",
        hint: "Pokemon tipo Erba."
    },
  {
        id: 'q103',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/sandshrew.jpg",
        question: "Chi è questo pokemon?",
        answer: "Sandshrew",
        category: "Pokemon",
        hint: "Pokemon tipo Terra."
    },
  {
        id: 'q104',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/Wonix.jpg",
        question: "Chi è questo pokemon?",
        answer: "Onix",
        category: "Pokemon",
        hint: "Pokemon tipo Roccia/Terra."
    },
  {
        id: 'q105',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/Wtrubbish.jpg",
        question: "Chi è questo pokemon?",
        answer: "Trubbish",
        category: "Pokemon",
        hint: "Pokemon tipo Veleno."
    },
  {
        id: 'q106',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/Wslugma.jpg",
        question: "Chi è questo pokemon?",
        answer: "Slugma",
        category: "Pokemon",
        hint: "Pokemon tipo Fuoco."
    },
  {
        id: 'q107',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/Wfennekin.jpg",
        question: "Chi è questo pokemon?",
        answer: "Fennekin",
        category: "Pokemon",
        hint: "Pokemon tipo Fuoco."
    },
  {
        id: 'q108',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/Wcharizard.jpg",
        question: "Chi è questo pokemon?",
        answer: "Charizard",
        category: "Pokemon",
        hint: "Pokemon tipo Fuoco/Volante."
    },
  {
        id: 'q109',
        type: 'text',
        question: "Chi fu il primo imperatore romano?",
        answer: "Ottaviano Augusto",
        category: "Storia",
        hint: "Successore di Giulio Cesare."
    },
  {
        id: 'q110',
        type: 'text',
        question: "Chi fondò Roma?",
        answer: "Romolo",
        category: "Storia",
        hint: "Uno dei gemelli allevati dalla lupa."
    },
  {
        id: 'q111',
        type: 'text',
        question: "Quale civiltà costruì le piramidi?",
        answer: "Egizi",
        category: "Storia",
        hint: "Vivevano lungo il Nilo."
    },
  {
        id: 'q112',
        type: 'text',
        question: "Chi scrisse il primo codice di leggi?",
        answer: "Hammurabi",
        category: "Storia",
        hint: "Occhio per occhio."
    },
  {
        id: 'q113',
        type: 'text',
        question: "In che anno fu distrutta Pompei?",
        answer: "79",
        category: "Storia",
        hint: "Eruzione del Vesuvio(scrivere solo l'anno)."
    },
  {
        id: 'q114',
        type: 'text',
        question: "Che tipo di governo aveva Atene?",
        answer: "Democrazia",
        category: "Storia",
        hint: "Ogni cittadino votava."
    },
   {
        id: 'q115',
        type: 'text',
        question: "Contro chi combatterono gli spartani alle Termopili?",
        answer: "Persiani",
        category: "Storia",
        hint: "Leonida e i 300."
    },
  {
        id: 'q116',
        type: 'text',
        question: "Contro chi combatterono gli spartani alle Termopili?",
        answer: "Persiani",
        category: "Storia",
        hint: "Leonida e i 300."
    },
  {
        id: 'q117',
        type: 'text',
        question: "Chi fu incoronato imperatore nel 800?",
        answer: "Carlo Magno",
        category: "Storia",
        hint: "Natale a Roma."
    },
  {
        id: 'q118',
        type: 'text',
        question: "Chi fu l’ultimo imperatore romano d’Occidente?",
        answer: "Romolo Augusto",
        category: "Storia",
        hint: "Deposto da Odoacre."
    },
  {
        id: 'q119',
        type: 'text',
        question: "Dove si trovava Costantinopoli?",
        answer: "Turchia",
        category: "Storia",
        hint: "Attuale Istanbul."
    },
  {
        id: 'q120',
        type: 'text',
        question: "Che evento cambiò l’Europa nel 1347?",
        answer: "Peste",
        category: "Storia",
        hint: "Milioni di morti."
    },
  {
        id: 'q121',
        type: 'text',
        question: "Chi affisse le 95 tesi?",
        answer: "Martin Lutero",
        category: "Storia",
        hint: "Protestava contro le indulgenze."
    },
  {
        id: 'q132',
        type: 'text',
        question: "Qual è stato il principale teatro di guerra dal 2000?",
        answer: "Medio Oriente",
        category: "Storia",
        hint: "Afghanistan, Iraq, Siria."
    },
  {
        id: 'q123',
        type: 'text',
        question: "Quando scoppiò la Rivoluzione francese?",
        answer: "1789",
        category: "Storia",
        hint: "Presa della Bastiglia."
    },
  {
        id: 'q124',
        type: 'text',
        question: "Dove nacque la Rivoluzione industriale?",
        answer: "Inghilterra",
        category: "Storia",
        hint: "Fabbriche e carbone."
    },
  {
        id: 'q125',
        type: 'text',
        question: "Quando fu proclamato il Regno d’Italia?",
        answer: "1861",
        category: "Storia",
        hint: "Dopo la spedizione dei Mille."
    },
  {
        id: 'q126',
        type: 'text',
        question: "Chi fu il dittatore italiano durante la Seconda guerra mondiale?",
        answer: "Benito Mussolini",
        category: "Storia",
        hint: "Fondò il fascismo."
    },
  {
        id: 'q127',
        type: 'text',
        question: "Quando scoppiò la Prima guerra mondiale?",
        answer: "1914",
        category: "Storia",
        hint: "Attentato a Sarajevo."
    },
  {
        id: 'q128',
        type: 'text',
        question: "Quando scoppiò la Seconda guerra mondiale?",
        answer: "1939",
        category: "Storia",
        hint: "Invasione della Polonia."
    },
  {
        id: 'q129',
        type: 'text',
        question: "Quando finì la Seconda guerra mondiale?",
        answer: "1945",
        category: "Storia",
        hint: "Bombe su Hiroshima e Nagasaki."
    },
  {
        id: 'q130',
        type: 'text',
        question: "Quando si dissolse l’URSS?",
        answer: "1991",
        category: "Storia",
        hint: "Gorbaciov al potere."
    },
  {
        id: 'q131',
        type: 'text',
        question: "Quando nacque l’UE?",
        answer: "1993",
        category: "Storia",
        hint: "Evoluzione della CEE."
    },
  {
        id: 'q133',
        type: 'text',
        question: "Quale città è stata attaccata dalla Russia del 2022?",
        answer: "Kiev",
        category: "Storia",
        hint: "Capitale del paese in conflitto con la Russia."
    },
  {
        id: 'q134',
        type: 'text',
        question: "Chi ha diretto il film Titanic?",
        answer: "James Cameron",
        category: "Cinema",
        hint: "Stesso regista di Avatar."
    },
  {
        id: 'q135',
        type: 'text',
        question: "In che anno è uscito il primo film di Harry Potter?",
        answer: "2001",
        category: "Cinema",
        hint: "È uscito lo stesso anno del primo iPod."
    },
  {
        id: 'q136',
        type: 'text',
        question: "Qual è il nome dell’eroe interpretato da Harrison Ford in Indiana Jones?",
        answer: "Indiana Jones",
        category: "Cinema",
        hint: "È anche un archeologo."
    },
  {
        id: 'q137',
        type: 'text',
        question: "Chi interpreta il Joker ne Il Cavaliere Oscuro?",
        answer: "Heath Ledger",
        category: "Cinema",
        hint: "Ha vinto un Oscar postumo."
    },
  {
        id: 'q138',
        type: 'text',
        question: "Quale film ha la celebre frase Che la forza sia con te?",
        answer: "Star Wars",
        category: "Cinema",
        hint: "Una saga spaziale molto amata."
    },
  {
        id: 'q139',
        type: 'text',
        question: "Quale film d'animazione Pixar è ambientato in una cucina francese?",
        answer: "Ratatouille",
        category: "Disney/Pixar",
        hint: "Il protagonista è un topo."
    },
  {
        id: 'q140',
        type: 'text',
        question: "Chi è il protagonista di Forrest Gump?",
        answer: "Tom Hanks",
        category: "Cinema",
        hint: "Corre molto."
    },
  {
        id: 'q141',
        type: 'text',
        question: "Quanti Oscar ha vinto Il Signore degli Anelli: Il ritorno del re?",
        answer: "11",
        category: "Cinema",
        hint: "Ha eguagliato il record di “Titanic” e “Ben-Hur”."
    },
  {
        id: 'q142',
        type: 'text',
        question: "Che lavoro fa il personaggio principale in The Wolf of Wall Street?",
        answer: "Broker",
        category: "Cinema",
        hint: "Lavora nella finanza."
    },
  {
        id: 'q143',
        type: 'text',
        question: "Chi è l’attrice protagonista in Pretty Woman?",
        answer: "Julia Roberts",
        category: "Cinema",
        hint: "Sorriso iconico."
    },
  {
        id: 'q144',
        type: 'text',
        question: "Dove è ambientato La La Land?",
        answer: "Los Angeles",
        category: "Cinema",
        hint: "Capitale del cinema USA."
    },
  {
        id: 'q145',
        type: 'text',
        question: "Qual è il primo film Marvel del MCU?",
        answer: "Iron Man",
        category: "Cinema",
        hint: "È uscito nel 2008."
    },
  {
        id: 'q146',
        type: 'text',
        question: "Qual è la capitale dell’Australia?",
        answer: "Canberra",
        category: "Geografia",
        hint: "Non è Sydney."
    },
  {
        id: 'q147',
        type: 'text',
        question: "Quale oceano bagna le coste del Giappone?",
        answer: "Pacifico",
        category: "Geografia",
        hint: "È il più grande oceano."
    },
  {
        id: 'q148',
        type: 'text',
        question: "Qual è lo Stato più piccolo del mondo?",
        answer: "Città del Vaticano",
        category: "Geografia",
        hint: "Si trova nel Lazio."
    },
  {
        id: 'q149',
        type: 'text',
        question: "Quale monte è il più alto della Terra?",
        answer: "Everest",
        category: "Geografia",
        hint: "Si trova nell’Himalaya."
    },
  {
        id: 'q150',
        type: 'text',
        question: "Qual è la capitale della Norvegia?",
        answer: "Oslo",
        category: "Geografia",
        hint: "Città scandinava."
    },
  {
        id: 'q151',
        type: 'text',
        question: "Qual è il lago più profondo del mondo?",
        answer: "Baikal",
        category: "Geografia",
        hint: "Si trova in Russia."
    },
  {
        id: 'q152',
        type: 'text',
        question: "Qual è la capitale del Marocco?",
        answer: "Rabat",
        category: "Geografia",
        hint: "Non è Casablanca."
    },
  {
        id: 'q153',
        type: 'text',
        question: "Qual è la capitale dell’Argentina?",
        answer: "Buenos Aires",
        category: "Geografia",
        hint: "Sede del tango."
    },
  {
        id: 'q154',
        type: 'text',
        question: "Quale nazione ha più isole al mondo?",
        answer: "Svezia",
        category: "Geografia",
        hint: "Ha più di 260.000 isole."
    },
  {
        id: 'q155',
        type: 'text',
        question: "In quale mare sfocia il Danubio?",
        answer: "Mar Nero",
        category: "Geografia",
        hint: "È vicino alla Romania."
    },
  {
        id: 'q156',
        type: 'text',
        question: "Qual è la capitale della Thailandia?",
        answer: "Bangkok",
        category: "Geografia",
        hint: "Celebre per la sua vita notturna e i templi."
    },
  {
        id: 'q157',
        type: 'text',
        question: "In che continente si trova il monte Kilimangiaro?",
        answer: "Africa",
        category: "Geografia",
        hint: "Si trova in Tanzania."
    },
  {
        id: 'q158',
        type: 'text',
        question: "Chi ha scolpito il David?",
        answer: "Michelangelo",
        category: "Arte",
        hint: "Ha anche dipinto la volta della Cappella Sistina."
    },
  {
        id: 'q159',
        type: 'text',
        question: "Qual è lo stile artistico di Picasso?",
        answer: "Cubismo",
        category: "Arte",
        hint: "Figure scomposte in forme geometriche."
    },
  {
        id: 'q160',
        type: 'text',
        question: "Dove si trova il Museo del Louvre?",
        answer: "Parigi",
        category: "Arte",
        hint: "Ha una piramide di vetro all'ingresso."
    },
  {
        id: 'q161',
        type: 'text',
        question: "Chi ha dipinto Il bacio del 1907?",
        answer: "Gustav Klimt",
        category: "Arte",
        hint: "Austriaco, uso frequente dell’oro."
    },
  {
        id: 'q162',
        type: 'text',
        question: "Qual è il movimento artistico di Dalí?",
        answer: "Surrealismo",
        category: "Arte",
        hint: "Celebre per gli orologi “molli”."
    },
  {
        id: 'q163',
        type: 'text',
        question: "Chi ha inventato la prospettiva lineare?",
        answer: "Filippo Brunelleschi",
        category: "Arte",
        hint: "Architetto della Cupola del Duomo di Firenze."
    },
  {
        id: 'q164',
        type: 'text',
        question: "Dove si trova L’Ultima Cena di Leonardo da Vinci?",
        answer: "Milano",
        category: "Arte",
        hint: "Nel convento di Santa Maria delle Grazie."
    },
  {
        id: 'q165',
        type: 'text',
        question: "Quale pittore impressionista francese ha dipinto Impression, soleil levant?",
        answer: "Claude Monet",
        category: "Arte",
        hint: "Il movimento prende nome da quest’opera."
    },
  {
        id: 'q166',
        type: 'text',
        question: "Qual è il soggetto più dipinto da Andy Warhol?",
        answer: "Marilyn Monroe",
        category: "Arte",
        hint: "Simbolo della pop art."
    },
  {
        id: 'q167',
        type: 'text',
        question: "Chi ha dipinto La scuola di Atene?",
        answer: "Raffaello",
        category: "Arte",
        hint: "Filosofi antichi in un affresco."
    },
  {
        id: 'q168',
        type: 'text',
        question: "Qual è il materiale usato per Il pensatore di Rodin?",
        answer: "Bronzo",
        category: "Arte",
        hint: "Una delle più famose sculture moderne."
    },
  {
        id: 'q169',
        type: 'text',
        question: "Chi ha scolpito Amore e Psiche?",
        answer: "Antonio Canova",
        category: "Arte",
        hint: "Maestro del Neoclassicismo."
    },
  {
        id: 'q170',
        type: 'text',
        question: "In che Paese si trova il museo del Prado?",
        answer: "Spagna",
        category: "Arte",
        hint: "Si trova nella sua capitale."
    },
  {
        id: 'q171',
        type: 'text',
        question: "Quanti denti ha un essere umano adulto?",
        answer: "32",
        category: "Scienze",
        hint: "Inclusi i denti del giudizio."
    },
  {
        id: 'q172',
        type: 'text',
        question: "Come si chiama la scienza che studia i terremoti?",
        answer: "Sismologia",
        category: "Scienze",
        hint: "Usa i sismografi."
    },
  {
        id: 'q173',
        type: 'text',
        question: "Qual è l’osso più lungo del corpo umano?",
        answer: "Femore",
        category: "Scienze",
        hint: "Si trova nella gamba."
    },
  {
        id: 'q174',
        type: 'text',
        question: "Come si chiama il processo di divisione cellulare?",
        answer: "Mitosi",
        category: "Scienze",
        hint: "Avviene in quasi tutte le cellule."
    },
  {
        id: 'q175',
        type: 'text',
        question: "Quale pianeta è conosciuto come il pianeta rosso?",
        answer: "Marte",
        category: "Scienze",
        hint: "Ha molto ossido di ferro."
    },
  {
        id: 'q176',
        type: 'text',
        question: "Che organo produce l’insulina?",
        answer: "Pancreas",
        category: "Scienze",
        hint: "Essenziale per controllare la glicemia."
    },
  {
        id: 'q177',
        type: 'text',
        question: "Cosa produce l’attrito?",
        answer: "Calore",
        category: "Scienze",
        hint: "Avviene quando due superfici si sfregano."
    },
  {
        id: 'q178',
        type: 'text',
        question: "Chi ha formulato la teoria della relatività?",
        answer: "Albert Einstein",
        category: "Scienze",
        hint: "La formula è E=mc²."
    },
  {
        id: 'q179',
        type: 'text',
        question: "In che unità si misura la forza?",
        answer: "Newton",
        category: "Scienze",
        hint: "Dal nome di un famoso fisico."
    },
  {
        id: 'q180',
        type: 'text',
        question: "Quanti cromosomi ha l’essere umano?",
        answer: "46",
        category: "Scienze",
        hint: "23 coppie."
    },
  {
        id: 'q181',
        type: 'text',
        question: "Come si chiama la scienza che studia gli organismi viventi?",
        answer: "Biologia",
        category: "Scienze",
        hint: "Studia anche il DNA."
    },
  {
        id: 'q182',
        type: 'text',
        question: "Quante valvole ha il cuore umano?",
        answer: "4",
        category: "Scienze",
        hint: "Si trovano vicino al cuore."
    },
  {
        id: 'q183',
        type: 'text',
        question: "Qual è il muscolo più forte del corpo umano?",
        answer: "Massetere",
        category: "Scienze",
        hint: "Muscolo che permette la masticazione."
    },
  {
        id: 'q184',
        type: 'text',
        question: "Quanti elementi ci sono nella tavola periodica?",
        answer: "118",
        category: "Scienze",
        hint: "Sono più di 100."
    },
  {
        id: 'q185',
        type: 'text',
        question: "Qual è l'animale più grande della Terra?",
        answer: "Balenottera Azzurra",
        category: "Scienze",
        hint: "Animale marino."
    },
  {
        id: 'q186',
        type: 'text',
        question: "Qual è l'unico mammifero capace di volare?",
        answer: "Pipistrello",
        category: "Scienze",
        hint: "Animale che vive nelle grotte."
    },
  {
        id: 'q187',
        type: 'text',
        question: "Qual è l'osso più piccolo del corpo umano?",
        answer: "Staffa",
        category: "Scienze",
        hint: "Si trova nell'orecchio."
    },
  {
        id: 'q188',
        type: 'text',
        question: "Quanti cuori ha un polipo?",
        answer: "3",
        category: "Scienze",
        hint: "Hanno diversi ruoli."
    },
  {
        id: 'q189',
        type: 'text',
        question: "In quale romanzo compare il personaggio di Don Abbondio?",
        answer: "Promessi Sposi",
        category: "Letteratura",
        hint: "Scritto da Manzoni."
    },
  {
        id: 'q190',
        type: 'text',
        question: "Chi ha scritto Orgoglio e pregiudizio?",
        answer: "Jane Austen",
        category: "Letteratura",
        hint: "Scrittrice inglese dell’Ottocento."
    },
  {
        id: 'q191',
        type: 'text',
        question: "In quale opera compare il personaggio di Ulisse?",
        answer: "Odissea",
        category: "Letteratura",
        hint: "Attribuita a Omero."
    },
  {
        id: 'q192',
        type: 'text',
        question: "Chi ha scritto Il barone rampante?",
        answer: "Italo Calvino",
        category: "Letteratura",
        hint: "Appartiene alla trilogia degli antenati."
    },
  {
        id: 'q193',
        type: 'text',
        question: "Come si chiama il poeta latino autore delle Metamorfosi?",
        answer: "Ovidio",
        category: "Letteratura",
        hint: "Fu esiliato da Augusto."
    },
  {
        id: 'q194',
        type: 'text',
        question: "Quale opera di Goethe è ispirata alla leggenda del patto con il diavolo?",
        answer: "Faust",
        category: "Letteratura",
        hint: "Opera in due parti."
    },
  {
        id: 'q195',
        type: 'text',
        question: "Chi ha scritto Le avventure di Pinocchio?",
        answer: "Carlo Collodi",
        category: "Letteratura",
        hint: "Nome d’arte di Lorenzini."
    },
  {
        id: 'q196',
        type: 'text',
        question: "Qual è il romanzo più noto di Mary Shelley?",
        answer: "Frankenstein",
        category: "Letteratura",
        hint: "Scritto a 19 anni."
    },
  {
        id: 'q197',
        type: 'text',
        question: "Chi è l’autore di Il fu Mattia Pascal?",
        answer: "Luigi Pirandello",
        category: "Letteratura",
        hint: "Premio Nobel per la Letteratura."
    },
  {
        id: 'q198',
        type: 'text',
        question: "Chi ha cantato Thriller?",
        answer: "Michael Jackson",
        category: "Musica",
        hint: "È chiamato il Re del Pop."
    },
  {
        id: 'q199',
        type: 'text',
        question: "Chi ha composto Le quattro stagioni?",
        answer: "Antonio Vivaldi",
        category: "Musica",
        hint: "Era un prete e violinista veneziano."
    },
  {
        id: 'q200',
        type: 'text',
        question: "Chi è il cantante dei Queen?",
        answer: "Freddie Mercury",
        category: "Musica",
        hint: "Voce potente, icona anni 70-80."
    },
  {
        id: 'q201',
        type: 'text',
        question: "In quale Paese è nato il genere reggae?",
        answer: "Giamaica",
        category: "Musica",
        hint: "Bob Marley ne è il simbolo."
    },
  {
        id: 'q202',
        type: 'text',
        question: "Quale cantante italiana ha vinto Sanremo nel 2024?",
        answer: "Angelina Mango",
        category: "Musica",
        hint: "Figlia d’arte."
    },
  {
        id: 'q203',
        type: 'text',
        question: "Chi canta Rolling in the Deep?",
        answer: "Adele",
        category: "Musica",
        hint: "Cantautrice britannica pluripremiata."
    },
  {
        id: 'q204',
        type: 'text',
        question: "Quale cantante è noto per la hit Shape of You?",
        answer: "Ed Sheeran",
        category: "Musica",
        hint: "Capelli rossi, chitarrista."
    },
  {
        id: 'q205',
        type: 'text',
        question: "Chi ha scritto l’opera La Traviata?",
        answer: "Giuseppe Verdi",
        category: "Musica",
        hint: "Compositore simbolo dell’Italia unita."
    },
  {
        id: 'q206',
        type: 'text',
        question: "Chi era il re del rock?",
        answer: "Elvis Presley",
        category: "Musica",
        hint: "Nato a Tupelo, Mississippi."
    },
  {
        id: 'q207',
        type: 'text',
        question: "Quanti tasti ha un pianoforte classico?",
        answer: "88",
        category: "Musica",
        hint: "Bianchi e neri."
    },
  {
        id: 'q208',
        type: 'text',
        question: "Che tipo di voce ha un uomo con timbro molto grave?",
        answer: "Basso",
        category: "Musica",
        hint: "Voce profonda."
    },
  {
        id: 'q209',
        type: 'text',
        question: "Chi canta Viva la vida?",
        answer: "Coldplay",
        category: "Musica",
        hint: "Band britannica guidata da Chris Martin."
    },
  {
        id: 'q210',
        type: 'text',
        question: "Chi è l’autore del musical West Side Story?",
        answer: "Leonard Bernstein",
        category: "Musica",
        hint: "Basato su Romeo e Giulietta."
    },
  {
        id: 'q211',
        type: 'text',
        question: "Che cos'è il PIL?",
        answer: "Prodotto Interno Lordo",
        category: "Economia",
        hint: "Misura la ricchezza prodotta da un Paese."
    },
  {
        id: 'q212',
        type: 'text',
        question: "Chi stampa la moneta in Europa?",
        answer: "Banca Centrale Europea",
        category: "Economia",
        hint: "Ha sede a Francoforte."
    },
  {
        id: 'q213',
        type: 'text',
        question: "Chi è considerato il padre dell’economia moderna?",
        answer: "Adam Smith",
        category: "Economia",
        hint: "Autore de La ricchezza delle nazioni."
    },
  {
        id: 'q214',
        type: 'text',
        question: "Il nome di una criptovaluta molto famosa?",
        answer: "Bitcoin",
        category: "Economia",
        hint: "Valuta digitale decentralizzata."
    },
  {
        id: 'q215',
        type: 'text',
        question: "Qual è il motore di ricerca più usato al mondo?",
        answer: "Google",
        category: "Tecnologia",
        hint: "Fondata nel 1998."
    },
  {
        id: 'q216',
        type: 'text',
        question: "Chi ha creato Facebook?",
        answer: "Mark Zuckerberg",
        category: "Tecnologia",
        hint: "Fondatore e CEO di Meta."
    },
  {
        id: 'q217',
        type: 'text',
        question: "Qual è l’unità base della memoria digitale?",
        answer: "Byte",
        category: "Tecnologia",
        hint: "1 kilobyte = 1024 di questi."
    },
  {
        id: 'q218',
        type: 'text',
        question: "Cosa significa URL?",
        answer: "Uniform Resource Locator",
        category: "Tecnologia",
        hint: "È l’indirizzo di un sito web."
    },
  {
        id: 'q219',
        type: 'text',
        question: "Come si chiama il sistema operativo open source più famoso?",
        answer: "Linux",
        category: "Tecnologia",
        hint: "Simbolo: un pinguino."
    },
  {
        id: 'q220',
        type: 'text',
        question: "Che programma si usa per scrivere documenti?",
        answer: "Microsoft Word",
        category: "Tecnologia",
        hint: "Parte del pacchetto Office."
    },
  {
        id: 'q221',
        type: 'text',
        question: "Che software si usa per fare presentazioni?",
        answer: "Microsoft PowerPoint",
        category: "Tecnologia",
        hint: "Parte del pacchetto Office."
    },
  {
        id: 'q222',
        type: 'text',
        question: "Qual è la casa produttrice dell’iPhone?",
        answer: "Apple",
        category: "Tecnologia",
        hint: "Fondata da Steve Jobs."
    },
  {
        id: 'q223',
        type: 'text',
        question: "La mia vita può durare qualche ora, quello che produco mi divora. Sottile sono veloce, grossa sono lenta e il vento molto mi spaventa. Chi sono?",
        answer: "Candela",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q224',
        type: 'text',
        question: "Quando sono in piedi loro sono sdraiati, quando sono sdraiato loro sono in piedi. Chi sono?",
        answer: "Piedi",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q225',
        type: 'text',
        question: "Mio padre fa il cantante, mia madre è balbuziente. Il mio vestito è bianco e il mio cuore d’oro. Chi sono?",
        answer: "Uovo",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q226',
        type: 'text',
        question: "Ti tiene in vita, ma lo vedi solo d'inverno. Cos'é?",
        answer: "Fiato",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q227',
        type: 'text',
        question: "Viaggia in tutto il mondo stando in un angolo. Cos'è?",
        answer: "Francobollo",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q228',
        type: 'text',
        question: "La somma dell’età di 5 uomini è 121. Tra 20 anni quale sarà la somma della loro età?",
        answer: "221",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q229',
        type: 'text',
        question: "Può essere molto concentrato, ma non è capace di pensare.",
        answer: "Pomodoro",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q230',
        type: 'text',
        question: "Nell'acqua nasce, nell'acqua nutre, ma vedendo l'acqua sparisce. Chi è?",
        answer: "Sale",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q231',
        type: 'text',
        question: "Più persone mi custodiscono e meno sono al sicuro. Che cosa sono?",
        answer: "Segreto",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q232',
        type: 'text',
        question: "Vende prodotti freschi che nessuno mangia.",
        answer: "Fioraio",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q233',
        type: 'text',
        question: "Esisto solo con la luce, con l'oscurità la mia vita subito finisce.",
        answer: "Ombra",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q234',
        type: 'text',
        question: "È tutta buchi eppure piena d'acqua.",
        answer: "Spugna",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q235',
        type: 'text',
        question: "Lui ne ha 2, un cittadino ne ha 4 e un umano ne ha 3. Che cosa sono?",
        answer: "Vocali",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q236',
        type: 'text',
        question: "Ha un solo piede e porta il cappello giorno e notte senza mai toglierlo.",
        answer: "Fungo",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q237',
        type: 'text',
        question: "Non sente prurito, ma si gratta spesso e volentieri.",
        answer: "Formaggio",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q238',
        type: 'text',
        question: "Parla senza bocca, ti batte e non ti tocca, corre senza piedi, passa e non lo vedi",
        answer: "Vento",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q239',
        type: 'text',
        question: "Belli o brutti li puoi fare, ma a nessuno li puoi mostrare.",
        answer: "Sogni",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q240',
        type: 'text',
        question: "Più son caldo più son fresco, che fenomeno grottesco!",
        answer: "Pane",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q241',
        type: 'text',
        question: "Quando si uniscono, separano.",
        answer: "Forbici",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q242',
        type: 'text',
        question: "Cerco la terra e vado sempre nel mare, eppure non imparo mai a nuotare.",
        answer: "Ancora",
        category: "Indovinelli",
        hint: "Mettiti alla prova senza aiuto!"
    },
  {
        id: 'q243',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/levi.jpg",
        question: "Come si chiama questo personaggio?",
        answer: "Levi",
        category: "Anime e Manga",
        hint: "Considerato il soldato più forte."
    },
  {
        id: 'q244',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/connie.jpg",
        question: "Come si chiama questo personaggio?",
        answer: "Connie",
        category: "Anime e Manga",
        hint: "Soldato del Corpo di Ricerca, diplomato con Eren."
    },
  {
        id: 'q245',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/annie.jpg",
        question: "Come si chiama questo personaggio?",
        answer: "Annie",
        category: "Anime e Manga",
        hint: "Possiede il gigante donna."
    },
  {
        id: 'q246',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/corazon.jpg",
        question: "Come si chiama questo personaggio?",
        answer: "Corazon",
        category: "Anime e Manga",
        hint: "Ha fatto ridere un cuore spezzato."
    },
  {
        id: 'q247',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/mihawk.jpg",
        question: "Come si chiama questo personaggio?",
        answer: "Mihawk",
        category: "Anime e Manga",
        hint: "Brandisce la lama più affilata del mare."
    },
  {
        id: 'q248',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/shirahoshi.jpg",
        question: "Come si chiama questo personaggio?",
        answer: "Shirahoshi",
        category: "Anime e Manga",
        hint: "Può evocare i re degli abissi con il solo pianto."
    },
  {
        id: 'q249',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/katakuri.jpg",
        question: "Come si chiama questo personaggio?",
        answer: "Katakuri",
        category: "Anime e Manga",
        hint: "Vede il futuro."
    },
  {
        id: 'q250',
        type: 'image',
        imageUrl: "https://thewordgames.netlify.app/public/images/vivi.jpeg",
        question: "Come si chiama questo personaggio?",
        answer: "Vivi",
        category: "Anime e Manga",
        hint: "Ha lottato per il suo regno sotto mentite spoglie"
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

