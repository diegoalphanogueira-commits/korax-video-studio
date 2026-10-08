# Korax — nova gravação completa

Composição: `KoraxNewComplete`. Origem: `4235A5DB-9A4B-4D25-BD26-7FE81A9905EF.mp4`, copiada sem alteração para `public/video/diego-korax-novo.mp4` (ignorado pelo git).

287,166667 segundos, 8615 frames, 30 fps. Canvas 1080 × 1920, conforme a prévia vertical aprovada. A origem tem 512 × 910: exportar em 1080p mantém os gráficos nítidos, mas não recupera detalhes ausentes no vídeo original.

## Direção aprovada

- Rosto sempre presente, inclusive durante as transições.
- Um único `OffthreadVideo` contínuo, sem opacidade animada ou troca de `object-fit`.
- Vídeo 512 × 910 escalado uniformemente; máscaras, posição e escala interpoladas.
- Círculos de 340–440px e quadro vertical de 640 × 1090px. Nenhuma janela horizontal pequena.
- Mudanças graduais do fundo; conteúdos se sobrepõem brevemente, sem wipe opaco sobre o apresentador.
- Textos curtos, Inter, contraste serifado pontual, azul-marinho, azul e branco.
- Telas reais existentes de conversas, CRM, follow-up e agenda; zooms são destaques visuais, não simulações de cliques ou funcionalidades.
- Mensagens e fluxos conceituais são identificados como ilustrativos.

## Montagem sincronizada com a gravação

| Tempo aproximado | Conteúdo |
| --- | --- |
| 0–26s | Abertura e primeiro problema, preservando a linguagem da prévia V2 |
| 26–43s | Falta de padronização e follow-up esquecido |
| 43–61s | Falta de processo, apresentação da Korax e WhatsApp conectado à operação |
| 61–94s | Funcionário digital, treinamento, coleta, qualificação e objetivos |
| 94–114s | Passagem para o atendente humano com contexto |
| 114–145s | Equipe, conversas, informações e CRM |
| 145–174s | Retornos, programação, memória e automação |
| 174–201s | Agenda e jornada completa do cliente |
| 201–211s | Acompanhamento pelo celular, tablet e notebook |
| 211–252s | Diagnóstico, estruturação, treinamento e implantação acompanhada |
| 252–263s | Transformação do WhatsApp em operação comercial |
| 263–287s | Convite para agendar demonstração e falar com a equipe |

`src/demo/newFullCaptions.json` registra as legendas com tempos de palavras posteriores à abertura. O reconhecimento foi corrigido em termos de marca, padronização, próxima ação e CTA. A gravação recebida governa a montagem; não foi substituída pela versão antiga do texto compartilhado.

## Reproduzir

```sh
npm run typecheck
npx remotion render src/index.ts KoraxNewComplete out/korax-completo-render.mp4 --codec=h264 --crf=18 --concurrency=4 --muted
ffmpeg -i out/korax-completo-render.mp4 -i public/video/diego-korax-novo.mp4 -map 0:v:0 -map 1:a:0 -c copy -movflags +faststart out/korax-completo-1080p.mp4
```

O áudio final é copiado do original sem nova compressão. O vídeo original e as composições anteriores permanecem intactos.

## Revisão de áudio — efeitos de movimento

A versão com efeitos usa 159 cues sincronizados a 30 fps: swishes nas transições e mudanças de enquadramento, pops nos cards, cliques nos destaques e acentos suaves nas entradas principais e no CTA. Não há efeito para cada palavra da legenda.

Os seis efeitos em `public/sfx` são sons originais sintetizados pelo script `scripts/create-motion-sounds.py`; nenhum áudio foi extraído da referência. `motionSoundCues.json` governa tanto o componente `MotionSoundEffects` quanto a mixagem final. `prepare-motion-cues.cjs` regenera o mapa a partir dos tempos da montagem.

Na entrega com efeitos, a fala original é decodificada e somada aos efeitos; os efeitos recuam automaticamente durante a fala. Um limitador com compensação de latência segura os picos. O áudio é exportado em AAC a 256 kbps. Os pacotes de vídeo são copiados e verificados como idênticos: não há nova compressão da imagem.

```sh
python3 scripts/create-motion-sounds.py
node scripts/prepare-motion-cues.cjs
python3 scripts/mix-motion-sounds.py out/korax-completo-1080p.mp4 out/korax-completo-com-efeitos-1080p.mp4 --work-dir out/audio-work
```

A entrada da mixagem deve ser a versão com fala original e sem efeitos; não remixar uma exportação já sonorizada. A prévia visual aprovada permanece igual.

## Trilha instrumental original

`scripts/create-korax-score.py` compõe uma trilha original de 287,166667s a 96 BPM: pads suaves, acordes estendidos, arpejos discretos e percussão leve. Não há vocais nem amostras de músicas existentes. A composição varia a textura entre os blocos, recua na implantação e cresce discretamente no CTA; entrada e encerramento têm fades.

A geração é determinística. O MP3 em `public/music/korax-trilha-original.mp3` é um asset de build ignorado pelo git: gere-o antes de abrir ou renderizar a composição. O código da composição e a automação de volume em `musicGain.json` estão versionados. A entrega final usa o WAV original para evitar uma etapa de compressão intermediária na trilha.

```sh
python3 scripts/create-korax-score.py --work-dir out/music-work
python3 scripts/mix-motion-sounds.py out/korax-completo-1080p.mp4 out/korax-completo-trilha-e-efeitos-1080p.mp4 --work-dir out/music-work --music out/music-work/korax-original-score.wav
```

A mixagem parte da fala original, reaplica os efeitos uma única vez e soma a trilha com volume automático governado pela voz. O convite final recebe uma subida de 12% na música. A imagem segue copiada sem recompressão e com comparação dos hashes dos pacotes de vídeo.

### Revisão — bateria leve e progressiva

Mantida a abertura suave. A bateria começa aos 10s e cresce gradualmente até 30s: bumbo macio, caixa escovada, marcação curta e shaker com leve swing. O pulso fica mais definido no restante do vídeo, com pequenas variações e redução no encerramento. Os acordes recuam um pouco na entrada da bateria, dando espaço ao ritmo. Mantidos 96 BPM, automação sob a voz, effects e vídeo sem recompressão.
