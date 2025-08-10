import express from "express";
import { TaskSchema } from "./types.js";
import { listAgents, registerAgent } from "./registry.js";
import { selectAgents } from "./selector.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/agents", (req, res) => {
  try {
    const agent = registerAgent(req.body);
    res.status(201).json(agent);
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/agents", (_req, res) => res.json(listAgents()));

app.post("/run", (req, res) => {
  const parsed = TaskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });
  const chosen = selectAgents(listAgents(), parsed.data.needTags);
  res.json({ chosen, note: "stub: call chosen agent URLs here" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AgentSpace running on :${PORT}`));
