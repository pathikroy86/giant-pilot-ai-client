"use client";

export function saveBackendSession(data) {
  localStorage.setItem("grantpilot_user", JSON.stringify(data.user));
  localStorage.setItem("grantpilot_auth_token", data.token);
  window.dispatchEvent(new Event("grantpilot-auth-changed"));
}

export function clearBackendSession() {
  localStorage.removeItem("grantpilot_user");
  localStorage.removeItem("grantpilot_auth_token");
  window.dispatchEvent(new Event("grantpilot-auth-changed"));
}

export async function syncBackendSession() {
  const response = await fetch("/api/backend-session", {
    method: "POST",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not sync your session");
  }

  saveBackendSession(data);
  return data;
}

export async function getBackendAuthToken() {
  const savedToken = localStorage.getItem("grantpilot_auth_token");

  if (savedToken) {
    return savedToken;
  }

  const data = await syncBackendSession();
  return data.token;
}
