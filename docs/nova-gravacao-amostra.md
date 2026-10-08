# Nova gravação — amostra da linguagem de motion

Arquivo recebido: `4235A5DB-9A4B-4D25-BD26-7FE81A9905EF.mp4`, 287,166667s (4min47s), 512 × 910, 30 fps. A gravação anterior permanece intacta.

Copie o novo arquivo para `public/video/diego-korax-novo.mp4`, que é ignorado pelo git. A composição `KoraxReferenceSample` trabalha os primeiros 26s (780 frames), terminando antes da fala sobre o segundo problema. Não é a edição da gravação completa.

## Padrões implementados

- 0–7,2s: fundo claro, quadro vertical e cards de atendimento, vendas, orçamento e agenda entrando na fala.
- 7,2–9,22s: aproximação do protagonista e ênfase tipográfica.
- 9,22–16,82s: protagonista em círculo e fluxo de tráfego pago, indicações e marketing chegando ao WhatsApp.
- 16,82–19,22s: número 3, cards numerados e reposicionamento do círculo.
- 19,22–26s: mensagem ilustrativa, espera por resposta e interesse diminuindo; protagonista em janela horizontal.
- Transições por máscaras circulares; legendas em grupos curtos com palavra ativa destacada.

A tipografia base é Inter; uma serifada pontual é usada como contraste. A identidade permanece em azul-marinho, azul e branco. A mensagem de cliente é claramente identificada como exemplo ilustrativo, não conversa real ou tela funcional da plataforma.

O protagonista permanece filmado dentro de máscaras; esta amostra não inclui remoção do fundo/recorte ao redor do cabelo. Esse acabamento depende de avaliação específica da fonte. O arquivo de origem tem 512 × 910; o canvas 1080 × 1920 não recupera detalhe ausente.

`src/demo/newOpening.json` contém reconhecimento de fala da abertura com tempos de palavras; o conteúdo posterior a 26s ainda não é utilizado nem revisado para a edição completa.

## Reproduzir

`npm run typecheck`

`npx remotion render src/index.ts KoraxReferenceSample out/korax-amostra-motion-referencia-26s.mp4 --codec=h264 --crf=18 --concurrency=3`

As composições e os arquivos da demonstração anterior não foram substituídos. A continuação depende da validação visual da amostra de 26s.
