const Hash = require("ipfs-only-hash");

export async function hash(data: string | Buffer) {
  return await Hash.of(data);
}
