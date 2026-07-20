const DEFAULT_API_URL = "http://localhost:8008";

export function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  return baseUrl.replace(/\/$/, "");
}
