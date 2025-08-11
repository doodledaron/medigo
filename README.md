# Medigo — Turn Hospital Uncertainty into Certainty

A friendly voice + clear navigation + live queues — so Uncle Tan (and everyone else) knows **where to go, how to get there, and how long to wait**.

---

##  Watch the Demo
[![Medigo Demo](https://img.youtube.com/vi/3b6N4qs8pQE/0.jpg)](https://youtu.be/3b6N4qs8pQE)

---

## Why Medigo?

## Main Points — What Medigo Does for You

We bring **clarity and certainty** to your hospital journey.  
Think of it as a **personal assistant in your pocket** that:

1. **Helps you understand your symptoms** — so you start with the right information.  
2. **Guides you to the correct department and doctor** — no more guesswork.  
3. **Shows you the nearest hospitals with travel distance** — make informed choices.  
4. **Navigates you inside the hospital with ease** — via NFC checkpoints.  
5. **Gives you live queue status** — know exactly how long you’ll wait.

> Now, Uncle Tan doesn’t just know **where** to go — he also knows **how** to get there and **what to expect** when he arrives.

---

## Demo Steps

With Medigo’s **voice assistant** and **checkpoint-based navigation + queueing system**, Uncle Tan:

1. Uses the **Medigo Voice Assistant** to describe his symptoms.  
2. Gets matched to the **correct hospital, department, and doctor**.  
3. Navigates effortlessly to the **right department using NFC checkpoints**.  
4. Checks the **real-time queue length** before even arriving.

---

Elderly patients often avoid hospitals, not because they don’t need care, but because of **uncertainty**:
- Which **department**? Which **doctor**?
- How **far** is the hospital? How to **navigate** once inside?
- How **long** is the **queue**?

**Medigo** is your **personal assistant in your pocket** that:
1. Understands your **symptoms**  
2. Directs you to the **right department & doctor**  
3. Finds **nearby hospitals** with travel distances  
4. Navigates inside the hospital via **NFC checkpoints**  
5. Shows **live queue status** so you know wait time in advance

Result: **Clarity & confidence**, from home to hospital check-in.

---

## Demo Flow

1. **Medigo Voice Assistant** — describe symptoms  
2. Get matched to the **hospital → department → doctor**  
3. Follow **NFC checkpoints** to the correct ward/clinic  
4. Check **real-time queue length** before and on arrival

> Benefit: Plan your time — maybe **yumcha with Aunty Mei Lian** while waiting 😎

---

## Key Tech

- **Next.js (PWA)** – Fast time-to-market and smooth mass adoption  
- **ElevenLabs** – Natural, human-like **voice assistant**  
- **n8n** – Backend automation to reduce dev cost and ship faster  
- **Groq** – LLM APIs (e.g., **GPT-OSS 20B**) for symptom understanding  
- **NFC** – Indoor navigation via **checkpoint taps**  
- **Vercel** – Scalable, fast **frontend hosting**

---

## Architecture (High-Level)

```
User (Web/PWA)
   └── Next.js (Vercel)
         ├── ElevenLabs (Voice In/Out)
         ├── n8n (Business logic, orchestration)
         │     └── Groq LLM (Symptom understanding / routing)
         ├── Hospital APIs (Queue/EHR; FHIR/HL7-ready)
         └── NFC checkpoints (in-hospital navigation)
```

---

## n8n Workflow

- Import from: [medigo-n8n-workflow](https://github.com/alpha031117/medigo-n8n-workflow.git)  
- Configure credentials in n8n for:
  - ElevenLabs (API & Agent ID)  
  - Groq (API Key)  
  - Any Hospital/EHR/Queue API (FHIR/HL7 support)

---

## Setup

### 1. Prerequisites
- Node.js 18+ & npm  
- Running **n8n** instance  
- API credentials:
  - **ElevenLabs** (Agent ID)
  - **Groq**  
  - (Optional) Hospital API (Queue/EHR)

### 2. Environment Variables

```env
# Next.js
NEXT_PUBLIC_APP_NAME=Medigo
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_AGENT_ID=your_agent_id
GROQ_API_KEY=your_groq_api_key
N8N_BASE_URL=https://your-n8n-host
N8N_WEBHOOK_SECRET=change_me

# Optional: Hospital API Integrations
HOSPITAL_API_BASE=https://api.hospital.example
HOSPITAL_API_KEY=your_hospital_api_key
```

> **Tip:** Get the ElevenLabs **Agent ID** from your Agent settings in ElevenLabs.

### 3. Install & Run (Frontend)

```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 4. Setup & Run (n8n)

- Run your n8n instance
- Import the workflow from the repo above
- Add credentials:
  - ElevenLabs (API + Agent ID)  
  - Groq (API Key)  
  - Hospital/EHR API
- Expose webhook endpoints via proxy or n8n Cloud

---

## Deploy

- **Frontend** → Push to **Vercel** (set env vars)
- **n8n** → Self-host (Docker) or use n8n Cloud
- Add **HTTPS** & manage secrets securely
- (Optional) Attach database (e.g., PostgreSQL) for logs/sessions

---

## Scalability

- **Modular hospital onboarding** (layouts & queue systems)  
- **FHIR/HL7 adapters** for appointments & history  
- **Specialty-specific** symptom models  
- **Multilingual UI** (EN / MS / 中文 / தமிழ்)  
- **Region-specific** rollouts with config adjustments

---

## Judge-Friendly Snapshot

- **Innovation**: Combines symptom triage, NFC navigation, and **live queues** for end-to-end certainty  
- **Feasibility**: Built on solid tech — Next.js, ElevenLabs, n8n, Groq, Vercel  
- **Technical Merit**: LLM-powered routing, strong UX, PWA speed, API-first design  
- **User Benefit**: Clear guidance reduces anxiety and improves compliance  
- **Deployability**: PWA + n8n backend — pilot → hospital-wide → multi-site

---

## Roadmap

- Appointment booking & reminders (FHIR scheduling)  
- Indoor **turn-by-turn** navigation (BLE/UWB)  
- Data analytics (queue forecasting, UX metrics)  
- Accessibility improvements (large fonts, simplified flows)

---

## License

TBD — Choose your preferred license (e.g., MIT, Apache 2.0)

---

**Medigo**: Ensuring Auntie, Uncle, and everyone can visit the hospital with **ease and confidence**.
