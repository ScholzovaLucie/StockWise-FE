# 🖥️ StockWise – Frontend

Frontend pro moderní skladovou aplikaci **StockWise**. Vytvořen pomocí **Next.js 15**, **React 19** a **Material UI 6**. Připojen k Django backendu přes REST API a zabezpečený pomocí `access_token` v cookies.

## 🚀 Technologie

- **Next.js 15**
- **React 19**
- **Material UI (MUI v6)** – komponenty, layout, datová mřížka
- **Axios** – HTTP komunikace
- **Chart.js + react-chartjs-2** – grafy
- **Framer Motion** – animace
- **Jest + Testing Library** – testy
- **Docker** – vývoj a nasazení
- **OpenAI integrace** – přehledy a chatbot

## ▶️ Spuštění (lokálně)

```bash
npm install
npm run build
npm run dev
```

- Běží na **http://localhost:3000**
- Komunikuje s backendem na **http://localhost:8000**
- Pokud backen běží na docker je potřeba do middlewear upravit adresu na **http://stockwise-backend:8000/api/auth/me/**

```bash
docker build -t stockwise-frontend .
docker run -p 3000:3000 stockwise-frontend
```

## ⚙️ Middleware ochrana rout

Cesty vyžadující přihlášení jsou chráněny v middleware.js. Pokud chybí access_token cookie nebo je neplatný, uživatel je přesměrován na /auth/login.

Whitelistované cesty (bez ověření):

- /auth/login, /auth/forgot-password, /auth/reset-password, /auth/registr

## 🔐 Autentizace

- access_token se ukládá do HttpOnly cookie

## 🧪 Testování

```bash
npm run test
```

## 🧪 Testovací přihlášení
- email: admin@admin.cz
- heslo: Heslo1+
