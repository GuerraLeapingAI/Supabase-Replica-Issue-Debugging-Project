declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_LEAPING_BACKEND_URL: string;
      NEXT_PUBLIC_LEAPING_VOICE_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_URL_REPLICA: string;

      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

export {};
