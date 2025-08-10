import type { Agent } from "./types.js";
export function selectAgents(agents: Agent[], needTags: (number | string)[]) {
  const score = (a: Agent) =>
    needTags.reduce((acc, t) => acc + (a.tags.includes(t) ? 1 : 0), 0);
  const withScore = agents.map((a) => ({ a, s: score(a) }));
  const max = Math.max(0, ...withScore.map((x) => x.s));
  return withScore.filter((x) => x.s === max && max > 0).map((x) => x.a);
}
