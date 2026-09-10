# Agent Code Reviewer

## 📋 Description

Agent spécialisé dans la vérification automatique de la qualité du code après création ou modification, avec résolution proactive des problèmes de structure.

## 🎯 Fonctionnalités Principales

1. **Vérification Post-Création** : Analyse immédiate du code nouvellement créé
2. **Assurance Qualité** : Vérification des standards et bonnes pratiques
3. **Analyse Structurelle** : Identification des problèmes d'architecture
4. **Résolution Automatique** : Correction des problèmes de structure détectés

## 🚀 Utilisation

### Quand l'utiliser ?
- ✅ Après avoir créé un nouveau code
- ✅ Après des modifications importantes
- ✅ Avant de merger du code
- ✅ Pour une vérification qualité périodique

### Comment déclencher ?
Dites simplement :
- "Vérifie la qualité du code"
- "Fais une revue de code"
- "Y a-t-il des problèmes de structure ?"
- "Code review"

## 📊 Ce que l'agent fait

```
1. Découverte → Identifie les fichiers créés/modifiés
2. Vérification → Analyse la qualité et le style
3. Analyse Structurelle → Détecte les problèmes d'architecture  
4. Résolution → Corrige ou recommande des améliorations
5. Rapport → Génère un résumé structuré
```

## 📝 Exemple de Rapport

```
## Code Review Report

### Fichiers Analysés
- main.py
- utils/helper.py

### Problèmes de Qualité
1. 🔴 **Critique** - Variable nommée 'x' sans description claire
   Impact: Difficile à comprendre sans documentation
   
### Problèmes de Structure  
1. 🟡 **Important** - Fonction trop longue (85 lignes)
   Solution suggérée: Diviser en 2-3 fonctions plus petites

### Résumé
- Total Problèmes: 3
- Critiques: 1
- Importants: 2
- Score Qualité: 7/10
```

## 🎨 Priorités de Correction

| Niveau | Emoji | Action |
|--------|-------|--------|
| **Critique** | 🔴 | Correction immédiate - Impacte la fonctionnalité |
| **Important** | 🟡 | À corriger bientôt - Impacte la maintenabilité |
| **Amélioration** | 🟢 | Optionnel - Améliore la qualité |

## 💡 Points Forts

- ✅ Proactif sur les problèmes structurels
- ✅ Conservateur avec le style (sauf si impact important)
- ✅ Respecte les patterns existants du projet
- ✅ Explications claires pour chaque modification

---

**Dernière mise à jour**: 10/09/2026