---
slug: guide-complet-gatectr
title: "Guide complet de GateCtr : réduisez vos coûts LLM de 40% sans changer votre code"
excerpt: GateCtr s'intercale entre votre app et n'importe quel LLM. Un changement d'endpoint suffit pour activer compression, budgets, routage et analytics.
author: GateCtr Team
date: 2026-03-26
category: Infrastructure IA
readTime: 12
---

## Qu'est-ce que GateCtr ?

Les coûts LLM sont imprévisibles. Une fonctionnalité qui coûte 50 € en test peut atteindre 2 000 € en production sans avertissement. Les tokens de prompt s'accumulent silencieusement. Les ingénieurs choisissent leurs modèles par habitude plutôt que par rapport qualité-prix. Les équipes finance détestent ça.

GateCtr est une passerelle LLM qui résout tout cela en un seul changement d'endpoint.

Elle s'intercale entre votre application et n'importe quel fournisseur LLM — OpenAI, Anthropic, Mistral et bien d'autres — et applique automatiquement quatre couches d'optimisation à chaque requête :

- **Context Optimizer** — compresse vos prompts, -40% de tokens en moyenne
- **Budget Firewall** — plafonds stricts par projet, les dépassements sont physiquement impossibles
- **Model Router** — sélectionne automatiquement le bon modèle pour chaque requête
- **Analytics** — chaque token, chaque coût, en temps réel

Pas de lock-in SDK. Pas de réécriture. Un seul changement d'URL de base et c'est fait.

---

## Démarrer en 5 minutes

### 1. Obtenir votre clé API

Inscrivez-vous sur [gatectr.com](https://gatectr.com) et récupérez votre clé API depuis le dashboard. Votre clé suit le format `gct_live_xxxxxxxxxxxx`.

Stockez-la dans une variable d'environnement — ne la committez jamais directement dans votre code source :

```bash
export GATECTR_API_KEY="gct_live_xxxxxxxxxxxx"
```

### 2. Installer le SDK

**Node.js / TypeScript :**

```bash
npm install @gatectr/sdk
```

**Python :**

```bash
pip install gatectr-sdk
# ou avec uv
uv add gatectr-sdk
```

Pas de SDK ? Utilisez cURL ou n'importe quel client HTTP — GateCtr expose une API REST standard.

### 3. Effectuer votre première requête

**Node.js :**

```typescript
import { GateCtr } from '@gatectr/sdk';

const client = new GateCtr({ apiKey: process.env.GATECTR_API_KEY });

const response = await client.complete({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Bonjour' }],
});

console.log(response.choices[0].text);

// Métadonnées GateCtr sur chaque réponse
console.log(response.gatectr.tokensSaved);  // tokens économisés par l'optimizer
console.log(response.gatectr.modelUsed);    // modèle qui a traité la requête
console.log(response.gatectr.latencyMs);    // latence end-to-end en ms
```

**Python :**

```python
import os
from gatectr import GateCtr

client = GateCtr(api_key=os.environ["GATECTR_API_KEY"])

response = await client.complete(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Bonjour"}],
)

print(response.choices[0].text)
print(response.gatectr.tokens_saved)
print(response.gatectr.model_used)
```

**HTTP brut (sans SDK) :**

```bash
curl https://api.gatectr.com/v1/complete \
  -H "Authorization: Bearer $GATECTR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{ "role": "user", "content": "Bonjour" }]
  }'
```

C'est tout. GateCtr gère désormais chaque requête entre votre application et le LLM.

---

## Context Optimizer : -40% de tokens, même résultat

Le Context Optimizer est le gain le plus rapide que GateCtr vous offre. Avant de transmettre votre requête au LLM, il analyse et compresse le prompt :

- Supprime les espaces superflus et les formules de remplissage
- Condense les instructions verbeuses sans modifier l'intention
- Réduit l'historique de conversation aux échanges les plus pertinents
- Déduplique le contexte répété entre les messages
- Préserve tous les sens sémantiques et les blocs de code

Réduction moyenne : **-40% de tokens**. La qualité des réponses est maintenue — le LLM reçoit un prompt sémantiquement équivalent, simplement plus court.

L'optimizer est activé par défaut sur les plans Pro. Vous pouvez aussi le contrôler par requête :

```typescript
const response = await client.complete({
  model: 'gpt-4o',
  messages,
  gatectr: { optimize: true },
});

console.log(`Tokens économisés : ${response.gatectr.tokensSaved}`);
```

Ou l'activer globalement pour toutes les requêtes à l'initialisation du client :

```typescript
const client = new GateCtr({
  apiKey: process.env.GATECTR_API_KEY,
  optimize: true,  // appliqué à chaque requête
});
```

Sur un produit envoyant 500 000 tokens par jour, une réduction de 40% représente 200 000 tokens économisés — chaque jour.

---

## Budget Firewall : fini les factures surprises

Chaque requête passe par le Budget Firewall avant d'atteindre le LLM. Si le budget du projet est dépassé, la requête est bloquée immédiatement avec une réponse `429 Budget Exceeded`. Aucun token n'est consommé. Aucun coût n'est engagé.

```
Requête → Vérification Budget Firewall
  ├─ Sous la limite → transmission au LLM → réponse
  └─ Au-dessus     → 429 Budget Exceeded (aucun appel LLM effectué)
```

### Définir un budget

Rendez-vous dans **Projects → Votre projet → Budget** sur le dashboard, ou configurez-le via l'API :

```bash
curl -X PATCH https://api.gatectr.com/v1/budget \
  -H "Authorization: Bearer $GATECTR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj_123",
    "limit_tokens": 500000,
    "limit_cost_usd": 10.00,
    "period": "month"
  }'
```

Vous pouvez plafonner par nombre de tokens, par coût estimé en USD, ou les deux — le premier limite atteint déclenche le blocage.

### Périodes de budget

| Période | Réinitialisation |
|---|---|
| `day` | Minuit UTC |
| `month` | 1er du mois, minuit UTC |
| `total` | Jamais — doit être réinitialisé manuellement |

### Alertes souples avant le plafond dur

Vous n'avez pas à attendre que le budget soit entièrement épuisé pour être notifié. Définissez un seuil `alert_at_percent` pour recevoir un webhook avant que le plafond soit atteint :

```json
{
  "project_id": "proj_123",
  "limit_tokens": 100000,
  "period": "day",
  "alert_at_percent": 80
}
```

À 80 000 tokens (80%), un webhook `budget.threshold_reached` se déclenche. Vous êtes alerté. Le service continue de fonctionner. À 100 000, il s'arrête.

C'est la différence entre une stratégie de coûts proactive et une stratégie réactive.

---

## Model Router : le bon modèle pour chaque requête

Envoyer chaque requête à GPT-4o, c'est comme prendre un semi-remorque pour aller acheter une baguette. Le Model Router corrige cela automatiquement.

Lorsqu'il est activé, GateCtr évalue chaque requête selon un ensemble de critères et sélectionne le modèle optimal :

- **Complexité de la tâche** — simple Q&R vs raisonnement en plusieurs étapes
- **Exigences de sortie** — longueur, format et qualité attendus
- **Tarification actuelle des modèles** — coût par token en temps réel chez chaque fournisseur
- **Vos préférences de fournisseur** — autoriser ou bloquer des modèles spécifiques
- **Exigences de latence** — équilibre vitesse / qualité

Les requêtes simples vont vers les modèles moins chers. Les requêtes complexes vont vers le meilleur modèle disponible pour le travail.

### Activer le routeur

**Option 1 — Définir `model: "auto"` :**

```typescript
const response = await client.complete({
  model: 'auto',  // déclenche le Model Router
  messages: [{ role: 'user', content: 'Combien font 2 + 2 ?' }],
});

console.log(response.gatectr.modelUsed);  // ex. "gpt-3.5-turbo"
```

**Option 2 — Laisser le routeur surcharger votre préférence :**

```typescript
const response = await client.complete({
  model: 'gpt-4o',          // votre préférence
  messages,
  gatectr: { route: true }, // le routeur peut sélectionner un équivalent moins cher
});
```

**Option 3 — Activer globalement pour toutes les requêtes :**

```typescript
const client = new GateCtr({
  apiKey: process.env.GATECTR_API_KEY,
  route: true,
});
```

Chaque réponse vous indique quel modèle a effectivement été utilisé via `response.gatectr.modelUsed`. Vous savez toujours exactement ce qui a tourné.

---

## Analytics : chaque token, chaque coût, en temps réel

GateCtr enregistre automatiquement chaque requête. Aucune instrumentation de votre côté n'est nécessaire.

### Ce qui est suivi

| Métrique | Description |
|---|---|
| `prompt_tokens` | Tokens envoyés au LLM |
| `completion_tokens` | Tokens reçus |
| `saved_tokens` | Tokens supprimés par le Context Optimizer |
| `model` | Modèle qui a traité la requête |
| `latency_ms` | Latence end-to-end |
| `project_id` | Projet auquel appartient la requête |
| `overage` | Si le plafond budgétaire a été atteint |

### Vues du dashboard

Ouvrez [app.gatectr.com](https://app.gatectr.com) pour accéder à :

- **Overview** — tokens totaux, coût total, requêtes par jour sur tous les projets
- **Par projet** — détail des coûts et tokens par projet
- **Tendances** — graphiques 7j / 30j / 90j avec trajectoire des coûts
- **Économies d'optimisation** — tokens et USD économisés par le Context Optimizer

### Interroger l'usage par API

```typescript
const usage = await client.usage({
  projectId: 'proj_123',
  from: '2026-01-01',
  to: '2026-01-31',
});

console.log(`Coût total : $${usage.totalCostUsd}`);
console.log(`Tokens économisés : ${usage.savedTokens}`);
console.log(`Requêtes totales : ${usage.totalRequests}`);
```

---

## Webhooks : notifications d'événements en temps réel

GateCtr peut envoyer des événements vers n'importe quel endpoint HTTPS — Slack, Teams, PagerDuty ou votre propre backend.

### Comment ça fonctionne

1. Enregistrez une URL d'endpoint dans le dashboard ou via l'API
2. GateCtr génère automatiquement un secret de signature (`whsec_...`)
3. Lorsqu'un événement se déclenche, GateCtr met en file un job de livraison
4. Votre endpoint reçoit un POST signé avec HMAC-SHA256
5. Les livraisons échouées sont relancées automatiquement (jusqu'à 6 tentatives)

### Événements clés

**Budget :**

| Événement | Quand il se déclenche |
|---|---|
| `budget.threshold_reached` | Les dépenses franchissent votre seuil configuré |
| `budget.exceeded` | Plafond dur atteint — requêtes désormais bloquées |
| `budget.reset` | La période budgétaire se réinitialise |

**Requêtes :**

| Événement | Quand il se déclenche |
|---|---|
| `request.completed` | Requête LLM traitée avec succès |
| `request.failed` | Requête échouée |
| `request.budget_blocked` | Requête bloquée par le Budget Firewall |

### Vérifier les signatures de webhook

Chaque payload est signé. Vérifiez toujours avant de traiter :

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

Ne traitez jamais un payload de webhook qui échoue à la vérification de signature.

---

## RBAC : contrôle d'accès par équipe

GateCtr prend en charge le contrôle d'accès basé sur les rôles pour donner aux membres de votre équipe le bon niveau d'accès sans exposer les clés sensibles ni les contrôles de facturation.

Gérez l'accès de l'équipe depuis **Settings → Team** sur le dashboard. Les rôles et les permissions par projet vous permettent d'isoler quels membres peuvent lire, configurer ou administrer chaque projet.

---

## Référence rapide SDK

### Options du constructeur Node.js

| Option | Défaut | Description |
|---|---|---|
| `apiKey` | — | Votre clé `gct_live_...` |
| `timeout` | `30000` ms | Timeout des requêtes |
| `maxRetries` | `3` | Tentatives sur erreurs transitoires |
| `route` | `false` | Active le Model Router globalement |
| `optimize` | `true` | Active le Context Optimizer globalement |

### Options du constructeur Python

| Option | Défaut | Description |
|---|---|---|
| `api_key` | — | Votre clé `gct_live_...` |
| `timeout` | `30.0` s | Timeout des requêtes |
| `max_retries` | `3` | Tentatives sur erreurs transitoires |
| `route` | `False` | Active le Model Router globalement |
| `optimize` | `True` | Active le Context Optimizer globalement |

Toutes les méthodes Python sont async par défaut. Utilisez `SyncGateCtr` si vous avez besoin d'une exécution synchrone.

---

## Bonnes pratiques

**Définissez des budgets avant de passer en production.** Un plafond de tokens ou de coût sur chaque projet est la protection la plus efficace contre les coûts incontrôlés. Traitez-le comme une étape de configuration obligatoire, pas optionnelle.

**Utilisez `model: "auto"` pour les requêtes génériques.** Sauf si vous avez une raison précise de cibler un modèle particulier, laissez le routeur décider. Il choisira systématiquement des modèles moins chers pour les tâches simples et n'escaladra que si la complexité le justifie.

**Activez le Context Optimizer globalement.** Passez `optimize: true` au niveau du client pour que chaque requête bénéficie de la compression par défaut. Vous pouvez toujours le désactiver par requête pour les prompts où l'ordre des tokens est critique.

**Connectez les alertes budget à votre stack d'alerting.** Reliez `budget.threshold_reached` à Slack ou PagerDuty pour que votre équipe soit avertie avant que le pare-feu ne se déclenche. Réagir à une alerte à 80% est bien mieux que de déboguer une panne de production causée par un blocage total.

**Loggez `response.gatectr.modelUsed`.** Enregistrer quel modèle GateCtr a réellement sélectionné vous donne une visibilité sur les décisions de routage dans le temps et facilite l'attribution des coûts.

**Séparez les projets par environnement.** Utilisez des projets GateCtr distincts pour le développement, la staging et la production. Définissez des budgets bien plus stricts sur dev et staging — cela évite les pics de coûts accidentels causés par des boucles de test ou des scripts incontrôlés.

---

## Conclusion

GateCtr est le plan de contrôle qui manque à votre stack LLM. Un seul changement d'endpoint vous donne une compression de prompts qui réduit immédiatement les coûts, des contrôles budgétaires stricts qui empêchent les factures surprises, un routage intelligent qui associe chaque requête au bon modèle, et une observabilité qui rend chaque token et chaque euro visible.

L'intégration prend cinq minutes. Les économies commencent dès la première requête.

[Demandez l'accès sur gatectr.com →](https://gatectr.com)
