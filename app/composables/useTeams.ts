interface TeamWithTournament {
  id: number;
  name: string;
  tournamentId: number;
  userId?: number | null;
  user?: { id: number; name: string | null; email: string } | null;
  tournament: {
    id: number;
    name: string;
  };
}

export function useTeams() {
  const teams = useState<TeamWithTournament[]>("teams", () => []);
  const loading = useState<boolean>("teams-loading", () => false);
  const error = useState<string | null>("teams-error", () => null);

  async function fetchTeams(tournamentId?: number) {
    loading.value = true;
    error.value = null;

    try {
      teams.value = await $fetch<TeamWithTournament[]>("/api/teams", {
        query: tournamentId ? { tournamentId } : undefined,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load teams";
    } finally {
      loading.value = false;
    }
  }

  async function createTeam(payload: { name: string; tournamentId: number }) {
    await $fetch("/api/teams", {
      method: "POST",
      body: payload,
    });

    await fetchTeams();
  }

  async function deleteTeam(id: number) {
    await $fetch(`/api/teams/${id}`, {
      method: "DELETE",
    });

    await fetchTeams();
  }

  return {
    teams,
    loading,
    error,
    fetchTeams,
    createTeam,
    deleteTeam,
  };
}
