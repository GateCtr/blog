---
slug: complete-guide-to-gatectr
title: "The Complete Guide to GateCtr: Cut LLM Costs by 40% Without Changing Your Code"
excerpt: GateCtr sits between your app and any LLM provider. One endpoint swap gives you -40% token costs, hard budget caps, smart routing, and real-time analytics.
author: GateCtr Team
date: 2026-03-26
category: AI Infrastructure
readTime: 12
---

## What Is GateCtr?

LLM costs are unpredictable. A feature that costs $50 during testing can hit $2,000 in production without warning. Prompt tokens pile up silently. Engineers pick models by habit rather than by price-performance fit. Finance teams hate it.

GateCtr is an LLM gateway that solves all of this in one endpoint swap.

It sits between your application and any LLM provider — OpenAI, Anthropic, Mistral, and more — and automatically applies four layers of optimization to every request:

- **Context Optimizer** — compresses your prompts, -40% tokens on average
- **Budget Firewall** — hard caps per project so overages are physically impossible
- **Model Router** — picks the right model for each request automatically
- **Analytics** — every token, every cost, in real time

No SDK lock-in. No rewrite. One line change to your base URL and you are done.

---

## Getting Started in 5 Minutes

### 1. Get Your API Key

Sign up at [gatectr.com](https://gatectr.com) and grab your API key from the dashboard. Your key follows the format `gct_live_xxxxxxxxxxxx`.

Store it as an environment variable — never commit it directly to source code:

```bash
export GATECTR_API_KEY="gct_live_xxxxxxxxxxxx"
```

### 2. Install the SDK

**Node.js / TypeScript:**

```bash
npm install @gatectr/sdk
```

**Python:**

```bash
pip install gatectr-sdk
# or with uv
uv add gatectr-sdk
```

No SDK? Use cURL or any HTTP client — GateCtr exposes a standard REST API.

### 3. Make Your First Request

**Node.js:**

```typescript
import { GateCtr } from '@gatectr/sdk';

const client = new GateCtr({ apiKey: process.env.GATECTR_API_KEY });

const response = await client.complete({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }],
});

console.log(response.choices[0].text);

// GateCtr metadata on every response
console.log(response.gatectr.tokensSaved);  // tokens saved by optimizer
console.log(response.gatectr.modelUsed);    // model that handled the request
console.log(response.gatectr.latencyMs);    // end-to-end latency in ms
```

**Python:**

```python
import os
from gatectr import GateCtr

client = GateCtr(api_key=os.environ["GATECTR_API_KEY"])

response = await client.complete(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
)

print(response.choices[0].text)
print(response.gatectr.tokens_saved)
print(response.gatectr.model_used)
```

**Raw HTTP (no SDK needed):**

```bash
curl https://api.gatectr.com/v1/complete \
  -H "Authorization: Bearer $GATECTR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{ "role": "user", "content": "Hello" }]
  }'
```

That is it. GateCtr is now handling every request between your app and the LLM.

---

## Context Optimizer: -40% Tokens, Same Output

The Context Optimizer is the fastest win GateCtr gives you. Before forwarding your request to the LLM, it analyzes and compresses the prompt:

- Removes redundant whitespace and filler phrases
- Condenses verbose instructions without changing intent
- Trims conversation history to the most relevant turns
- Deduplicates repeated context across messages
- Preserves all semantic meaning and code blocks

Average reduction: **-40% tokens**. Output quality is maintained — the LLM receives a semantically equivalent prompt, just shorter.

The optimizer is enabled by default on Pro plans. You can also control it per request:

```typescript
const response = await client.complete({
  model: 'gpt-4o',
  messages,
  gatectr: { optimize: true },
});

console.log(`Tokens saved: ${response.gatectr.tokensSaved}`);
```

Or enable it globally for all requests at client initialization:

```typescript
const client = new GateCtr({
  apiKey: process.env.GATECTR_API_KEY,
  optimize: true,  // applied to every request
});
```

On a product sending 500,000 tokens per day, a 40% reduction is 200,000 tokens saved — every single day.

---

## Budget Firewall: No More Surprise Invoices

Every request passes through the Budget Firewall before it ever reaches the LLM. If the project budget is exceeded, the request is blocked immediately with a `429 Budget Exceeded` response. No tokens are consumed. No cost is incurred.

```
Request → Budget Firewall check
  ├─ Under limit → forward to LLM → response
  └─ Over limit  → 429 Budget Exceeded (no LLM call made)
```

### Setting a Budget

Go to **Projects → Your project → Budget** in the dashboard, or set it via API:

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

You can cap by token count, by estimated cost in USD, or both — whichever limit is hit first triggers the block.

### Budget Periods

| Period | Resets |
|---|---|
| `day` | Midnight UTC |
| `month` | 1st of the month, midnight UTC |
| `total` | Never — must be manually reset |

### Soft Alerts Before the Hard Cap

You do not have to wait until the budget is fully exhausted to be notified. Set an `alert_at_percent` threshold to receive a webhook before the cap is hit:

```json
{
  "project_id": "proj_123",
  "limit_tokens": 100000,
  "period": "day",
  "alert_at_percent": 80
}
```

At 80,000 tokens (80%), a `budget.threshold_reached` webhook fires. You get a warning. The service keeps running. At 100,000, it stops.

This is the difference between a proactive cost strategy and a reactive one.

---

## Model Router: The Right Model for Every Request

Sending every request to GPT-4o is like driving a lorry to buy a pint of milk. The Model Router fixes this automatically.

When enabled, GateCtr scores each request against a set of criteria and selects the optimal model:

- **Task complexity** — simple Q&A vs. multi-step reasoning
- **Output requirements** — length, format, and quality expectations
- **Current model pricing** — real-time cost per token across providers
- **Your provider preferences** — allow or block specific models
- **Latency requirements** — balance speed vs. quality

Simple requests go to cheaper models. Complex ones go to the best model available for the job.

### Enabling the Router

**Option 1 — Set `model: "auto"`:**

```typescript
const response = await client.complete({
  model: 'auto',  // triggers Model Router
  messages: [{ role: 'user', content: 'What is 2 + 2?' }],
});

console.log(response.gatectr.modelUsed);  // e.g. "gpt-3.5-turbo"
```

**Option 2 — Let the router override your preference:**

```typescript
const response = await client.complete({
  model: 'gpt-4o',          // your preference
  messages,
  gatectr: { route: true }, // router may select a cheaper equivalent
});
```

**Option 3 — Enable globally for all requests:**

```typescript
const client = new GateCtr({
  apiKey: process.env.GATECTR_API_KEY,
  route: true,
});
```

Every response tells you which model was actually used via `response.gatectr.modelUsed`. You always know exactly what ran.

---

## Analytics: Every Token, Every Cost, Real-Time

GateCtr logs every request automatically. No instrumentation needed on your side.

### What Is Tracked

| Metric | Description |
|---|---|
| `prompt_tokens` | Tokens sent to the LLM |
| `completion_tokens` | Tokens received |
| `saved_tokens` | Tokens removed by Context Optimizer |
| `model` | Model that handled the request |
| `latency_ms` | End-to-end latency |
| `project_id` | Which project the request belongs to |
| `overage` | Whether the budget cap was hit |

### Dashboard Views

Open [app.gatectr.com](https://app.gatectr.com) to access:

- **Overview** — total tokens, total cost, requests per day across all projects
- **By project** — cost and token breakdown per project
- **Trends** — 7d / 30d / 90d charts with cost trajectory
- **Optimization savings** — total tokens and USD saved by the Context Optimizer

### Query Usage Programmatically

```typescript
const usage = await client.usage({
  projectId: 'proj_123',
  from: '2026-01-01',
  to: '2026-01-31',
});

console.log(`Total cost: $${usage.totalCostUsd}`);
console.log(`Tokens saved by optimizer: ${usage.savedTokens}`);
console.log(`Total requests: ${usage.totalRequests}`);
```

---

## Webhooks: Real-Time Event Notifications

GateCtr can push events to any HTTPS endpoint — Slack, Teams, PagerDuty, or your own backend.

### How It Works

1. Register an endpoint URL in the dashboard or via API
2. GateCtr generates a signing secret (`whsec_...`) automatically
3. When an event fires, GateCtr queues a delivery job
4. Your endpoint receives a POST signed with HMAC-SHA256
5. Failed deliveries are retried automatically (up to 6 attempts)

### Key Events

**Budget:**

| Event | When it fires |
|---|---|
| `budget.threshold_reached` | Spending crosses your configured threshold |
| `budget.exceeded` | Hard cap hit — requests now blocked |
| `budget.reset` | Budget period resets |

**Requests:**

| Event | When it fires |
|---|---|
| `request.completed` | LLM request processed successfully |
| `request.failed` | Request failed |
| `request.budget_blocked` | Request blocked by Budget Firewall |

### Verifying Webhook Signatures

Every payload is signed. Always verify before processing:

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

Never process a webhook payload that fails signature verification.

---

## RBAC: Team Access Control

GateCtr supports role-based access control so you can give team members the right level of access without exposing sensitive keys or billing controls.

Manage team access from **Settings → Team** in the dashboard. Roles and per-project permissions let you isolate which projects each member can read, configure, or administer.

---

## SDK Quick Reference

### Node.js Constructor Options

| Option | Default | Description |
|---|---|---|
| `apiKey` | — | Your `gct_live_...` key |
| `timeout` | `30000` ms | Request timeout |
| `maxRetries` | `3` | Retries on transient errors |
| `route` | `false` | Enable Model Router globally |
| `optimize` | `true` | Enable Context Optimizer globally |

### Python Constructor Options

| Option | Default | Description |
|---|---|---|
| `api_key` | — | Your `gct_live_...` key |
| `timeout` | `30.0` s | Request timeout |
| `max_retries` | `3` | Retries on transient errors |
| `route` | `False` | Enable Model Router globally |
| `optimize` | `True` | Enable Context Optimizer globally |

All Python methods are async by default. Use `SyncGateCtr` if you need synchronous execution.

---

## Best Practices

**Set budgets before you go to production.** A hard token or cost cap on every project is the single most effective protection against runaway costs. Treat it as a required configuration step, not an optional one.

**Use `model: "auto"` for general-purpose requests.** Unless you have a specific reason to target a particular model, let the router decide. It will consistently pick cheaper models for simple tasks and only escalate when complexity requires it.

**Enable the Context Optimizer globally.** Turn on `optimize: true` at the client level so every request benefits from compression by default. You can always disable it per-request for prompts where token ordering is critical.

**Hook budget alerts into your alerting stack.** Connect `budget.threshold_reached` to Slack or PagerDuty so your team knows before the firewall trips. Reacting to an 80% alert is much better than debugging a production outage caused by a full block.

**Log `response.gatectr.modelUsed`.** Logging which model GateCtr actually selected gives you visibility into routing decisions over time and makes cost attribution easier.

**Separate projects by environment.** Use distinct GateCtr projects for development, staging, and production. Set much tighter budgets on dev and staging — this prevents accidental cost spikes from test loops or runaway scripts.

---

## Conclusion

GateCtr is the control plane your LLM stack is missing. One endpoint swap gives you prompt compression that immediately cuts costs, hard budget controls that prevent invoicing surprises, intelligent routing that matches each request to the right model, and observability that makes every token and every dollar visible.

It takes five minutes to integrate. The savings start from the first request.

[Get access at gatectr.com →](https://gatectr.com)
