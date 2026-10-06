# Korax Video Studio

Projeto de motion design da Korax construído com **Remotion + React + TypeScript**.

O objetivo deste repositório é gerar anúncios verticais em vídeo por código, com animações quadro a quadro e renderização automática em MP4 via GitHub Actions.

## Primeiro vídeo

- Composição: `KoraxAd`
- Formato: 1080 × 1920 (9:16)
- FPS: 30
- Duração atual: 27,5 segundos
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

## Demonstração com a gravação do Diego

A composição adicional `KoraxDemo` preserva vídeo e áudio originais. É habilitada apenas depois de receber o arquivo e executar a preparação; não usa telas fictícias nem legendas estimadas.

1. Disponibilize o original em `public/video/diego-korax-original.mp4`. Vídeos grandes não precisam ser commitados: podem ser entregues por upload ou link de download acessível. O repositório é público; um arquivo commitado será público.
2. Execute `npm run prepare:demo` (requer FFmpeg/ffprobe).
3. Execute `npm run studio` e selecione `KoraxDemo`.
4. Adicione telas reais em `public/telas`, logo em `public/logos` e referências em `public/referencias`.
5. Após implementar e revisar a edição, execute `npm run render:demo`. Resultado: `out/korax-demo-final.mp4`.

A preparação identifica duração, FPS, resolução e orientação. A composição começa na proporção original, até definirmos a resolução de entrega a partir da gravação. O comando não sobrescreve o original.

Validação do código: `npm run typecheck`. A composição e o workflow anteriores continuam disponíveis. O workflow existente renderiza apenas `KoraxAd`; a nova demonstração é renderizada pelo comando específico acima.

Direção visual da demonstração: azul-marinho `#010B36`, azul `#0057FF`, fonte Inter, motion clean e telas reais. O próximo passo é analisar a fala efetivamente gravada e criar o mapa da edição, antes de sincronizar legendas e inserir telas.
