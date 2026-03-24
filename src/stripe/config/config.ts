let runtimeConfig: { stripePublicKey: string } | null = null;

const API_BASE = import.meta.env.VITE_API_URL || "";

export async function getConfig() {
  if (runtimeConfig) return runtimeConfig;

  const res =  await fetch(`${API_BASE}/config`);
  runtimeConfig = await res.json();

  return runtimeConfig;
}