// supabase.ts
import { Database } from "./supabaseGeneratedTypes";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseUrlReplica = process.env.NEXT_PUBLIC_SUPABASE_URL_REPLICA!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensures session persistence
    autoRefreshToken: true, // Automatically refreshes tokens
    detectSessionInUrl: true, // Handles OAuth redirects
  },
});

export const supabaseClientReplica = createClient<Database>(supabaseUrlReplica, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

function handleSupabaseError(error: any, context: string) {
  console.error(`${context} Error:`, error.message || error);
}

export const SupabaseService = {
  async login(email: string, password: string) {
    const { data: session, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      handleSupabaseError(error, "Login");
      return;
    }
    console.log("Session:", session);
    return session;
  },

  async fetchDataFromMain() {
    const { data, error } = await supabaseClient.from("staged_calls").select("id, status");
    if (error) handleSupabaseError(error, "Fetch Main Data");
    return data || [];
  },

  async fetchDataFromReplica() {
    const { data, error } = await supabaseClientReplica.from("staged_calls").select("id, status");
    if (error) handleSupabaseError(error, "Fetch Replica Data");
    return data || [];
  },

  async fetchViewFromMain() {
    const { data, error } = await supabaseClient.from("calls_combined").select("id, status, created_at");
    if (error) handleSupabaseError(error, "Fetch Main View Data");
    return data || [];
  },

  async fetchViewFromReplica() {
    const { data, error } = await supabaseClientReplica.from("calls_combined").select("id, status, created_at");
    if (error) handleSupabaseError(error, "Fetch Replica View Data");
    return data || [];
  },

  async refreshSession() {
    const { data, error } = await supabaseClient.auth.refreshSession();
    if (error) {
      handleSupabaseError(error, "Refresh Session");
    } else {
      console.log("Session refreshed successfully:", data);
    }
    return data;
  },

  async logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      handleSupabaseError(error, "Logout");
    } else {
      console.log("Logged out successfully.");
    }
  },

  async fetchAllStagedCallIds(agentId: string, status: string): Promise<string[]> {
    const { data: allCalls, error } = await supabaseClientReplica
      .from("staged_calls")
      .select("id, agent_snapshots!inner(agent_id)")
      .eq("agent_snapshots.agent_id", agentId)
      .eq("status", status);

    if (error) {
      handleSupabaseError(error, "Fetch All Staged Call IDs");
      return [];
    }

    return allCalls?.map((call: any) => call.id) || [];
  },

  async getFilteredCalls(
    agentId: string,
    dateRange: { from: Date; to: Date } | undefined,
    snapshotIds: string[] | null = null,
    resultsFilter: { name: string; type: string; value: any; operator: string }[] | null = null
  ) {
    if (!agentId || agentId.trim() === "") {
      throw new Error("Agent ID is required and cannot be empty.");
    }

    const query = supabaseClientReplica
      .from("calls_combined")
      .select("status, created_at, leaping_duration_seconds, results")
      .eq("agent_id", agentId);

    if (dateRange) {
      query.gte("created_at", dateRange.from.toISOString()).lte("created_at", dateRange.to.toISOString());
    }

    if (snapshotIds) {
      query.in("agent_snapshot_id", snapshotIds);
    }

    if (resultsFilter) {
      resultsFilter.forEach(({ name, type, value, operator }) => {
        if (type) {
          query.eq(`results->${name}->>type`, type);
        }
        switch (operator) {
          case "is null":
            query.is(`results->${name}->>value`, null);
            break;
          case "is not null":
            query.not(`results->${name}->>value`, "is", null);
            break;
          case "=":
            query.eq(`results->${name}->>value`, value);
            break;
          case "!=":
            query.neq(`results->${name}->>value`, value);
            break;
          case ">":
            query.gt(`results->${name}->>value`, value);
            break;
          case "<":
            query.lt(`results->${name}->>value`, value);
            break;
          case ">=":
            query.gte(`results->${name}->>value`, value);
            break;
          case "<=":
            query.lte(`results->${name}->>value`, value);
            break;
          default:
            query.eq(`results->${name}->>value`, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) {
      handleSupabaseError(error, "Get Filtered Calls");
    }

    return data || [];
  },
};