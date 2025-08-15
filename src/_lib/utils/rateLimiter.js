// utils/rateLimiter.js
const rateLimitMap = new Map();

export function rateLimit(ip, limit = 5, interval = 10 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

  if (now - record.lastRequest > interval) {
    rateLimitMap.set(ip, { count: 1, lastRequest: now });
    return { allowed: true };
  }

  record.count += 1;
  record.lastRequest = now;

  if (record.count > limit) {
    return { allowed: false, retryAfter: interval - (now - record.lastRequest) };
  }

  rateLimitMap.set(ip, record);
  return { allowed: true };
}
