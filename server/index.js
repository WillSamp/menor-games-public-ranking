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

function sanitizePoints(value) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, parsed);
}

function sanitizeFriendIds(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  const uniq = new Set();
  value.forEach((entry) => {
    const id = sanitizeId(entry);
    if (id && id.length >= 5) {
      uniq.add(id);
    }
  });

  return Array.from(uniq).slice(0, 200);
}

function normalizeUser(rawUser) {
  const id = sanitizeId(rawUser?.id);
  if (!id || id.length < 5) {
    return null;
  }

  const createdAtRaw = Number.parseInt(String(rawUser?.createdAt), 10);
  const updatedAtRaw = Number.parseInt(String(rawUser?.updatedAt), 10);
  const now = Date.now();

  return {
    id,
    name: sanitizeName(rawUser?.name),
    avatar: sanitizeAvatar(rawUser?.avatar),
    avatarColor: sanitizeAvatarColor(rawUser?.avatarColor),
    phase: sanitizePhase(rawUser?.phase),
    points: sanitizePoints(rawUser?.points),
    friends: sanitizeFriendIds(rawUser?.friends).filter((friendId) => friendId !== id),
    createdAt: Number.isFinite(createdAtRaw) ? createdAtRaw : now,
    updatedAt: Number.isFinite(updatedAtRaw) ? updatedAtRaw : now,
  };
}

function normalizeDbShape(raw) {
  const users = Array.isArray(raw?.users)
    ? raw.users
      .map((entry) => normalizeUser(entry))
      .filter((entry) => !!entry)
    : [];

  return {
    users,
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

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    avatarColor: user.avatarColor,
    phase: user.phase,
    points: user.points,
    updatedAt: user.updatedAt,
  };
}

function ensureUserById(id, now = Date.now()) {
  let user = store.users.find((entry) => entry.id === id);
  if (!user) {
    user = {
      id,
      name: "Jogador",
      avatar: "🙂",
      avatarColor: "#8fd8ff",
      phase: 1,
      points: 0,
      friends: [],
      createdAt: now,
      updatedAt: now,
    };
    store.users.push(user);
  }

  if (!Array.isArray(user.friends)) {
    user.friends = [];
  }
  user.points = sanitizePoints(user.points);
  user.phase = sanitizePhase(user.phase);

  return user;
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
  const nextPoints = sanitizePoints(req.body?.points);
  const now = Date.now();

  const user = ensureUserById(id, now);
  user.name = nextName;
  user.avatar = nextAvatar;
  user.avatarColor = nextAvatarColor;
  user.phase = Math.max(user.phase, nextPhase);
  user.points = Math.max(user.points, nextPoints);
  user.updatedAt = now;

  await saveStore();
  res.json({ ok: true, player: toPublicUser(user) });
});

app.post("/api/public/friends/add", async (req, res) => {
  const id = sanitizeId(req.body?.id);
  const friendId = sanitizeId(req.body?.friendId);

  if (!id || id.length < 5 || !friendId || friendId.length < 5) {
    return res.status(400).json({ error: "IDs inválidos para amizade." });
  }

  if (id === friendId) {
    return res.status(400).json({ error: "Você não pode adicionar seu próprio ID." });
  }

  const now = Date.now();
  const user = ensureUserById(id, now);
  const friend = store.users.find((entry) => entry.id === friendId);

  if (!friend) {
    return res.status(404).json({ error: "ID do amigo não encontrado." });
  }

  if (!user.friends.includes(friendId)) {
    user.friends.push(friendId);
  }
  if (!Array.isArray(friend.friends)) {
    friend.friends = [];
  }
  if (!friend.friends.includes(id)) {
    friend.friends.push(id);
  }

  user.updatedAt = now;
  friend.updatedAt = now;

  await saveStore();
  return res.json({ ok: true });
});

app.get("/api/public/friends/:id", (req, res) => {
  const id = sanitizeId(req.params?.id);
  if (!id || id.length < 5) {
    return res.status(400).json({ error: "ID inválido." });
  }

  const user = store.users.find((entry) => entry.id === id);
  if (!user) {
    return res.json({ friends: [] });
  }

  const friendIds = Array.isArray(user.friends) ? user.friends : [];
  const friends = friendIds
    .map((friendId) => store.users.find((entry) => entry.id === friendId))
    .filter((entry) => !!entry)
    .map((entry) => toPublicUser(entry))
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      if (b.phase !== a.phase) {
        return b.phase - a.phase;
      }

      return b.updatedAt - a.updatedAt;
    });

  return res.json({ friends });
});

app.get("/api/leaderboard", (_req, res) => {
  const ranking = store.users
    .map((user) => toPublicUser(user))
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      if (b.phase !== a.phase) {
        return b.phase - a.phase;
      }

      return b.updatedAt - a.updatedAt;
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
