// VARIABLES PRINCIPALES
let listeTaches = [];

// ÉLÉMENTS DU DOM
const inputTache      = document.getElementById('nouvelle-tache');
const btnAjouter      = document.getElementById('bouton-ajouter');
const selectFiltre    = document.getElementById('filtre-statut');
const inputRecherche  = document.getElementById('recherche-tache');
const listeTachesEl   = document.getElementById('liste-taches');

// CHARGEMENT INITIAL
function chargerTaches() {
    const donnees = localStorage.getItem('taches');
    if (donnees) {
        listeTaches = JSON.parse(donnees);
    }
}

// SAUVEGARDE
function sauvegarderTaches() {
    localStorage.setItem('taches', JSON.stringify(listeTaches));
}

// CRÉATION D'UNE LIGNE TÂCHE
function creerElementTache(tache, index) {
    const li = document.createElement('li');
    li.className = 'tache';
    if (tache.complete) li.classList.add('complete');

    li.innerHTML = `
        <span>${tache.texte}</span>
        <div class="boutons-tache">
            <button class="bouton-completer">✓</button>
            <button class="bouton-modifier">Modifier</button>
            <button class="bouton-supprimer">Supprimer</button>
        </div>
    `;

    li.dataset.index = index;

    return li;
}

// AFFICHAGE DES TÂCHES (avec filtres)
function afficherTaches() {
    const filtre = selectFiltre.value;
    const recherche = inputRecherche.value.toLowerCase().trim();

    const tachesFiltrees = listeTaches.filter(tache => {
        const matchTexte = tache.texte.toLowerCase().includes(recherche);
        if (filtre === 'completes')    return tache.complete && matchTexte;
        if (filtre === 'incompletes')  return !tache.complete && matchTexte;
        return matchTexte;
    });

    listeTachesEl.innerHTML = '';

    tachesFiltrees.forEach((tache, indexGlobal) => {
        // On retrouve l'index original dans le tableau complet
        const indexOriginal = listeTaches.indexOf(tache);
        const element = creerElementTache(tache, indexOriginal);
        listeTachesEl.appendChild(element);
    });
}

// AJOUT D'UNE TÂCHE
function ajouterTache() {
    const texte = inputTache.value.trim();
    const messageErreur = document.getElementById('message-erreur');

    if (!texte) {
        messageErreur.style.display = 'block';
        inputTache.focus();
        setTimeout(() => {
            messageErreur.style.display = 'none';
        }, 2500); // disparaît après 2.5 secondes
        return;
    }

    // Si tout est OK
    messageErreur.style.display = 'none';

    listeTaches.push({
        texte: texte,
        complete: false
    });

    sauvegarderTaches();
    afficherTaches();
    inputTache.value = '';
    inputTache.focus();
}

/// GESTION DES CLICS SUR LES BOUTONS (délégation)
listeTachesEl.addEventListener('click', (e) => {
    const btn = e.target;
    if (!btn.matches('button')) return;

    const li = btn.closest('li');
    const index = parseInt(li.dataset.index);

    if (btn.classList.contains('bouton-supprimer')) {
        // Confirmation personnalisée
        const confirmation = confirm(`Voulez-vous vraiment supprimer la tâche :\n"${listeTaches[index].texte}" ?`);

        if (confirmation) {
            listeTaches.splice(index, 1);  
            sauvegarderTaches();
            afficherTaches();
        }
        // Sinon on ne fait rien → l'utilisateur a cliqué "Annuler"
    }
    else if (btn.classList.contains('bouton-modifier')) {
        const nouveauTexte = prompt('Modifier la tâche :', listeTaches[index].texte);
        if (nouveauTexte !== null && nouveauTexte.trim()) {
            listeTaches[index].texte = nouveauTexte.trim();
            sauvegarderTaches();
            afficherTaches();
        }
    }
    else if (btn.classList.contains('bouton-completer')) {
        listeTaches[index].complete = !listeTaches[index].complete;
        sauvegarderTaches();
        afficherTaches();
    }
});

// ÉVÉNEMENTS
btnAjouter.addEventListener('click', ajouterTache);

inputTache.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        ajouterTache();
    }
});

selectFiltre.addEventListener('change', afficherTaches);
inputRecherche.addEventListener('input', afficherTaches);

// INITIALISATION
chargerTaches();
afficherTaches();
