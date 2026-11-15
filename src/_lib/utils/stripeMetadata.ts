// Stripe metadata values are capped at 500 characters (and 50 keys). A cart
// serialized as JSON passes that after a few items, and Checkout then fails.
// These helpers split a JSON value over numbered keys: cart_0, cart_1, ...

const CHUNK = 490;

export function packMetadata(prefix: string, value: unknown) {
  const json = JSON.stringify(value);
  const result: Record<string, string> = {};
  for (let i = 0; i * CHUNK < json.length; i++) {
    result[`${prefix}_${i}`] = json.slice(i * CHUNK, (i + 1) * CHUNK);
  }
  return result;
}

// Also reads the old single-key format (`legacyKey`) so sessions created before
// this change are still fulfilled.
export function unpackMetadata<T>(
  metadata: Record<string, string> | null | undefined,
  prefix: string,
  legacyKey?: string,
): T | null {
  if (!metadata) return null;

  let json = "";
  for (let i = 0; metadata[`${prefix}_${i}`] !== undefined; i++) {
    json += metadata[`${prefix}_${i}`];
  }
  if (!json && legacyKey) json = metadata[legacyKey] ?? "";
  if (!json) return null;

  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// What we store per cart line: just enough to rebuild the order from the DB.
export type OrderLine = { id: number; size?: string; quantity: number };

// Accepts both the compact shape and the old cart snapshot ({ selectedSize }).
export function toOrderLines(items: unknown): OrderLine[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((raw) => {
    if (typeof raw !== "object" || raw === null) return [];
    const item = raw as Record<string, unknown>;
    const id = Number(item.id);
    const quantity = Math.max(1, Math.floor(Number(item.quantity ?? 1)));
    const size = item.size ?? item.selectedSize;
    if (!Number.isInteger(id) || id <= 0 || !Number.isFinite(quantity)) {
      return [];
    }
    return [
      {
        id,
        quantity,
        ...(typeof size === "string" && size ? { size } : {}),
      },
    ];
  });
}
