# Korax Video Studio

Projeto de motion design da Korax construído com **Remotion + React + TypeScript**.

O objetivo deste repositório é gerar anúncios verticais em vídeo por código, com animações quadro a quadro e renderização automática em MP4 via GitHub Actions.

## Primeiro vídeo

- Composição: `KoraxAd`
- Formato: 1080 × 1920 (9:16)
- FPS: 30
- Duração: 15 segundos
- Estilo: premium tech / azul-marinho / neon azul

## Rodar localmente

```bash
npm install
npm run studio
```

## Renderizar MP4

```bash
npm run render
```

O arquivo final será criado em `out/korax-ad.mp4`.

## Render automático

Cada push em `main` que altera o vídeo dispara o workflow **Render Korax Video**. O MP4 fica disponível como artifact da execução do GitHub Actions.
