import { openDB, DBSchema, IDBPDatabase } from "idb";

export type OutboxOp =
  | { id: string; op: "create"; clienteId: string; data: any; ts: number }
  | { id: string; op: "update"; serverId?: string; data: any; ts: number }
  | { id: string; op: "delete"; serverId?: string; ts: number };

interface TodoDB extends DBSchema {
  tasks: { key: string; value: any };
  outbox: { key: number; value: OutboxOp };
  meta: { key: string; value: any };
}

let dbPromise: Promise<IDBPDatabase<TodoDB>>;

export function db() {
  if (!dbPromise) {
    dbPromise = openDB<TodoDB>("todo-pwa", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("tasks")) {
          db.createObjectStore("tasks", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("outbox")) {
          db.createObjectStore("outbox", { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

// --- Funciones de Tareas (Tasks) ---

export async function cacheTasks(list: any[]) {
  const database = await db();
  const tx = database.transaction("tasks", "readwrite");
  const store = tx.objectStore("tasks");
  
  await store.clear();
  for (const t of list) {
      await store.put(t);
  }
  await tx.done;
}

export async function putTaskLocal(task: any) {
  return (await db()).put("tasks", task);
}

export async function getAllTasksLocal() {
  return (await (await db()).getAll("tasks")) || [];
}

export async function removeTaskLocal(id: string) {
  return (await db()).delete("tasks", id);
}

// ClienteID para que el servidor pueda identificar el cliente
export async function promoteLocalToServer(clienteId: string, serverId: string) {
  const d = await db();
  const t = await d.get("tasks", clienteId);
  if (t) {
    await d.delete("tasks", clienteId);
    t.id = serverId;
    t.pending = false;
    await d.put("tasks", t);
  }
}

// --- Funciones de Outbox (Sincronización) ---

export async function queue(op: OutboxOp) {
  await (await db()).put("outbox", op); 
}

export async function getOutbox() {
  return (await (await db()).getAll("outbox")) || [];
}

export async function clearOutbox() {
  const tx = (await db()).transaction("outbox", "readwrite");
  await tx.objectStore("outbox").clear();
  await tx.done;
}

// --- Mapeo clienteID <-> serverID ---

export async function setMapping(clienteId: string, serverId: string) {
  await (await db()).put("meta", { key: clienteId, value: serverId });
}

export async function getMapping(clienteId: string) {
  const result = await (await db()).get("meta", clienteId);
  return result?.value as string | undefined;
}