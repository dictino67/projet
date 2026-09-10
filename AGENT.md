# 🤖 AGENT.md - Documentation de l'Agent AI

## Projet : Jeu de Sudoku Web

### Description
Application web interactive permettant de jouer au Sudoku dans un navigateur. L'application génère des grilles aléatoires et offre une interface utilisateur moderne et responsive.

---

## 📋 Stack Technique

| Composant | Technologie | Usage |
|-----------|-------------|-------|
| **HTML** | HTML5 | Structure de la page |
| **CSS** | CSS3 | Design, animations, responsive design |
| **JavaScript** | ES6+ | Logique du jeu, génération de grilles |

---

## 🎮 Fonctionnalités Principales

### 1. Génération de Grille
- Algorithme de backtracking pour générer des grilles valides
- Difficulté variable (30 à 59 cases vides aléatoires)
- Chaque partie est unique et imprévisible

### 2. Interaction Utilisateur
- **Sélection de case** : Clic sur une case modifiable pour la sélectionner
- **Entrée des chiffres** :
  - Pavé numérique sur l'interface
  - Clavier physique (1-9, Suppr/0)
- **Feedback visuel** :
  - Case sélectionnée en bleu clair
  - Cases fixes (non modifiables) en gris
  - Erreurs en rouge lors de la vérification
  - Réponses correctes en vert

### 3. Boutons d'Action
- **Nouvelle Partie** : Génère une nouvelle grille aléatoire
- **Vérifier** : Compare les réponses utilisateur avec la solution

### 4. Responsive Design
- Adaptation automatique aux écrans mobiles et desktop
- Navigation fluide sur toutes les tailles d'écran

---

## 📁 Structure du Projet

```
projet/
├── AGENT.md          # Ce fichier de documentation
├── index.html        # Structure HTML principale
├── style.css         # Styles CSS (design & responsive)
└── script.js         # Logique JavaScript (class SudokuGame)
```

---

## 🔧 Architecture

### Classe Principale : `SudokuGame`

| Méthode | Description |
|---------|-------------|
| `constructor()` | Initialisation des variables d'état |
| `init()` | Setup initial de l'application |
| `generateSudoku()` | Algorithme de génération de grille valide |
| `createGameBoard()` | Création de la grille de jeu avec cases vides |
| `createBoardElements()` | Génération du DOM pour la grille 9x9 |
| `displayBoard()` | Affichage de l'état actuel de la grille |
| `setupEventListeners()` | Configuration des événements (clic, clavier) |
| `selectCell()` | Sélection d'une case modifiable |
| `enterNumber()` | Entrée d'un chiffre dans une case |
| `clearCell()` | Effacement d'une case sélectionnée |
| `checkBoard()` | Vérification de la validité des réponses |
| `newGame()` | Démarrage d'une nouvelle partie |

---

## 🎯 Comment Utiliser l'Application

1. **Lancer l'application** : Ouvrez [index.html](file:///Volumes/Mac%20Mini%202T/Documents%202T/PROJETS%20VISUAL%20STUDIO%20CODE/projet/projet/index.html) dans un navigateur
2. **Commencer à jouer** :
   - Cliquez sur une case blanche (modifiable)
   - Entrez un chiffre via le pavé numérique ou le clavier
3. **Vérifier vos réponses** : Cliquez sur "Vérifier" pour voir les erreurs
4. **Gagner** : Remplissez toutes les cases correctement pour gagner
5. **Recommencer** : Cliquez sur "Nouvelle Partie" pour une nouvelle grille

---

## 🎨 Design Guidelines

### Couleurs Principales
- **Fond dégradé** : Violet (#667eea) → Violet foncé (#764ba2)
- **Grille** : Bordures sombres (#333)
- **Case sélectionnée** : Bleu clair (#b3d9ff)
- **Erreur** : Rouge (#ffcccc / #cc0000)
- **Correct** : Vert (#d4edda / #155724)

### Typographie
- **Police** : Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Taille case** : 1.5rem (desktop), 1.2rem (mobile)

---

## 📊 Métriques Techniques

| Fichier | Taille | Lignes |
|---------|--------|--------|
| index.html | ~1.3 KB | ~40 |
| style.css | ~3.7 KB | ~250 |
| script.js | ~8.6 KB | ~265 |

---

## 🚀 Améliorations Futures Possibles

- [ ] Ajout de niveaux de difficulté (Facile, Moyen, Difficile)
- [ ] Timer pour chronométrer la partie
- [ ] Sauvegarde/Chargement d'une partie en cours
- [ ] Mode sombre
- [ ] Sonneries lors des erreurs/succès
- [ ] Score basé sur le temps et les tentatives

---

## 📝 Notes de Développement

- **Framework CSS** : Grid Layout pour la grille 9x9
- **Algorithme** : Backtracking récursif pour la génération
- **Performance** : Optimisé pour une charge instantanée
- **Compatibilité** : Moderne (ES6+, CSS Grid)

---

*Document généré le 10/09/2026 par l'Agent AI du projet Sudoku* 🎲
