import type { RoundRobinPairing } from "./types";

export function generateRoundRobin(teamIds: number[]): RoundRobinPairing[] {
  if (teamIds.length < 2) {
    return [];
  }

  const ids = [...teamIds];
  const hasBye = ids.length % 2 !== 0;
  const byeId = -1;

  if (hasBye) {
    ids.push(byeId);
  }

  const pairings: RoundRobinPairing[] = [];
  const rounds = ids.length - 1;
  const half = ids.length / 2;

  for (let roundIndex = 0; roundIndex < rounds; roundIndex += 1) {
    for (let i = 0; i < half; i += 1) {
      const home = ids[i];
      const away = ids[ids.length - 1 - i];

      if (home === undefined || away === undefined) {
        continue;
      }

      if (home === byeId || away === byeId) {
        continue;
      }

      const isEvenRound = roundIndex % 2 === 0;
      pairings.push({
        round: roundIndex + 1,
        homeTeamId: isEvenRound ? home : away,
        awayTeamId: isEvenRound ? away : home,
      });
    }

    const fixed = ids[0];
    const rotating = ids.slice(1);
    const last = rotating.pop();

    if (fixed === undefined || last === undefined) {
      continue;
    }

    rotating.unshift(last);
    ids.splice(0, ids.length, fixed, ...rotating);
  }

  return pairings;
}
