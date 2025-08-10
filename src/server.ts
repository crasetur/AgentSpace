import express from 'express';
import { TaskSchema } from './types.js';
import { listAgents, registerAgent } from './registry.js';
import { selectAgents } from './selector.js';
import { scoreTag } from './wasm.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/agents', (req, res) => {
  try {
    const agent = registerAgent(req.body);
    res.status(201).json(agent);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    res.status(400).json({ error: msg });
  }
});

app.get('/agents', (_req, res) => res.json(listAgents()));

app.post('/run', (req, res) => {
  const parsed = TaskSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.format() });
  const chosen = selectAgents(listAgents(), parsed.data.needTags);
  res.json({ chosen, note: 'stub: call chosen agent URLs here' });
});

app.post('/score', async (req, res) => {
  try {
    const { tag } = req.body ?? {};
    if (typeof tag === 'undefined')
      return res.status(400).json({ error: 'tag is required' });
    const score = await scoreTag(Number(tag));
    res.json({ tag: Number(tag), score });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: msg });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AgentSpace running on :${PORT}`));
