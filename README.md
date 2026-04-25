# Jotform Frontend Challenge Project

## User Information
Please fill in your information after forking this repository:

- **Name**: Begüm Bakan

## Project Description

**Operation: Find Podo** is a detective-themed web app built to help solve the mystery of JotForm's missing mascot, Podo. The site aggregates live data from five JotForm forms — sightings, anonymous tips, messages, field check-ins, and personal notes — and presents them as an active investigation case.

### Features

- **Case Board** — tabbed view of all form submissions organised by category, displayed as pinned clue cards in a detective noir style
- **Evidence Wall** — a unified corkboard view of every clue from all five forms at once, filterable by type, by person, and by free-text search
- **Sightings Map** — an interactive Leaflet map showing GPS-tagged locations from sightings, check-ins, and anonymous tips, with type-aware popups (reported by, agent, about, seen with, status)
- **Client-side data cleaning** — known name typos (e.g. Ayca → Ayça, Alicann → Alican) are corrected on display, junk submissions are filtered out, and raw JotForm field identifiers are prettified into readable labels

### Tech Stack

- React 19 + Vite
- React Router v7 (two routes: `/` home, `/evidence` wall)
- JotForm JS SDK (`jotform` npm package) for API access
- React Leaflet + Leaflet for the map
- Plain CSS with CSS custom properties (no component library)

## Getting Started
1. Clone the repository and install dependencies:
   `npm install`

2. Copy the environment variable template:
    `cp .env.example .env`

3. Open `.env` and fill in your JotForm API key:
    `VITE_API_KEY_CHECKINS=your_key_here`
    `VITE_API_KEY_MESSAGES=your_key_here`
    `VITE_API_KEY_SIGHTINGS=your_key_here`
    `VITE_API_KEY_PERSONAL_NOTES=your_key_here`
    `VITE_API_KEY_ANONYMOUS_TIPS=your_key_here`

4. Start the development server:
    `npm run dev`


# 🚀 Challenge Duyurusu

## 📅 Tarih ve Saat
Cumartesi günü başlama saatinden itibaren üç saattir.

## 🎯 Challenge Konsepti
Bu challenge'da, size özel hazırlanmış bir senaryo üzerine web uygulaması geliştirmeniz istenecektir. Challenge başlangıcında senaryo detayları paylaşılacaktır.Katılımcılar, verilen GitHub reposunu fork ederek kendi geliştirme ortamlarını oluşturacaklardır.

## 📦 GitHub Reposu
Challenge için kullanılacak repo: https://github.com/cemjotform/2026-frontend-challenge-izmir

## 🛠️ Hazırlık Süreci
1. GitHub reposunu fork edin
2. Tercih ettiğiniz framework ile geliştirme ortamınızı hazırlayın
3. Hazırladığınız setup'ı fork ettiğiniz repoya gönderin

## 💡 Önemli Notlar
- Katılımcılar kendi tercih ettikleri framework'leri kullanabilirler
