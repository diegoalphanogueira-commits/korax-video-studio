import {execFileSync} from 'node:child_process';
import {existsSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicRoot = path.join(root, 'public');
const source = process.argv[2] || 'video/diego-korax-original.mp4';
const filename = path.resolve(publicRoot, source);
const relative = path.relative(publicRoot, filename);
if (relative.startsWith('..') || path.isAbsolute(relative)) {
  throw new Error('O vídeo deve estar dentro da pasta public.');
}
if (!existsSync(filename)) {
  console.error(`Vídeo não encontrado: ${filename}\nAdicione o original e execute novamente.`);
  process.exit(1);
}
let media;
try {
  media = JSON.parse(execFileSync('ffprobe', [
    '-v', 'error', '-show_streams', '-show_format', '-of', 'json', filename,
  ], {encoding: 'utf8'}));
} catch {
  console.error('Não foi possível analisar o vídeo. Verifique o arquivo e a instalação do FFmpeg/ffprobe.');
  process.exit(1);
}
const stream = media.streams.find((item) => item.codec_type === 'video');
if (!stream) throw new Error('O arquivo não contém vídeo.');
const [num, den] = (stream.avg_frame_rate || '0/0').split('/').map(Number);
const fps = num / den;
const duration = Number(stream.duration || media.format.duration);
if (!Number.isFinite(fps) || fps <= 0 || !Number.isFinite(duration) || duration <= 0) {
  throw new Error('Duração ou FPS inválido.');
}
const rotation = Number(stream.side_data_list?.find((item) => item.rotation != null)?.rotation ?? stream.tags?.rotate ?? 0);
const rotated = Math.abs(rotation) % 180 === 90;
const video = {
  src: relative.split(path.sep).join('/'),
  durationInFrames: Math.ceil(duration * fps),
  durationInSeconds: duration,
  fps,
  width: rotated ? stream.height : stream.width,
  height: rotated ? stream.width : stream.height,
};
writeFileSync(path.join(root, 'src/demo/video.json'), JSON.stringify(video, null, 2) + '\n');
console.log('KoraxDemo configurada sem alterar o vídeo original:', video);
