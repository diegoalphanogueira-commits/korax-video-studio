# Demonstração KORAX — mapa da gravação recebida

Arquivo recebido: 165,733 segundos (2min45,7s), vertical 512 × 910, 30 fps, áudio AAC estéreo. O arquivo original foi copiado sem alteração; hashes SHA-256 são iguais. A resolução recebida limita o detalhe da imagem do apresentador. Para o master, uma cópia em 1080p será útil; as telas do sistema devem ser capturadas em alta resolução.

A gravação é a referência da edição. O roteiro escrito contém trechos que foram removidos no corte, portanto não deve ser usado para inventar legendas ou cenas.

## Prévia atual com motion design

`KoraxDemoMotion` aplica a identidade visual e Inter local, com mudanças de composição, palavras entrando por máscara, apresentador em quadros animados com perspectiva, apresentação lateral, revelação da marca e transformação gráfica de WhatsApp em operação comercial. As legendas e os movimentos seguem os tempos da gravação. `KoraxDemoStyle` permanece disponível como alternativa simples. A prévia contém 532 frames (17,733s), encerrando depois de “acompanhável e inteligente”. O áudio é o da gravação. O projeto usa canvas 1080 × 1920; a prévia é exportada em 540 × 960 para revisão.

Esta etapa valida o estilo da abertura. Ainda não contém as telas reais da KORAX nem a edição visual completa dos demais trechos. As legendas foram geradas por reconhecimento de fala e receberam correções dos principais termos; revisar auditivamente a versão completa antes de publicação.

## Mapa da edição

Intervalos aproximados, derivados da fala gravada.

| Tempo | Conteúdo gravado | Visual planejado | Asset necessário |
|---|---|---|---|
| 00:00–00:08 | WhatsApp, atendimento, vendas e organização | Diego em tela, palavras curtas e legendas | Gravação original |
| 00:08–00:10 | Diego Nogueira, fundador da KORAX | Identificação discreta | Logo oficial |
| 00:10–00:18 | WhatsApp como operação comercial | Diego + destaque de posicionamento | Gravação original |
| 00:18–00:22 | Usuários e setores | Tela de conversas e zoom no responsável/setor | 01-conversas-setores.png |
| 00:22–00:28 | Transferência com histórico | Gravação de transferência, Diego menor | 02-transferencia.mp4 |
| 00:28–00:37 | Etapa da negociação e visão do gestor | CRM, close nas etapas | 03-crm.png ou gravação |
| 00:37–00:45 | Programar follow-ups e próximas ações | Abrir programação do follow-up | 04-followup.mp4 |
| 00:45–00:54 | Reunião, consulta, visita e agenda | Agenda e disponibilidade em foco | 05-agenda.png ou gravação |
| 00:54–01:05 | IA além de respostas automáticas | Diego + conversa real com a IA | 06-ia-conversa.mp4 |
| 01:05–01:14 | Treinamento e jornada comercial | Tela real de treinamento, recortes legíveis | 07-treinamento-ia.png |
| 01:14–01:20 | Agendamento automático | Conversa seguida da agenda | 08-ia-agendamento.mp4 |
| 01:20–01:30 | Chamar atendente e entregar contexto | Transferência e histórico visível | 09-ia-humano.mp4 |
| 01:30–01:40 | IA treinável dentro da operação | Retomar Diego e resumir o fluxo já demonstrado | Assets anteriores |
| 01:40–01:50 | Atendentes, negociações e próxima ação | Conversas/CRM com responsável e ações | 01 + 03 + 04 |
| 01:50–02:03 | Notebook, tablet e celular | Dispositivos com capturas reais em cada proporção | 10-desktop.png, 11-tablet.png, 12-celular.png |
| 02:03–02:19 | Estrutura e resumo dos recursos | Montagem curta de telas já apresentadas | Assets anteriores |
| 02:19–02:29 | Operações reais | Produto real; cases só se houver material autorizado | Tela real ou case autorizado |
| 02:29–02:39 | WhatsApp além de aplicativo de mensagens | Diego volta à tela, marca discreta | Gravação original |
| 02:39–02:46 | Falar com Diego e ver na prática | Diego + encerramento curto sem ampliar a duração | Logo oficial |

## Capturar as telas

Use dados de demonstração. Não é preciso capturar tudo de uma vez: priorize conversas/setores, transferência e CRM para editar o próximo bloco de 00:18 a 00:37. Gravações curtas de 5–12s com cliques claros funcionam melhor para transferências, follow-up e agendamento.

Mantenha capturas desktop no formato original em alta resolução. Para o trecho de dispositivos, forneça capturas responsivas reais para celular e tablet, evitando simular uma tela desktop espremida em cada dispositivo.

## Como reproduzir

Adicione o original em `public/video/diego-korax-original.mp4`, execute `npm ci` e `npm run studio`. Se o vídeo for substituído por outra exportação, execute `npm run prepare:demo` e revise a sincronização das legendas. Não faça commit do MP4 bruto no repositório público.

`npm run render:motion:preview` gera a prévia atual em `out/korax-demo-motion-preview.mp4`. O teste neste chat precisou de um ajuste temporário da detecção de interfaces de rede, específico do ambiente; esse ajuste não faz parte do projeto.
