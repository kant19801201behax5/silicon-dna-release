
import { parentPort } from 'node:worker_threads';
import { createHash } from 'node:crypto';

function microWorkload(rounds = 1000) {
  let buf = Buffer.alloc(32, 0);
  for (let i = 0; i < rounds; i++) {
    buf = createHash('sha256').update(buf).digest();
  }
  return buf.readUInt32LE(0);
}

let workloadSink = 0;

function startProbe() {
  const integrityCheck = () => {
    const source = startProbe.toString();
    if (source.length < 300 || !source.includes('hrtime')) {
        parentPort?.postMessage({ type: 'INTEGRITY_FAIL' });
    }
  };

  setInterval(() => {
    integrityCheck();
    const samples = 100;
    const deltas = [];

    for (let i = 0; i < samples; i++) {
      const start = process.hrtime.bigint();
      workloadSink = microWorkload();
      const end = process.hrtime.bigint();
      const delta = Number(end - start);
      deltas.push(delta);
    }

    if (parentPort) {
      parentPort.postMessage({ type: 'JITTER_DATA', deltas, sink: workloadSink });
    }
  }, 200);
}

startProbe();
