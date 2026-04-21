import type { StandingEntry, TournamentDTO } from "../../shared/types";

interface TournamentPayload {
  name: string;
  date: string;
  description?: string;
  teams?: string[];
}

export function useTournaments() {
  const tournaments = useState<TournamentDTO[]>("tournaments", () => []);
  const loading = useState<boolean>("tournaments-loading", () => false);
  const error = useState<string | null>("tournaments-error", () => null);

  async function fetchTournaments() {
    loading.value = true;
    error.value = null;

    try {
      tournaments.value = await $fetch<TournamentDTO[]>("/api/tournaments");
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load tournaments";
    } finally {
      loading.value = false;
    }
  }

  async function createTournament(payload: TournamentPayload) {
    await $fetch("/api/tournaments", {
      method: "POST",
      body: payload,
    });

    await fetchTournaments();
  }

  async function fetchTournamentById(id: number) {
    return await $fetch<TournamentDTO>(`/api/tournaments/${id}`);
  }

  async function deleteTournament(id: number) {
    await $fetch(`/api/tournaments/${id}`, {
      method: "DELETE",
    });

    await fetchTournaments();
  }

  async function generateMatches(id: number) {
    await $fetch(`/api/tournaments/${id}/generate-matches`, {
      method: "POST",
    });

    await fetchTournaments();
  }

  async function updateMatchScore(
    id: number,
    homeScore: number,
    awayScore: number,
  ) {
    await $fetch(`/api/matches/${id}/score`, {
      method: "PATCH",
      body: { homeScore, awayScore },
    });

    await fetchTournaments();
  }

  async function getStandings(id: number) {
    return await $fetch<{ tournamentId: number; standings: StandingEntry[] }>(
      `/api/tournaments/${id}/standings`,
    );
  }

  return {
    tournaments,
    loading,
    error,
    fetchTournaments,
    fetchTournamentById,
    createTournament,
    deleteTournament,
    generateMatches,
    updateMatchScore,
    getStandings,
  };
}
