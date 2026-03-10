"use client";

const DB_NAME = "StudyAIBB";
const DB_VERSION = 1;

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
    data: any;
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

export class StudyDB {
    private db: IDBDatabase | null = null;

    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("users")) {
                    db.createObjectStore("users", { keyPath: "id" });
                }
                if (!db.objectStoreNames.contains("materials")) {
                    const materialStore = db.createObjectStore("materials", { keyPath: "id" });
                    materialStore.createIndex("userId", "userId", { unique: false });
                }
                if (!db.objectStoreNames.contains("tasks")) {
                    const taskStore = db.createObjectStore("tasks", { keyPath: "id" });
                    taskStore.createIndex("userId", "userId", { unique: false });
                }
                if (!db.objectStoreNames.contains("notes")) {
                    const noteStore = db.createObjectStore("notes", { keyPath: "id" });
                    noteStore.createIndex("userId", "userId", { unique: false });
                }
            };

            request.onsuccess = (event: any) => {
                this.db = event.target.result;
                resolve(this.db!);
            };

            request.onerror = (event: any) => {
                reject("IndexedDB error: " + event.target.errorCode);
            };
        });
    }

    // ─── Users ───────────────────────────────────────────────

    async saveUser(user: User): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["users"], "readwrite");
            const store = transaction.objectStore("users");
            const request = store.put(user);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getUser(id: string): Promise<User | undefined> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["users"], "readonly");
            const store = transaction.objectStore("users");
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllUsers(): Promise<User[]> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["users"], "readonly");
            const store = transaction.objectStore("users");
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // ─── Materials ───────────────────────────────────────────

    async saveMaterial(material: Material): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["materials"], "readwrite");
            const store = transaction.objectStore("materials");
            const request = store.put(material);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getMaterialsByUser(userId: string): Promise<Material[]> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["materials"], "readonly");
            const store = transaction.objectStore("materials");
            const index = store.index("userId");
            const request = index.getAll(userId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteMaterial(id: string): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["materials"], "readwrite");
            const store = transaction.objectStore("materials");
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getMaterialById(id: string): Promise<Material | undefined> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["materials"], "readonly");
        const store = transaction.objectStore("materials");
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

    // ─── Tasks ───────────────────────────────────────────────

    async saveTask(task: Task): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["tasks"], "readwrite");
            const store = transaction.objectStore("tasks");
            const request = store.put(task);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getTasksByUser(userId: string): Promise<Task[]> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["tasks"], "readonly");
            const store = transaction.objectStore("tasks");
            const index = store.index("userId");
            const request = index.getAll(userId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteTask(id: string): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["tasks"], "readwrite");
            const store = transaction.objectStore("tasks");
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // ─── Notes ───────────────────────────────────────────────

    async saveNote(note: Note): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["notes"], "readwrite");
            const store = transaction.objectStore("notes");
            const request = store.put(note);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getNotesByUser(userId: string): Promise<Note[]> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["notes"], "readonly");
            const store = transaction.objectStore("notes");
            const index = store.index("userId");
            const request = index.getAll(userId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteNote(id: string): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["notes"], "readwrite");
            const store = transaction.objectStore("notes");
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export const db = new StudyDB();