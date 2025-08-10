import { describe, it, expect } from 'vitest';
import { selectAgents } from '../src/selector';
const agents = [
  { url: 'u1', name: 'a', tags: [1, 4] },
  { url: 'u2', name: 'b', tags: [2] },
  { url: 'u3', name: 'c', tags: ['1+4'] },
] as any;

describe('selectAgents', () => {
  it('picks agents matching most tags', () => {
    const chosen = selectAgents(agents, [1, 4]);
    expect(chosen.length).toBeGreaterThan(0);
  });
});
