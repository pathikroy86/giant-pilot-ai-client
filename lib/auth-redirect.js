export function getSafeRedirectPath(redirect, fallback = "/dashboard") {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return fallback;
  }

  return redirect;
}

export function getRedirectFromBrowser(fallback = "/dashboard") {
  if (typeof window === "undefined") {
    return fallback;
  }

  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return getSafeRedirectPath(redirect, fallback);
}
