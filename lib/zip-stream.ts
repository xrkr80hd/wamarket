const table = Array.from({ length: 256 }, (_, i) => {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
export function crcUpdate(crc: number, bytes: Uint8Array) {
  for (const b of bytes) crc = table[(crc ^ b) & 255] ^ (crc >>> 8);
  return crc >>> 0;
}
function block(size: number) {
  const b = new Uint8Array(size);
  return { b, v: new DataView(b.buffer) };
}
export async function* zipChunks(
  entries: {
    name: string;
    body:
      | ReadableStream<Uint8Array>
      | (() => Promise<ReadableStream<Uint8Array>>);
  }[],
) {
  let offset = 0;
  const central: Uint8Array[] = [];
  for (const entry of entries) {
    const name = new TextEncoder().encode(entry.name);
    const start = offset;
    const h = block(30 + name.length);
    h.v.setUint32(0, 0x04034b50, true);
    h.v.setUint16(4, 20, true);
    h.v.setUint16(6, 0x808, true);
    h.v.setUint16(12, 33, true);
    h.v.setUint16(26, name.length, true);
    h.b.set(name, 30);
    yield h.b;
    offset += h.b.length;
    let crc = 0xffffffff,
      size = 0;
    const body =
      typeof entry.body === "function" ? await entry.body() : entry.body;
    const reader = body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        crc = crcUpdate(crc, value);
        size += value.length;
        offset += value.length;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    const d = block(16);
    d.v.setUint32(0, 0x08074b50, true);
    d.v.setUint32(4, crc, true);
    d.v.setUint32(8, size, true);
    d.v.setUint32(12, size, true);
    yield d.b;
    offset += 16;
    const c = block(46 + name.length);
    c.v.setUint32(0, 0x02014b50, true);
    c.v.setUint16(4, 20, true);
    c.v.setUint16(6, 20, true);
    c.v.setUint16(8, 0x808, true);
    c.v.setUint16(14, 33, true);
    c.v.setUint32(16, crc, true);
    c.v.setUint32(20, size, true);
    c.v.setUint32(24, size, true);
    c.v.setUint16(28, name.length, true);
    c.v.setUint32(42, start, true);
    c.b.set(name, 46);
    central.push(c.b);
  }
  const centralStart = offset;
  for (const c of central) {
    yield c;
    offset += c.length;
  }
  const end = block(22);
  end.v.setUint32(0, 0x06054b50, true);
  end.v.setUint16(8, entries.length, true);
  end.v.setUint16(10, entries.length, true);
  end.v.setUint32(12, offset - centralStart, true);
  end.v.setUint32(16, centralStart, true);
  yield end.b;
}
export function zipStream(
  entries: {
    name: string;
    body:
      | ReadableStream<Uint8Array>
      | (() => Promise<ReadableStream<Uint8Array>>);
  }[],
) {
  const iterator = zipChunks(entries);
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const r = await iterator.next();
        if (r.done) controller.close();
        else controller.enqueue(r.value);
      } catch (e) {
        controller.error(e);
      }
    },
    async cancel() {
      await iterator.return(undefined);
    },
  });
}
