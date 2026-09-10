---
name: pylance-python-profiling
description: 'Utilisez ce skill pour profiler du code Python avec Pylance : CPU (Tachyon), trace (sys.monitoring) ou mémoire (Memray). Profilez une exécution complète, une région spécifique entre deux lignes de code, ajoutez des marqueurs de sous-régions, et explorez les profils résultants.'
category: 'Python / Performance'
python_version_requirement: '3.15+ pour le CPU profiling (Tachyon)'

# Pylance Python Profiling - Guide Complet

## Vue d'ensemble

Ce skill permet de piloter les outils `pylancePythonProfiling` (capture) et `pylancePythonProfileExplorer` (analyse). La capture produit des artefacts sur disque + un JSON sidecar de métadonnées ; l'explorateur charge cette métadonnée et répond aux requêtes paginées.

### Outils disponibles

| Tool | Purpose |
|------|---------|
| `pylancePythonProfiling` | Démarrer/arrêter des captures et inspecter les sessions. Une `action` par appel. |
| `pylancePythonProfileExplorer` | Charger un JSON de métadonnées et interroger le profil. |

Exécutez `{"action":"help"}` sur chaque outil pour afficher sa surface complète.

---

## Backends de profilage

- **CPU** : `profiling.sampling` (Tachyon) — Nécessite Python 3.15+

---

## Scénario 1 : Profiler une exécution complète

### Lancer un script avec CPU profiling (mode launch)

```json
{
    "action": "startCpu",
    "mode": "launch",
    "script": "/chemin/vers/app.py",
    "pythonPath": "/chemin/vers/python",
    "samplingRate": "1khz"
}
```

### Attacher à un processus déjà en cours (mode attach)

```json
{
    "action": "startCpu",
    "mode": "attach",
    "pid": 12345,
    "pythonPath": "/chemin/vers/python"
}
```

### Limiter une capture attach par durée (wall-clock)

```json
{
    "action": "startCpu",
    "mode": "attach",
    "pid": 12345,
    "samplingMode": "wall",
    "duration": 30
}
```

### Arrêter et récupérer les artefacts

```json
{
    "action": "stopCpu",
    "profilingSessionId": "pyprof-..."
}
```

---

## Scénario 2 : Profiler une région spécifique (startCpuRegion)

Idéal quand seule une partie du code vous intéresse (une fonction chaude, un handler de requête). Le sampler est actif dès la première instruction de la région — pas de latence d'attachement dans la mesure.

```json
{
    "action": "startCpuRegion",
    "mode": "launch",
    "script": "/chemin/vers/app.py",
    "pythonPath": "/chemin/vers/python",
    "regionStartLocation": "app.py:42",
    "regionStopLocation": "app.py:88"
}
```

### Fonctionnement (sans modification du code utilisateur)

1. La cible se lance sous un handshake injecté. Quand l'exécution atteint `regionStartLocation`, elle se gare.
2. Tachyon s'attache à la cible garée, puis celle-ci est relâchée — la région est échantillonnée dès sa première instruction. Le coût d'attachement est payé pendant le stationnement, hors mesure.
3. Quand l'exécution atteint `regionStopLocation`, le sampler se détache et ses données sont vidées avant que la cible ne reprenne.

> **Note** : Les bornes de région sont enregistrées dans les métadonnées sous `region.startTimeMs`/`region.endTimeMs` pour un découpage exact dans l'explorateur.

- **Trace** : `sys.monitoring` — Fonctionne depuis Python 3.12+
- **Mémoire** : Memray — Attention : non supporté sous Windows ❌


---

## Scénario 3 : Marqueurs de sous-régions (regionMarkers)

Les marqueurs étiquettent des points **à l'intérieur** de la région sans stationnement ni re-attachement. Utilisez-les pour diviser un attachement en plusieurs sous-régions labellisées (moins cher que plusieurs `startCpuRegion`) et annoter des phases.

```json
{
    "action": "startCpuRegion",
    "mode": "launch",
    "script": "/chemin/vers/app.py",
    "pythonPath": "/chemin/vers/python",
    "regionStartLocation": "app.py:42",
    "regionStopLocation": "app.py:88",
    "regionMarkers": [
        "load@app.py:50",
        "compute@app.py:64",
        "render@app.py:80"
    ]
}
```

Chaque fois que l'exécution atteint une ligne marquée à l'intérieur de la région, un timestamp labellisé (ms depuis le début) est enregistré. L'explorateur les expose sous `region.markers` — utilisez-les comme `startTimeMs`/`endTimeMs` pour trancher une sous-région.

---

## Scénario 4 : Trace et Mémoire

### Trace avec sys.monitoring

```json
{
    "action": "startTracing",
    "mode": "launch",
    "module": "monpackage.app",
    "pythonPath": "/chemin/vers/python"
}
```

```json
{
    "action": "stopTracing",
    "profilingSessionId": "pyprof-..."
}
```

### Snapshot Mémoire avec Memray

```json
{
    "action": "takeHeapSnapshot",
    "mode": "launch",
    "script": "/chemin/vers/app.py",

---

## Explorer les résultats (pylancePythonProfileExplorer)

Chargez le JSON de métadonnées du profil, puis interrogez les vues avec le `profileId` retourné :

### Chargement

```json
{
    "action": "loadCpuProfile",
    "filePath": "/chemin/vers/artifactsDir/cpu.metadata.json"
}
```

### Requêtes

```json
{
    "action": "query",
    "profileId": "cpu-...",
    "view": "summary"
}
```

```json
{
    "action": "query",
    "profileId": "cpu-...",
    "view": "bottomUp"
}
```

```json
{
    "action": "query",
    "profileId": "cpu-...",
    "view": "search",
    "queryText": "compute"
}
```

### Vues disponibles

| Backend | Vues |
|---------|------|
| **CPU** | `summary`, `callTree`, `bottomUp`, `eventLog`, `search`, `nodeContext` |
| **Trace** | `summary`, `events`, `byCategory`, `byProcessThread`, `timelineSlices`, `search` |
| **Heap** | `summary`, `allocations`, `search` |

### Syntaxe de recherche (`queryText`)

- Termes séparés par espaces = OR
- `+terme` = AND
- `/regex/` = regex (case-insensitive)
- `"phrase"` = expression exacte

#### Regex supportées (sous-ensemble safe, case-insensitive)

✅ **Supportées** :
- Littéraux et métacaractères échappés
- `.` (n'importe quel caractère)
- Classes de caractères `[...]`, `[^...]`, plages
- `\d` `\D` `\w` `\W` `\s` `\S`
- Ancre `^` `$`
- Groupes `()` et `(?:)`
- Alternation `|`
- Quantificateurs `*` `+` `?` `{m}` `{m,}` `{m,n}` (avec lazy `?`)
- Échappés de contrôle `\n` `\r` `\t` `\f` `\v` `\0`

❌ **Non supportées** (retombent en substring literal) :
- Word boundaries `\b` `\B`

---

## Options de CPU Sampling (startCpu / startCpuRegion)

| Option | Description | Défaut |
|--------|-------------|--------|
| `samplingRate` | Fréquence d'échantillonnage (ex: `"1khz"`) | 500Hz |
| `duration` | Durée en secondes | illimité |
| `samplingMode` | `wall` \| `cpu` \| `gil` \| `exception` | `cpu` |
| `allThreads` | Inclure tous les threads | false |
| `native` | Inclure le code natif | false |
| `noGc` | Ignorer la GC | false |
| `opcodes` | Profiler par opcodes | false |
| `blocking` | Mode bloquant | false ❌ Windows non supporté |

---

## Règles à retenir

1. ✅ Utilisez toujours le sidecar `*.metadata.json` avec l'explorateur, jamais le binaire `.bin` ou `.ndjson`.
2. ✅ Pour CPU profiling, vérifiez/choisissez un interprète Python 3.15+ d'abord. En cas d'erreur, affichez l'erreur brute de la version.

---

## Limitations connues et particularités

### Capture

| Problème | détails | Solution / Remarque |
|----------|---------|---------------------|
| **Memray non supporté sur Windows** | `takeHeapSnapshot` renvoie une erreur consciente de la plateforme sous win32. | Capturez la mémoire sous Linux/WSL ou macOS. |
| **`blocking:true` non supporté sur Windows** | Retourne une erreur structurée avant le démarrage du sampler. | Relancez sans `blocking:true`, ou capturez sous Linux/WSL. |
| **Attach/région sur un `uv venv` Windows peut échouer** | Le trampoline-shim `python.exe` de uv relance l'interprète réel comme enfant puis quitte — le PID lancé disparaît avant que Tachyon puisse l'échantillonner. | Utilisez le mode launch, attachez-vous au vrai child PID `python.exe`, ou passez l'interprète de base via `pythonPath`. |
| **`samplingMode:"gil"` peu usable sous contention GIL** | Très peu d'échantillons collectés. | Préférez `cpu` (ou `wall`) et lisez le comportement thread dans l'arbre d'appels. |
| **`samplingRate` sature vers 400–500 Hz** | Une fréquence demandée plus haute n'augmente pas la fréquence effective. | Considérez ~500 Hz comme plafond pratique. |
| **Markes de région activent `sys.monitoring` par ligne** | Ralentit la cible pendant la région. | Évitez les marqueurs dans des boucles serrées, ou acceptez le ralentissement pour la région mesurée uniquement. |
| **Marqueur sur la ligne exacte du début de région** | Fusionne à `t=0`. | Placez les marqueurs sur des lignes strictement à l'intérieur de la région (après la ligne de départ). |

### Exploration

| Problème | détails | Solution / Remarque |
|----------|---------|---------------------|
| **Charger un binaire raw** | Retourne une erreur opaque sans hint. | Passez toujours le sidecar `*.metadata.json` aux loaders. L'outil renvoie alors un hint amical vers le sidecar. |
| **Vues CPU récapitulent un seul thread** | Les autres threads ne sont pas agrégés dans la même vue. | `loadCpuProfile` indique le thread analysé sous `threads.analyzed` (avec son compte d'échantillons). Signalez cette limitation pour les résultats multi-threads. |
| **`bottomUp` trié par self peut lister en premier des frames bootstrap à self=0** | Le root/bootstrap n'a pas de temps propre. | Regardez au-delà des frames bootstrap avec zero self pour trouver les vraies feuilles chaudes. |
| **Vues d'événements Trace scannent tous les événements** | `events`, `search`, `byCategory`, `byProcessThread` paginent sur l'ensemble complet et se réconcilient avec `summary`. | Utilisez la fenêtre temporelle (`startTimeMs`/`endTimeMs`) pour atteindre des événements ultérieurs plutôt que d'attendre qu'une seule page couvre toute la trace. |

---

## Actions disponibles (pylancePythonProfiling)

| action | Usage |
|--------|-------|
| `list` | Afficher les sessions actives/terminées. |
| `status` | Inspecter une session (`profilingSessionId`). |
| `startCpu` | Capture CPU. `mode:"launch"` (script/module) ou `mode:"attach"` (pid). |
| `startCpuRegion` | Capture CPU d'une seule région (mode launch uniquement). Voir Scénario 2. |
| `stopCpu` | Arrêter/finaliser une session CPU ; renvoie les chemins des artefacts sauvegardés. |
| `startTracing` | Trace `sys.monitoring` d'un script/module (launch uniquement). |
| `stopTracing` | Arrêt coopératif pour une session trace. |
| `takeHeapSnapshot` | Capture Memray one-shot. |
| `stop` | Terminer une session et la retirer de la liste in-memory. |
| `help` | Afficher l'aide complète. |

3. ✅ Préférez `startCpuRegion` à `startCpu` + `duration` quand vous visez une plage de code spécifique — le handshake garantit que le sampler est actif dès le début de la région.
4. ✅ Préférez les marqueurs à plusieurs captures de régions minuscules pour labelliser plusieurs phases adjacentes sous un seul attachement.
5. 📌 Rapportez toujours `profilingSessionId`, `artifactsDir`, et (pour les régions) les lieux start/stop/markers résolus pour permettre une relecture ultérieure.

- Groupes nommés, backreferences
- Look-around `(?=)` `(?!)` `(?<=)` `(?<!)`
- Échappés hex/Unicode `\xHH` `\uHHHH`
- Property escapes Unicode `\p{...}`
- Flags (`i s m g u y`)

    "pythonPath": "/chemin/vers/python",
    "traceNativeMemory": true
}
```

---

## Exemple de workflow complet

```json
// 1. Lancer une capture CPU sur une région
{
    "action": "startCpuRegion",
    "mode": "launch",
    "script": "./src/main.py",
    "pythonPath": "/usr/bin/python3.15",
    "regionStartLocation": "main.py:20",
    "regionStopLocation": "main.py:75",
    "regionMarkers": ["init@main.py:25", "process@main.py:40"]
}

// Renvoie : profilingSessionId, artifactsDir, region metadata...

// 2. Arrêter et récupérer les artefacts
{
    "action": "stopCpu",
    "profilingSessionId": "pyprof-abc123"
}

// 3. Charger le profil dans l'explorateur
{
    "action": "loadCpuProfile",
    "filePath": "/tmp/profiles/pyprof-abc123/cpu.metadata.json"
}

// 4. Interroger les vues
{
    "action": "query",
    "profileId": "cpu-abc123",
    "view": "summary"
}

{
    "action": "query",
    "profileId": "cpu-abc123",
    "view": "bottomUp"
}

// 5. Rechercher des fonctions spécifiques
{
    "action": "query",
    "profileId": "cpu-abc123",
    "view": "search",
    "queryText": "+compute +process /pattern/"
}
```

---

**Fin du guide — pylance-python-profiling**

