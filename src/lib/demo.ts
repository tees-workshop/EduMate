import { db, User, Topic, Task } from "./db";

export const startDemoSession = async () => {
    const demoId = "demo_student_123";
    
    // Check if demo user already exists to avoid recreating data on every click
    const existing = await db.getUser(demoId);
    
    if (!existing) {
        // 1. Create Mock User
        const demoUser: User = {
            id: demoId,
            name: "Demo Student",
            email: "demo@edumate.app",
            password: "demo_password",
            level: "400L"
        };
        await db.saveUser(demoUser);

        // 2. Add Mock Topics (To populate the Smart Tags on dashboard)
        await db.saveTopic({ id: "demo_topic_1", userId: demoId, name: "Machine Learning", type: "ai", timestamp: Date.now() });
        await db.saveTopic({ id: "demo_topic_2", userId: demoId, name: "Advanced Data Structures", type: "manual", timestamp: Date.now() - 1000 });
        await db.saveTopic({ id: "demo_topic_3", userId: demoId, name: "Operating Systems", type: "ai", timestamp: Date.now() - 2000 });

        // 3. Add Mock Tasks (To give them a filled to-do list / completed tasks stat)
        await db.saveTask({ id: "demo_task_1", userId: demoId, text: "Read Chapter 4 of AI Textbook", done: true, timestamp: Date.now() - 86400000 });
        await db.saveTask({ id: "demo_task_2", userId: demoId, text: "Finish CSC 429 Assignment", done: true, timestamp: Date.now() - 40000 });
        await db.saveTask({ id: "demo_task_3", userId: demoId, text: "Review Midterm Past Questions", done: false, timestamp: Date.now() });
    }

    // Set auth token
    localStorage.setItem("study_ai_user_id", demoId);
    return true;
};
