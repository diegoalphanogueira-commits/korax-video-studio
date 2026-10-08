# Demonstração KORAX — versão completa V3

A edição segue a gravação de Diego Nogueira: 165,733 segundos, 4972 frames a 30 fps. Exportação vertical 1080 × 1920, H.264 CRF 18. O áudio acompanha a gravação inteira, sem cortes ou voz sintética. A fonte do apresentador é 512 × 910; a exportação maior melhora a nitidez das composições e textos, mas não recupera detalhes ausentes no vídeo recebido.

## Imagens recebidas

As cinco imagens originais, todas 1448 × 1086, estão em `public/telas`: `conversas.webp`, `crm.webp`, `follow-up.webp`, `agenda.webp` e `respostas-rapidas.webp`. São imagens do produto montadas em mockups de notebook, com alguns cartões sobrepostos. Os arquivos foram copiados sem recompressão.

Os enquadramentos começam pela visão geral e avançam para responsáveis, histórico, etapas do CRM, indicadores, próximas ações e agenda. Os destaques azuis são elementos editoriais. Não representam cliques, movimentações de cards ou novas alterações da interface.

## Mapa implementado

| Tempo | Fala / tema | Tratamento visual |
| --- | --- | --- |
| 00:00–00:18 | WhatsApp, Diego e posicionamento | Abertura V2, palavras animadas, quadros do apresentador e marca |
| 00:18–00:28 | Equipe, transferência e histórico | Conversas; aproximações no responsável, botão e histórico |
| 00:28–00:37 | Negociação e visão do gestor | CRM; etapas e indicadores |
| 00:37–00:45 | Follow-up | Calendário e lista de próximos retornos |
| 00:45–00:54 | Agenda | Disponibilidade, formulário e cartão de confirmação |
| 00:54–01:14 | IA e treinamento | Fluxo gráfico: conhecimento, jornada e atendimento |
| 01:14–01:20 | Disponibilidade e agendamento | Imagem da agenda com destaque editorial |
| 01:20–01:30 | Atendente certo e contexto | Imagem de conversas; responsável e histórico |
| 01:30–01:40 | IA dentro da operação | Cards animados: entender, agendar, acionar a equipe |
| 01:40–01:50 | Gestão da operação | Conversas, CRM e follow-up sincronizados com a fala |
| 01:50–02:03 | Notebook, tablet e celular | Ilustrações de dispositivos com a marca |
| 02:03–02:19 | Estrutura e recursos | Cards e montagem das cinco imagens recebidas |
| 02:19–02:29 | Uso na operação | CRM e respostas rápidas |
| 02:29–02:46 | Posicionamento e convite | Diego em destaque, tipografia e chamada final |

A IA é representada por uma jornada gráfica. Não há uma gravação de execução da IA entre os arquivos recebidos. Os dispositivos mostram a marca, sem simular telas responsivas do sistema. A edição não acrescenta cases, contatos ou resultados além do material do usuário.

## Reproduzir

1. Copie a gravação para `public/video/diego-korax-original.mp4`.
2. Execute `npm ci` e `npm run typecheck`.
3. Abra `npm run studio` e selecione `KoraxDemoComplete`.
4. `npm run render:complete` exporta a gravação inteira em 1080p.
5. `npm run render:complete:preview` exporta os primeiros 54,5 segundos em 1080p.

A composição `KoraxDemoMotion` permanece como amostra da abertura de 17,733s; `KoraxDemoStyle` e `KoraxAd` continuam disponíveis. O vídeo bruto e as exportações são ignorados pelo git.

A conferência inclui TypeScript, inspeção visual de frames por seção, dimensões, duração e sincronização do áudio. O ajuste temporário de interfaces de rede necessário neste ambiente fica fora do repositório.
