import { promises as fs } from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";

const app = express();
const PORT = Number.parseInt(process.env.PORT || "8787", 10);
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.resolve(process.cwd(), "server"));
const DB_FILE = path.join(DATA_DIR, "db.json");
const TOTAL_PHASES = 2000;

app.use(cors());
app.use(express.json({ limit: "256kb" }));

let store = {
  users: [],
};

function normalizeDbShape(raw) {
  return {
    users: Array.isArray(raw?.users) ? raw.users : [],
  };
}

async function loadStore() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(DB_FILE, "utf8");
    store = normalizeDbShape(JSON.parse(raw));
  } catch (error) {
    if (error?.code === "ENOENT") {
      await saveStore();
      return;
    }

    throw error;
  }
}

async function saveStore() {
  const tempPath = `${DB_FILE}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await fs.rename(tempPath, DB_FILE);
}

function sanitizeId(value) {
  return String(value || "").trim().replace(/[^a-zA-Z0-9-]/g, "").slice(0, 16);
}

function sanitizeName(value) {
  const name = String(value || "").trim().slice(0, 22);
  return name || "Jogador";
}

function sanitizeAvatar(value) {
  const fallback = "🙂";
  return String(value || fallback).slice(0, 4) || fallback;
}

function sanitizeAvatarColor(value) {
  const fallback = "#8fd8ff";
  const color = String(value || fallback).trim();
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback;
}

function sanitizePhase(value) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.max(1, Math.min(TOTAL_PHASES, parsed));
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    avatarColor: user.avatarColor,
    phase: user.phase,
    updatedAt: user.updatedAt,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, users: store.users.length, now: Date.now() });
});

app.post("/api/public/sync", async (req, res) => {
  const id = sanitizeId(req.body?.id);
  if (!id || id.length < 5) {
    return res.status(400).json({ error: "ID da conta inválido." });
  }

  const nextName = sanitizeName(req.body?.name);
  const nextAvatar = sanitizeAvatar(req.body?.avatar);
  const nextAvatarColor = sanitizeAvatarColor(req.body?.avatarColor);
  const nextPhase = sanitizePhase(req.body?.phase);
  const now = Date.now();

  let user = store.users.find((entry) => entry.id === id);
  if (!user) {
    user = {
      id,
      name: nextName,
      avatar: nextAvatar,
      avatarColor: nextAvatarColor,
      phase: nextPhase,
      createdAt: now,
      updatedAt: now,
    };
    store.users.push(user);
  } else {
    user.name = nextName;
    user.avatar = nextAvatar;
    user.avatarColor = nextAvatarColor;
    user.phase = nextPhase;
    user.updatedAt = now;
  }

  await saveStore();
  res.json({ ok: true, player: toPublicUser(user) });
});

app.get("/api/leaderboard", (_req, res) => {
  const ranking = store.users
    .map((user) => toPublicUser(user))
    .sort((a, b) => {
      if (b.phase !== a.phase) {
        return b.phase - a.phase;
      }

      return a.updatedAt - b.updatedAt;
    })
    .slice(0, 10);

  res.json({ ranking, totalUsers: store.users.length });
});

loadStore()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Menor Games API online em http://0.0.0.0:${PORT}`);
      console.log(`DB em: ${DB_FILE}`);
    });
  })
  .catch((error) => {
    console.error("Falha ao iniciar API:", error);
    process.exit(1);
  });
