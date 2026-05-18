"use client";

const DB_NAME = "StudyAIBB";
const DB_VERSION = 2;

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    level: string;
    avatar?: string;
}

export interface Material {
    id: string;
    userId: string;
    name: string;
    type: string;
    size: string;
    data: string; // Base64 data URL
    extractedText?: string;
    timestamp: number;
}

export interface Task {
    id: string;
    userId: string;
    text: string;
    done: boolean;
    timestamp: number;
}

export interface Note {
    id: string;
    userId: string;
    title: string;
    content: string;
    timestamp: number;
}

export interface Topic {
    id: string;
    userId: string;
    name: string;
    type: "ai" | "manual";
    timestamp: number;
}

export class StudyDB {
    private db: IDBDatabase | null = null;

    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const stores = [
                    { name: "users", keyPath: "id" },
                    { name: "materials", keyPath: "id", index: "userId" },
                    { name: "tasks", keyPath: "id", index: "userId" },
                    { name: "notes", keyPath: "id", index: "userId" },
                    { name: "topics", keyPath: "id", index: "userId" },
                ];

                for (const store of stores) {
                    if (!db.objectStoreNames.contains(store.name)) {
                        const s = db.createObjectStore(store.name, { keyPath: store.keyPath });
                        if (store.index) {
                            s.createIndex(store.index, store.index, { unique: false });
                        }
                    }
                }
            };

            request.onsuccess = (event: Event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db!);
            };

            request.onerror = () => {
                reject("IndexedDB error: " + request.error?.message);
            };
        });
    }

    /**
     * Unified generic helper to execute transactions dryly and safely
     */
    private async execute<T>(
        storeName: string,
        mode: IDBTransactionMode,
        operation: (store: IDBObjectStore) => IDBRequest
    ): Promise<T> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], mode);
            const store = transaction.objectStore(storeName);
            const request = operation(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // ─── Users ───────────────────────────────────────────────

    async saveUser(user: User): Promise<void> {
        return this.execute("users", "readwrite", store => store.put(user));
    }

    async getUser(id: string): Promise<User | undefined> {
        return this.execute("users", "readonly", store => store.get(id));
    }

    async getAllUsers(): Promise<User[]> {
        return this.execute("users", "readonly", store => store.getAll());
    }

    async deleteUser(id: string): Promise<void> {
        return this.execute("users", "readwrite", store => store.delete(id));
    }

    // ─── Materials ───────────────────────────────────────────

    async saveMaterial(material: Material): Promise<void> {
        return this.execute("materials", "readwrite", store => store.put(material));
    }

    async getMaterialsByUser(userId: string): Promise<Material[]> {
        return this.execute("materials", "readonly", store => {
            const index = store.index("userId");
            return index.getAll(userId);
        });
    }

    async getMaterialById(id: string): Promise<Material | undefined> {
        return this.execute("materials", "readonly", store => store.get(id));
    }

    async deleteMaterial(id: string): Promise<void> {
        return this.execute("materials", "readwrite", store => store.delete(id));
    }

    // ─── Tasks ───────────────────────────────────────────────

    async saveTask(task: Task): Promise<void> {
        return this.execute("tasks", "readwrite", store => store.put(task));
    }

    async getTasksByUser(userId: string): Promise<Task[]> {
        return this.execute("tasks", "readonly", store => {
            const index = store.index("userId");
            return index.getAll(userId);
        });
    }

    async deleteTask(id: string): Promise<void> {
        return this.execute("tasks", "readwrite", store => store.delete(id));
    }

    // ─── Notes ───────────────────────────────────────────────

    async saveNote(note: Note): Promise<void> {
        return this.execute("notes", "readwrite", store => store.put(note));
    }

    async getNotesByUser(userId: string): Promise<Note[]> {
        return this.execute("notes", "readonly", store => {
            const index = store.index("userId");
            return index.getAll(userId);
        });
    }

    async deleteNote(id: string): Promise<void> {
        return this.execute("notes", "readwrite", store => store.delete(id));
    }

    // ─── Topics ──────────────────────────────────────────────

    async saveTopic(topic: Topic): Promise<void> {
        return this.execute("topics", "readwrite", store => store.put(topic));
    }

    async getTopicsByUser(userId: string): Promise<Topic[]> {
        return this.execute("topics", "readonly", store => {
            const index = store.index("userId");
            return index.getAll(userId);
        });
    }

    async deleteTopic(id: string): Promise<void> {
        return this.execute("topics", "readwrite", store => store.delete(id));
    }
}

export const db = new StudyDB();