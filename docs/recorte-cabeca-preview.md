# Prévia de cabeça fora do cartão

Composição `KoraxHeadBreakoutPreview`: primeiros 6 segundos da nova gravação,
1080 × 1920, 30 fps. Corpo e cenário original dentro do cartão arredondado;
cabeça e cabelo ultrapassam somente a borda superior. As duas camadas usam
o mesmo tempo e a mesma escala uniforme, preservando proporções e continuidade.

O alfa foi acompanhado ao longo de um trecho de 8,066 segundos. A primeira
tentativa de isolamento retornou um alfa totalmente opaco e foi descartada.
O segundo recorte contém transparência real. Os pixels visíveis vêm da gravação
original, usando apenas o alfa do recorte; pequenos furos internos no cabelo
são fechados sem expandir o contorno externo.

Quando o rastreador perde cabelo na virada de cabeça, o preparo recupera a
região escura conectada do cabelo na parte superior da gravação, limitada à
faixa acima do cartão. Essa correção é específica deste fundo claro.

Materialize a gravação original e o recorte `diego-recorte-alpha-8s.webm`.
Prepare os frames com:

```sh
python3 scripts/prepare-head-cutout.py public/video/diego-korax-novo.mp4 public/video/diego-recorte-alpha-8s.webm
npx remotion render src/index.ts KoraxHeadBreakoutPreview out/recorte-preview-muted.mp4 --codec=h264 --crf=18 --concurrency=3
```

Dependências auxiliares: FFmpeg com libvpx-vp9, Pillow, NumPy e SciPy.
O export de revisão recebe os primeiros 6 segundos do áudio da versão completa
aprovada, com cópia da faixa AAC. A versão completa não foi substituída por esta
prévia. O alfa é um asset externo, tal como a gravação original.
