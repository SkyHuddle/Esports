# Esports Games

Viral esports draft games — **Ring Chase** (CoD), **Golden Road** (LoL), and **Major Run** (CS2).

## Routes

| Path | Game |
|------|------|
| `/` | Hub — pick a game |
| `/ring-chase` | Ring Chase (CoD) |
| `/golden-road` | Golden Road (LoL) |
| `/major-run` | Major Run (CS2) |

## Development

```bash
cd app
npm install
npm run dev
```

## Build

```bash
cd app
npm run build
```

## Validation

```bash
cd app
npm run validate:ring-chase
npm run validate:major-run-hltv
```

## Major Run HLTV data

```bash
cd app
npm run etl:hltv          # offline reference + estimated ratings
npm run etl:hltv:live     # live HLTV scrape (run locally; may be blocked in CI)
```
