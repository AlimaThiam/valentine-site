/* ================================================
   VALENTINE'S DAY – script.js
   Logique interactive, animations, personnalisation
   ================================================ */

// ─── ÉLÉMENTS DU DOM ────────────────────────────
const heartsBg = document.getElementById("hearts-bg");
const confettiBox = document.getElementById("confetti-container");
const musicToggle = document.getElementById("music-toggle");
const bgMusic = document.getElementById("bg-music");

const mainScreen = document.getElementById("main-screen");
const yesScreen = document.getElementById("yes-screen");

const mainTitle = document.getElementById("main-title");
const nameDisplay = document.getElementById("name-display");
const customMessage = document.getElementById("custom-message");

const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const noCounter = document.getElementById("no-counter");

const btnSecret = document.getElementById("btn-secret");
const secretContent = document.getElementById("secret-content");
const secretCustom = document.getElementById("secret-custom");
const secretDefault = document.getElementById("secret-default");
const bouquetOverlay = document.getElementById("bouquet-overlay");

const inputName = document.getElementById("input-name");
const inputGenre = document.getElementById("input-genre");
const inputMsg = document.getElementById("input-msg");
const inputSecret = document.getElementById("input-secret");
const btnGenerate = document.getElementById("btn-generate");
const generatedLinkBox = document.getElementById("generated-link-box");
const copyFeedback = document.getElementById("copy-feedback");

// ─── ÉTAT ───────────────────────────────────────
let noAttempts = 0;            // Nombre de tentatives sur "Non"
const MAX_NO_ATTEMPTS = 5;     // Après X tentatives, "Non" → "Oui"
let musicPlaying = false;

// ─── MESSAGES RIGOLOS QUAND ON CLIQUE "NON" ────
const noMessages = [
    "T'es sûr(e) ? 🤔",
    "Vraiment ? Réfléchis bien… 😏",
    "Tu me brises le cœur 💔",
    "Non non, mauvais bouton ! 😤",
    "Dernière chance… 🥺",
];

// ─── MESSAGES RIGOLOS SUR LE BOUTON "NON" ──────
const noBtnTexts = [
    "Non 🙄",
    "T'es sûr(e) ? 😢",
    "Réfléchis ! 🤨",
    "Mauvais choix 😤",
    "Appuie sur l'autre 👉",
    "Oui 💖",  // Le dernier → se transforme en Oui !
];


/* ================================================
   1) PERSONNALISATION VIA URL
   ?name=Sara&msg=Tu+es+magnifique
   ================================================ */
function loadURLParams() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const msg = params.get("msg");
    const secret = params.get("secret");
    const genre = params.get("genre"); // "f" pour fille, "m" pour garçon
    const response = params.get("response"); // Réponse cadeau reçue
    const fromName = params.get("from"); // Nom de qui a répondu

    // Mode réponse - l'expéditeur voit la réponse de sa valentine
    if (response) {
        showResponseResult(response, fromName);
        return;
    }

    if (name) {
        // Afficher "Chère Sara," avant la question
        nameDisplay.textContent = `Cher(e) ${decodeURIComponent(name)},`;
        document.title = `💌 ${decodeURIComponent(name)}, une question pour toi…`;
    }

    if (msg) {
        customMessage.textContent = `"${decodeURIComponent(msg)}"`;
        customMessage.classList.remove("hidden");
    }

    // Message secret personnalisé
    if (secret) {
        secretCustom.classList.remove("hidden");
        secretCustom.querySelector(".secret-custom-text").textContent = "💌 " + decodeURIComponent(secret);
        secretDefault.classList.add("hidden");
    }

    // Adapter la question selon le genre
    const questionElement = mainTitle.querySelector('#valentine-question');
    if (!questionElement) {
        // Créer l'élément question s'il n'existe pas
        const questionSpan = document.createElement('span');
        questionSpan.id = 'valentine-question';
        questionSpan.textContent = 'Veux-tu être ma Valentine ? 💕';
        mainTitle.appendChild(questionSpan);
    } else {
        // Adapter selon le genre
        if (genre === 'm') {
            questionElement.textContent = 'Veux-tu être mon Valentin ? 💕';
        } else {
            questionElement.textContent = 'Veux-tu être ma Valentine ? 💕';
        }
    }

    // Adapter les messages de célébration
    const celebrationText = document.querySelector('.celebration-text');
    if (celebrationText && genre === 'm') {
        celebrationText.innerHTML = 'Tu viens de rendre cette personne <strong>très heureux</strong> 🥰';
    } else if (celebrationText) {
        celebrationText.innerHTML = 'Tu viens de rendre cette personne <strong>très heureuse</strong> 🥰';
    }
}
loadURLParams();

/* ================================================
   PAGE RÉPONSE - L'expéditeur voit le choix de sa Valentine
   ================================================ */
function showResponseResult(gift, fromName) {
    // Cacher les écrans normaux
    mainScreen.style.display = 'none';
    yesScreen.style.display = 'none';

    const giftEmojis = {
        chocolats: "🍫", fleurs: "💐", nounours: "🧸",
        bijoux: "💎", argent: "💰", shein: "🛍️", surprise: "🎲"
    };
    const giftNames = {
        chocolats: "Boîte de chocolats", fleurs: "Bouquet de fleurs", nounours: "Nounours",
        bijoux: "Bijoux", argent: "Bouquet d'argent", shein: "Panier SHEIN", surprise: "Surprends-moi !"
    };

    const emoji = giftEmojis[gift] || "🎁";
    const giftName = giftNames[gift] || gift;
    const displayName = fromName ? decodeURIComponent(fromName) : "Ta Valentine";

    const resultScreen = document.createElement('section');
    resultScreen.className = 'screen active';
    resultScreen.innerHTML = `
        <div class="card fade-in">
            <div class="big-heart-anim">💖</div>
            <h1 style="font-family: var(--font-display); color: var(--red); font-size: 2rem;">Bonne nouvelle ! 🎉</h1>
            <h2 style="font-family: var(--font-display); color: var(--text); margin: 12px 0;">${displayName} a dit <strong style="color: var(--red);">OUI</strong> ! 💕</h2>
            
            <div class="response-result-card">
                <p style="font-size: 1rem; color: var(--text-light); margin-bottom: 12px;">Et voici le cadeau choisi :</p>
                <div class="response-gift-display">
                    <span style="font-size: 4rem; display: block; margin-bottom: 8px;">${emoji}</span>
                    <span style="font-family: var(--font-display); font-size: 1.5rem; color: var(--red); font-weight: 700;">${giftName}</span>
                </div>
            </div>

            <p style="font-size: 1.1rem; margin-top: 20px; color: var(--text-light);">Maintenant tu sais quoi offrir ! 🥰💝</p>
            
            <div style="margin-top: 24px;">
                <button class="btn btn-yes" onclick="location.href=location.pathname">💌 Créer mon propre lien</button>
            </div>
        </div>
    `;

    document.body.appendChild(resultScreen);

    // Lancer des confettis de célébration
    setTimeout(() => {
        const emojis = ["💖", "🎉", "✨", emoji, "💕", "🥳"];
        for (let i = 0; i < 25; i++) {
            setTimeout(() => createConfettiHeart(emojis), i * 80);
        }
    }, 500);

    // Musique
    if (!musicPlaying) {
        startMusic();
        musicToggle.textContent = "🎵";
        musicToggle.classList.add("playing");
        musicPlaying = true;
    }
}


/* ================================================
   2) CŒURS ANIMÉS EN ARRIÈRE-PLAN
   ================================================ */
const heartEmojis = ["❤️", "💕", "💗", "💖", "💘", "💝", "🩷", "🌹", "✨"];

function createFloatingHeart() {
    const heart = document.createElement("span");
    heart.classList.add("floating-heart");
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    // Position & taille aléatoires
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + "rem";

    // Durée aléatoire (6s à 14s)
    const duration = Math.random() * 8 + 6;
    heart.style.animationDuration = duration + "s";
    heart.style.animationDelay = Math.random() * 2 + "s";

    heartsBg.appendChild(heart);

    // Nettoyage automatique
    setTimeout(() => heart.remove(), (duration + 3) * 1000);
}

// Générer des cœurs en continu
setInterval(createFloatingHeart, 600);
// Quelques cœurs au démarrage
for (let i = 0; i < 8; i++) {
    setTimeout(createFloatingHeart, i * 200);
}


/* ================================================
   3) MUSIQUE ROMANTIQUE
   ================================================ */
let audioContext = null;
let musicOscillators = [];
let musicGain = null;
let melodyInterval = null;

// Initialiser le contexte audio au premier clic utilisateur
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return true;
    } catch (e) {
        console.log('Web Audio API non supporté');
        return false;
    }
}

// Créer une mélodie romantique avec plusieurs oscillateurs
function startRomanticMelody() {
    if (!audioContext) {
        if (!initAudio()) return;
    }

    // Reprendre le contexte s'il est suspendu
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Créer le gain principal
    musicGain = audioContext.createGain();
    musicGain.gain.setValueAtTime(0, audioContext.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 2);
    musicGain.connect(audioContext.destination);

    // Notes de la mélodie (gamme de Do majeur, tonalité romantique)
    const melody = [
        { freq: 261.63, duration: 1.5 }, // Do
        { freq: 329.63, duration: 1.5 }, // Mi  
        { freq: 392.00, duration: 1.0 }, // Sol
        { freq: 329.63, duration: 1.0 }, // Mi
        { freq: 293.66, duration: 2.0 }, // Ré
        { freq: 261.63, duration: 1.5 }, // Do
        { freq: 246.94, duration: 1.5 }, // Si
        { freq: 261.63, duration: 2.5 }, // Do (long)
    ];

    let noteIndex = 0;
    let startTime = audioContext.currentTime + 1;

    const playNote = (freq, duration, startTime) => {
        const osc = audioContext.createOscillator();
        const noteGain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        // Enveloppe douce pour chaque note
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
        noteGain.gain.linearRampToValueAtTime(0.3, startTime + duration - 0.3);
        noteGain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(noteGain);
        noteGain.connect(musicGain);

        osc.start(startTime);
        osc.stop(startTime + duration);

        musicOscillators.push(osc);

        return duration;
    };

    // Jouer la mélodie en boucle
    const playMelody = () => {
        if (!musicPlaying) return;

        let currentTime = audioContext.currentTime;

        melody.forEach((note, index) => {
            playNote(note.freq, note.duration, currentTime);
            currentTime += note.duration + 0.2; // Petite pause entre les notes
        });

        // Programmer la prochaine répétition
        const totalDuration = melody.reduce((sum, note) => sum + note.duration + 0.2, 0);
        setTimeout(() => {
            if (musicPlaying) playMelody();
        }, totalDuration * 1000);
    };

    playMelody();
}

function stopRomanticMelody() {
    if (musicGain && audioContext) {
        musicGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
    }

    // Arrêter tous les oscillateurs
    musicOscillators.forEach(osc => {
        try {
            osc.stop();
        } catch (e) {
            // Oscillateur déjà arrêté
        }
    });
    musicOscillators = [];

    if (melodyInterval) {
        clearInterval(melodyInterval);
        melodyInterval = null;
    }
}

// Fonction principale pour démarrer la musique
function startMusic() {
    console.log('🎵 Tentative de démarrage de la musique...');

    // Essayer d'abord l'audio HTML5
    bgMusic.volume = 0.2;
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('✅ Musique HTML5 active');
        }).catch((error) => {
            console.log('❌ Audio HTML5 échoué, utilisation de la synthèse');
            console.log('🎹 Démarrage de la mélodie synthétique...');
            startRomanticMelody();
        });
    } else {
        console.log('🎹 Pas de Promise, démarrage direct de la synthèse');
        startRomanticMelody();
    }
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    stopRomanticMelody();
    console.log('🔇 Musique arrêtée');
}

musicToggle.addEventListener("click", () => {
    if (musicPlaying) {
        stopMusic();
        musicToggle.textContent = "🔇";
        musicToggle.classList.remove("playing");
        musicPlaying = false;
    } else {
        startMusic();
        musicToggle.textContent = "🎵";
        musicToggle.classList.add("playing");
        musicPlaying = true;
    }
});


/* ================================================
   4) BOUTON "OUI" 💖
   ================================================ */
btnYes.addEventListener("click", () => {
    showYesScreen();
});


/* ================================================
   5) BOUTON "NON" 🙄 – INTERACTION RIGOLOTE
   ================================================ */
btnNo.addEventListener("click", handleNo);
btnNo.addEventListener("mouseenter", handleNoHover);
btnNo.addEventListener("touchstart", handleNoTouch, { passive: true });

function handleNo() {
    noAttempts++;

    // Afficher le compteur
    noCounter.classList.remove("hidden");
    if (noAttempts < MAX_NO_ATTEMPTS) {
        noCounter.textContent = noMessages[Math.min(noAttempts - 1, noMessages.length - 1)];
    }

    // Changer le texte du bouton
    if (noAttempts < noBtnTexts.length) {
        btnNo.textContent = noBtnTexts[noAttempts];
    }

    // Secouer la carte
    const card = mainScreen.querySelector(".card");
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 400);

    // Faire grossir le bouton "Oui"
    const scale = 1 + noAttempts * 0.08;
    btnYes.style.transform = `scale(${Math.min(scale, 1.5)})`;

    // Après MAX_NO_ATTEMPTS → le bouton "Non" devient "Oui" et déclenche l'action
    if (noAttempts >= MAX_NO_ATTEMPTS) {
        btnNo.textContent = "Oui 💖";
        btnNo.style.background = "linear-gradient(135deg, #e74c6f, #ff6b8a)";
        btnNo.style.color = "#fff";
        btnNo.classList.remove("runaway");
        btnNo.style.position = "";
        noCounter.textContent = "Tu n'avais pas le choix 😏💖";

        // Remplacer le click handler
        btnNo.removeEventListener("click", handleNo);
        btnNo.removeEventListener("mouseenter", handleNoHover);
        btnNo.removeEventListener("touchstart", handleNoTouch);
        btnNo.addEventListener("click", () => showYesScreen());
        return;
    }

    // Déplacer le bouton aléatoirement (fuite !)
    moveNoButton();
}

function handleNoHover() {
    // Sur desktop : fuir au survol (seulement après la 1ère tentative)
    if (noAttempts >= 1 && noAttempts < MAX_NO_ATTEMPTS) {
        moveNoButton();
    }
}

function handleNoTouch(e) {
    // Sur mobile : fuir au touch
    if (noAttempts >= 1 && noAttempts < MAX_NO_ATTEMPTS) {
        e.preventDefault();
        handleNo();
    }
}

function moveNoButton() {
    // Passer en position fixe pour pouvoir le déplacer
    btnNo.classList.add("runaway");

    const padding = 40; // Marge de sécurité plus grande pour petits écrans
    const btnW = btnNo.offsetWidth;
    const btnH = btnNo.offsetHeight;

    // Zone sûre : ne jamais dépasser les bords visibles
    const safeMinX = padding;
    const safeMinY = padding;
    const safeMaxX = Math.max(safeMinX, window.innerWidth - btnW - padding);
    const safeMaxY = Math.max(safeMinY, window.innerHeight - btnH - padding);

    // Position aléatoire dans la zone visible
    const newX = safeMinX + Math.random() * (safeMaxX - safeMinX);
    const newY = safeMinY + Math.random() * (safeMaxY - safeMinY);

    btnNo.style.left = newX + "px";
    btnNo.style.top = newY + "px";
}


/* ================================================
   6) ÉCRAN "OUI" – CÉLÉBRATION 🎉
   ================================================ */
function showYesScreen() {
    // Transition entre écrans
    mainScreen.classList.remove("active");
    yesScreen.classList.add("active");

    // Lancer les confettis / pluie de cœurs
    launchConfetti();

    // Lancer la musique automatiquement (si pas déjà)
    if (!musicPlaying) {
        startMusic();
        musicToggle.textContent = "🎵";
        musicToggle.classList.add("playing");
        musicPlaying = true;
    }

    // Scroll en haut
    window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ================================================
   7) CONFETTIS / PLUIE DE CŒURS FESTIFS
   ================================================ */
function launchConfetti() {
    // Confettis avec chocolats, fleurs et cœurs 🍫🌺💖
    const confettiEmojis = ["❤️", "💖", "💕", "🎉", "✨", "🌹", "🌺", "🌸", "🌻", "🌷", "💐", "🍫", "🍭", "🧁", "🎊", "💗", "🩷", "💘", "🍯", "🎀"];
    const confettiColors = ["#e74c6f", "#f8a5c2", "#f9ca24", "#ff6b8a", "#c0392b", "#8e44ad", "#e056a0", "#8b4513", "#d2691e"];

    // EXPLOSION immédiate - beaucoup plus de confettis !
    spawnExplosionWave(confettiEmojis, confettiColors, 80);

    // Vague 2 – après 0.5s
    setTimeout(() => spawnConfettiWave(confettiEmojis, confettiColors, 50), 500);

    // Vague 3 – après 1.2s
    setTimeout(() => spawnConfettiWave(confettiEmojis, confettiColors, 35), 1200);

    // Vague finale – après 2.5s
    setTimeout(() => spawnConfettiWave(confettiEmojis, confettiColors, 25), 2500);
}

// Explosion depuis le centre vers l'extérieur
function spawnExplosionWave(emojis, colors, count) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            if (Math.random() > 0.3) {
                createExplosionHeart(emojis, centerX, centerY);
            } else {
                createExplosionPiece(colors, centerX, centerY);
            }
        }, i * 15); // Explosion très rapide
    }
}

function spawnConfettiWave(emojis, colors, count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            // 60% emojis variés, 40% confettis colorés
            if (Math.random() > 0.4) {
                createConfettiHeart(emojis);
            } else {
                createConfettiPiece(colors);
            }
        }, i * 50);
    }
}

function createExplosionHeart(emojis, centerX, centerY) {
    const el = document.createElement("span");
    el.classList.add("explosion-heart");
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Position au centre puis explosion vers l'extérieur
    el.style.left = centerX + "px";
    el.style.top = centerY + "px";
    el.style.fontSize = (Math.random() * 2 + 1.2) + "rem";

    // Direction aléatoire pour l'explosion
    const angle = Math.random() * 360;
    const distance = Math.random() * 400 + 200;
    const duration = Math.random() * 2 + 1.5;

    el.style.setProperty('--angle', angle + 'deg');
    el.style.setProperty('--distance', distance + 'px');
    el.style.animationDuration = duration + "s";

    confettiBox.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
}

function createExplosionPiece(colors, centerX, centerY) {
    const el = document.createElement("div");
    el.classList.add("explosion-piece");
    el.style.left = centerX + "px";
    el.style.top = centerY + "px";
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = (Math.random() * 12 + 8) + "px";
    el.style.height = (Math.random() * 12 + 8) + "px";
    el.style.borderRadius = Math.random() > 0.3 ? "50%" : "3px";

    const angle = Math.random() * 360;
    const distance = Math.random() * 350 + 150;
    const duration = Math.random() * 2.5 + 1.8;

    el.style.setProperty('--angle', angle + 'deg');
    el.style.setProperty('--distance', distance + 'px');
    el.style.animationDuration = duration + "s";

    confettiBox.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
}

function createConfettiHeart(emojis) {
    const el = document.createElement("span");
    el.classList.add("confetti-heart");
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = (Math.random() * 1.5 + 1) + "rem";

    const duration = Math.random() * 3 + 2;
    el.style.animationDuration = duration + "s";

    confettiBox.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
}

function createConfettiPiece(colors) {
    const el = document.createElement("div");
    el.classList.add("confetti-piece");
    el.style.left = Math.random() * 100 + "vw";
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = (Math.random() * 8 + 6) + "px";
    el.style.height = (Math.random() * 8 + 6) + "px";
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";

    const duration = Math.random() * 3 + 2;
    el.style.animationDuration = duration + "s";

    confettiBox.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 500);
}


/* ================================================
   8) MESSAGE SECRET + BOUQUET DE ROSES 🌹
   ================================================ */
btnSecret.addEventListener("click", () => {
    secretContent.classList.toggle("hidden");

    if (secretContent.classList.contains("hidden")) {
        btnSecret.textContent = "🔐 Ouvrir le message secret";
    } else {
        btnSecret.textContent = "🔒 Fermer le message secret";

        // Séquence : 1) Bouquet apparaît, 2) Disparaît, 3) Message apparaît
        showBouquetSequence();
    }
});

/**
 * Séquence complète : bouquet → disparition → révélation du message
 */
function showBouquetSequence() {
    // Trouver le contenu du message (soit custom soit default)
    let secretText = null;

    // Déterminer quel message est visible
    if (secretCustom && !secretCustom.classList.contains('hidden')) {
        secretText = secretCustom;
    } else if (secretDefault) {
        secretText = secretDefault;
    }

    // Cacher temporairement le contenu du message
    if (secretText) {
        secretText.style.opacity = '0';
        secretText.style.transform = 'scale(0.8)';
        secretText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    // Vérifier que bouquetOverlay existe
    if (!bouquetOverlay) {
        // Si pas de bouquet, juste révéler le message avec confettis
        if (secretText) {
            setTimeout(() => {
                secretText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                secretText.style.opacity = '1';
                secretText.style.transform = 'scale(1)';
            }, 200);
        }
        const emojis = ["💖", "✨", "🌹", "💕", "📝", "💌"];
        for (let i = 0; i < 15; i++) {
            setTimeout(() => createConfettiHeart(emojis), i * 80);
        }
        return;
    }

    // 1) Afficher le bouquet
    bouquetOverlay.classList.remove("hidden");
    bouquetOverlay.classList.remove("hiding");

    // 2) Lancer les pétales immédiatement
    spawnFallingPetals(25);

    // 3) Faire disparaître le bouquet après 2 secondes
    setTimeout(() => {
        bouquetOverlay.classList.add("hiding");

        // 4) Une fois le bouquet caché, révéler le message avec animation
        setTimeout(() => {
            bouquetOverlay.classList.add("hidden");
            bouquetOverlay.classList.remove("hiding");

            // Révéler le message avec une belle transition
            if (secretText) {
                secretText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                secretText.style.opacity = '1';
                secretText.style.transform = 'scale(1)';
            }

            // Confettis de célébration pour le message
            const emojis = ["💖", "✨", "🌹", "💕", "📝", "💌"];
            for (let i = 0; i < 15; i++) {
                setTimeout(() => createConfettiHeart(emojis), i * 80);
            }
        }, 800); // Attendre la fin de l'animation de disparition
    }, 2000); // Le bouquet reste 2 secondes
}

/* ================================================
   9) SÉLECTION DE CADEAUX 🎁
   ================================================ */
// Gérer la sélection des cadeaux
document.addEventListener('DOMContentLoaded', () => {
    const giftOptions = document.querySelectorAll('input[name="gift"]');
    const giftFeedback = document.getElementById('gift-feedback');
    const selectedGiftText = document.getElementById('selected-gift');

    const giftMessages = {
        chocolats: "Une boîte de chocolats délicieux",
        fleurs: "Un magnifique bouquet de fleurs",
        nounours: "Un adorable nounours tout doux",
        bijoux: "De superbes bijoux qui brillent",
        argent: "Un bouquet d'argent généreux",
        shein: "Ton panier SHEIN validé",
        surprise: "Tu veux me faire une surprise"
    };

    // Variable globale pour stocker le cadeau sélectionné
    window.selectedGift = null;

    giftOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            if (e.target.checked) {
                const selectedGift = e.target.value;
                window.selectedGift = selectedGift; // Stocker la sélection
                selectedGiftText.textContent = giftMessages[selectedGift];
                giftFeedback.classList.remove('hidden');

                // Effet confetti spécial pour "Surprends-moi"
                let giftEmojis;
                if (selectedGift === 'surprise') {
                    giftEmojis = ["🎲", "🎁", "✨", "🎉", "💫", "🌟", "🎊"];
                    // Plus de confettis pour la surprise !
                    for (let i = 0; i < 15; i++) {
                        setTimeout(() => createConfettiHeart(giftEmojis), i * 60);
                    }
                } else {
                    giftEmojis = ["🎁", "✨", "💖", "🎉"];
                    for (let i = 0; i < 8; i++) {
                        setTimeout(() => createConfettiHeart(giftEmojis), i * 100);
                    }
                }

                // Animation de la carte sélectionnée
                const selectedCard = e.target.nextElementSibling;
                selectedCard.style.animation = 'none';
                setTimeout(() => {
                    selectedCard.style.animation = 'giftSelected 0.4s ease-out';
                }, 10);

                // Envoyer l'info du cadeau à l'expéditeur (simulation)
                sendGiftSelection(selectedGift);
            }
        });
    });
});

/**
 * Quand le destinataire choisit un cadeau, on lui propose d'envoyer sa réponse
 */
function sendGiftSelection(gift) {
    const giftNames = {
        chocolats: "🍫 Boîte de chocolats",
        fleurs: "💐 Bouquet de fleurs",
        nounours: "🧸 Nounours",
        bijoux: "💎 Bijoux",
        argent: "💰 Bouquet d'argent",
        shein: "🛍️ Panier SHEIN",
        surprise: "🎲 Surprise"
    };

    // Construire l'URL de réponse que l'expéditeur pourra ouvrir
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const recipientName = params.get('name') || '';
    const responseParams = new URLSearchParams();
    responseParams.set('response', gift);
    if (recipientName) responseParams.set('from', recipientName);
    const responseURL = baseURL + '?' + responseParams.toString();

    // Texte de partage — le lien est DANS le texte pour être sûr qu'il est visible
    const shareText = `💖 J'ai dit OUI ! Et j'ai choisi : ${giftNames[gift]} 🎁\n\n👇 Ouvre ce lien pour voir ma réponse :\n${responseURL}`;

    // Créer la notification avec bouton d'envoi
    const notification = document.createElement('div');
    notification.className = 'gift-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <p><strong>✅ ${giftNames[gift]} choisi !</strong></p>
            <p style="font-size:0.85rem; margin-top:8px;">Envoie ta réponse pour qu'il/elle sache 💌</p>
            <button id="btn-send-response" class="btn btn-share" style="margin-top:10px; width:100%; font-size:0.95rem; padding:12px;">📤 Envoyer ma réponse</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animation d'apparition
    setTimeout(() => notification.classList.add('show'), 100);

    // Gestionnaire du bouton envoyer
    document.getElementById('btn-send-response').addEventListener('click', () => {
        // Toujours utiliser WhatsApp/SMS avec le lien DANS le texte
        if (navigator.share) {
            navigator.share({
                title: '💖 Réponse Valentine',
                text: shareText,
            }).catch(() => {
                // Fallback WhatsApp
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
            });
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        }
    });

    // Ne PAS auto-fermer — on laisse le bouton visible
}

/**
 * Affiche un bouquet de roses en plein écran avec des pétales
 * qui tombent, puis disparaît après quelques secondes.
 */
function showBouquet() {
    // Afficher l'overlay
    bouquetOverlay.classList.remove("hidden");
    bouquetOverlay.classList.remove("hiding");

    // Lancer des pétales de roses qui tombent
    spawnFallingPetals(20);

    // Disparition automatique après 3.5 secondes
    const autoHideTimeout = setTimeout(() => hideBouquet(), 3500);

    // Cliquer pour fermer plus tôt
    function clickToClose() {
        clearTimeout(autoHideTimeout);
        hideBouquet();
        bouquetOverlay.removeEventListener("click", clickToClose);
    }
    bouquetOverlay.addEventListener("click", clickToClose);
}

function hideBouquet() {
    bouquetOverlay.classList.add("hiding");
    // Attendre la fin de l'animation avant de cacher
    setTimeout(() => {
        bouquetOverlay.classList.add("hidden");
        bouquetOverlay.classList.remove("hiding");
    }, 800);
}

/**
 * Fait tomber des pétales de roses sur l'écran
 */
function spawnFallingPetals(count) {
    const petals = ["🌹", "🥀", "🌸", "💐", "🪻", "🪷"];
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const petal = document.createElement("span");
            petal.classList.add("falling-petal");
            petal.textContent = petals[Math.floor(Math.random() * petals.length)];
            petal.style.left = Math.random() * 100 + "vw";
            petal.style.fontSize = (Math.random() * 1.5 + 1.2) + "rem";

            const duration = Math.random() * 3 + 3;
            petal.style.animationDuration = duration + "s";

            document.body.appendChild(petal);
            setTimeout(() => petal.remove(), duration * 1000 + 500);
        }, i * 150);
    }
}


/* ================================================
   9) GÉNÉRATION DE LIEN PERSONNALISÉ
   ================================================ */
btnGenerate.addEventListener("click", () => {
    const name = inputName.value.trim();
    const genre = inputGenre.value;
    const msg = inputMsg.value.trim();
    const secret = inputSecret.value.trim();

    if (!name) {
        inputName.focus();
        inputName.style.borderColor = "#e74c6f";
        setTimeout(() => inputName.style.borderColor = "", 1500);
        return;
    }

    // Construire l'URL pour le destinataire
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();

    params.set("name", name);
    params.set("genre", genre);
    if (msg) params.set("msg", msg);
    if (secret) params.set("secret", secret);

    const destinataireURL = baseURL + "?" + params.toString();

    // Afficher le lien à partager
    generatedLinkBox.innerHTML = `
        <div class="link-section">
            <label>🎯 Lien à envoyer à ${name} :</label>
            <input type="text" value="${destinataireURL}" readonly class="generated-link-input" id="destinataire-link" />
            <div class="link-actions">
                <button class="btn btn-copy" data-link="destinataire">📋 Copier</button>
                <button class="btn btn-share" data-link="destinataire">📤 Partager</button>
            </div>
        </div>
        <p style="font-size:0.85rem; color: var(--text-light); margin-top:12px; text-align:center;">💡 Quand ${name} choisira un cadeau, il/elle pourra t'envoyer sa réponse directement !</p>
    `;
    generatedLinkBox.classList.remove("hidden");
    copyFeedback.classList.add("hidden");

    // Gestionnaires pour les boutons
    document.querySelectorAll('[data-link]').forEach(btn => {
        if (btn.classList.contains('btn-copy')) {
            btn.addEventListener('click', () => {
                const linkInput = document.getElementById('destinataire-link');
                copyToClipboard(linkInput.value);
            });
        } else if (btn.classList.contains('btn-share')) {
            btn.addEventListener('click', () => {
                const linkInput = document.getElementById('destinataire-link');
                shareLink(linkInput.value, `💌 Quelqu'un a une question spéciale pour toi… Ouvre ce lien ! 💕`);
            });
        }
    });

    // Petit confetti
    const emojis = ["💌", "✨", "💖"];
    for (let i = 0; i < 6; i++) {
        setTimeout(() => createConfettiHeart(emojis), i * 100);
    }
});

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback();
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        // Fallback pour anciens navigateurs
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showCopyFeedback();
    }
}

function shareLink(link, text) {
    if (navigator.share) {
        navigator.share({
            title: "💌 Seras-tu ma Valentine ?",
            text: text,
            url: link,
        }).catch(() => {
            // L'utilisateur a annulé
        });
    } else {
        // Fallback : ouvrir WhatsApp
        const whatsappURL = `https://wa.me/?text=${encodeURIComponent(text + "\n" + link)}`;
        window.open(whatsappURL, "_blank");
    }
}

/* ================================================
   10) COPIER LE LIEN
   ================================================ */
function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showCopyFeedback();
}

function showCopyFeedback() {
    copyFeedback.classList.remove("hidden");
    setTimeout(() => copyFeedback.classList.add("hidden"), 2500);
}


/* ================================================
   11) PARTAGER (intégré dans les boutons dynamiques)
   ================================================ */


/* ================================================
   12) SMALL EXTRAS
   ================================================ */

// Empêcher le clic droit sur la page (optionnel, pour le fun)
// document.addEventListener("contextmenu", e => e.preventDefault());

// Si l'utilisateur redimensionne, repositionner le bouton "Non" s'il s'est échappé
window.addEventListener("resize", () => {
    if (btnNo.classList.contains("runaway")) {
        moveNoButton();
    }
});

// Petit Easter egg : taper "love" au clavier → confettis
let easterBuffer = "";
document.addEventListener("keydown", (e) => {
    easterBuffer += e.key.toLowerCase();
    if (easterBuffer.includes("love")) {
        easterBuffer = "";
        const emojis = ["❤️", "💖", "💕", "🌹", "✨"];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createConfettiHeart(emojis), i * 60);
        }
    }
    // Garder le buffer court
    if (easterBuffer.length > 20) {
        easterBuffer = easterBuffer.slice(-10);
    }
});
