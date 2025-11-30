const requiredEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

function assertEnv<T extends Record<string, string | undefined>>(vars: T): {
  [K in keyof T]: string;
} {
  const missing = Object.entries(vars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing environment variables: ${missing.join(", ")}. Create a .env.local file based on .env.example.`
    );
  }

  return vars as { [K in keyof T]: string };
}

export const env = assertEnv(requiredEnv);
