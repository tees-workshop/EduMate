"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import {
    User, Palette, Bell, Shield, Save, Trash2,
    Eye, EyeOff, CheckCircle, AlertTriangle
} from "lucide-react";
import { db } from "@/lib/db";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/context/ThemeContext";

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "account", label: "Account", icon: Shield },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border p-6 mb-5 theme-card theme-border">
            <h3 className="text-sm font-black theme-text-muted mb-5 uppercase tracking-widest">
                {title}
            </h3>
            {children}
        </div>
    );
}

function InputField({
    label, value, onChange, type = "text", placeholder, disabled
}: {
    label: string;
    value: string;
    onChange?: (v: string) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-bold mb-2 theme-text-muted">{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full px-4 py-3 rounded-xl text-sm theme-input focus:outline-none transition-all disabled:opacity-40"
                onFocus={e => !disabled && (e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            />
        </div>
    );
}

function Toggle({ enabled, onChange, label, sub }: {
    enabled: boolean;
    onChange: (v: boolean) => void;
    label: string;
    sub?: string;
}) {
    return (
        <div className="flex items-center justify-between py-3 border-b theme-border">
            <div>
                <p className="text-sm font-semibold theme-text">{label}</p>
                {sub && <p className="text-xs mt-0.5 theme-text-muted">{sub}</p>}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className="w-11 h-6 rounded-full relative transition-all duration-300 shrink-0"
                style={{
                    background: enabled
                        ? "linear-gradient(135deg, #22d3ee, #059669)"
                        : "rgba(255,255,255,0.08)"
                }}>
                <span
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                    style={{
                        left: enabled ? "calc(100% - 22px)" : "2px",
                        background: enabled ? "#080d14" : "#475569"
                    }} />
            </button>
        </div>
    );
}

export default function SettingsPage() {
    const { user, setUser } = useUser();
    const [activeTab, setActiveTab] = useState("profile");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Profile
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [level, setLevel] = useState("");

    // Appearance
    const { theme, setTheme } = useTheme();


    // Notifications
    const [studyReminders, setStudyReminders] = useState(true);
    const [quizAlerts, setQuizAlerts] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(false);
    const [deadlineAlerts, setDeadlineAlerts] = useState(true);

    // Account
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            const timer = setTimeout(() => {
                setName(user.name);
                setEmail(user.email);
                setLevel(user.level ?? "");
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const saveProfile = async () => {
        if (!user) return;
        if (!name.trim() || !email.trim()) {
            showToast("Name and email are required.", "error");
            return;
        }
        try {
            const updated = { ...user, name: name.trim(), email: email.trim(), level: level.trim() };
            await db.saveUser(updated);
            setUser(updated);
            showToast("Profile saved successfully!", "success");
        } catch {
            showToast("Failed to save profile.", "error");
        }
    };

    const changePassword = async () => {
        if (!user) return;
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast("All password fields are required.", "error");
            return;
        }
        if (currentPassword !== user.password) {
            showToast("Current password is incorrect.", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast("New passwords do not match.", "error");
            return;
        }
        if (newPassword.length < 6) {
            showToast("Password must be at least 6 characters.", "error");
            return;
        }
        try {
            const updated = { ...user, password: newPassword };
            await db.saveUser(updated);
            setUser(updated);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            showToast("Password changed successfully!", "success");
        } catch {
            showToast("Failed to change password.", "error");
        }
    };

    const deleteAccount = async () => {
        if (!user) return;
        try {
            // Delete all user data
            const materials = await db.getMaterialsByUser(user.id);
            for (const m of materials) await db.deleteMaterial(m.id);
            const tasks = await db.getTasksByUser(user.id);
            for (const t of tasks) await db.deleteTask(t.id);
            const notes = await db.getNotesByUser(user.id);
            for (const n of notes) await db.deleteNote(n.id);
            await db.deleteUser(user.id);
            sessionStorage.clear();
            localStorage.removeItem("currentUserId");
            window.location.href = "/";
        } catch {
            showToast("Failed to delete account.", "error");
        }
    };

    return (
        <div className="flex min-h-screen relative theme-bg theme-text">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute w-[400px] h-[400px] rounded-full"
                    style={{
                        background: "#22d3ee", filter: "blur(140px)", opacity: 0.06,
                        top: "-100px", left: "-100px",
                        animation: "driftA1 8s ease-in-out infinite"
                    }} />
                <div className="absolute w-[300px] h-[300px] rounded-full"
                    style={{
                        background: "#818cf8", filter: "blur(120px)", opacity: 0.05,
                        bottom: "-80px", right: "-80px",
                        animation: "driftA2 10s ease-in-out infinite"
                    }} />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="Settings" />

                    <main className="flex-1 p-4 md:p-6 overflow-auto pt-16 md:pt-6">
                        <div className="max-w-3xl mx-auto">

                            {/* Tabs */}
                            <div className="flex gap-2 mb-6 p-1 rounded-2xl w-fit border"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    borderColor: "rgba(255,255,255,0.07)"
                                }}>
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive ? "theme-text" : "theme-text-muted"}`}
                                            style={isActive ? {
                                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                color: "#080d14",
                                                boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                            } : undefined}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <div>
                                    <SectionCard title="Personal Information">
                                        {/* Avatar */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0"
                                                style={{
                                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                    color: "#080d14"
                                                }}>
                                                {name ? name.charAt(0).toUpperCase() : "?"}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{name || "Your Name"}</p>
                                                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                                                    {level || "Student"} · EduMate
                                                </p>
                                            </div>
                                        </div>

                                        <InputField label="Full Name" value={name} onChange={setName} placeholder="John Doe" />
                                        <InputField label="Email Address" value={email} onChange={setEmail} type="email" placeholder="john@example.com" />

                                        <div className="mb-4">
                                            <label className="block text-xs font-bold mb-2" style={{ color: "#64748b" }}>
                                                Academic Level
                                            </label>
                                            <select
                                                value={level}
                                                onChange={e => setLevel(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                                                style={{
                                                    background: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.08)",
                                                    color: "#64748b"
                                                }}
                                                onFocus={e => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)")}
                                                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                                            >
                                                <option value="" style={{ background: "#080d14" }}>Select level</option>
                                                {["100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "Postgraduate"].map(l => (
                                                    <option key={l} value={l} style={{ background: "#080d14" }}>{l}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            onClick={saveProfile}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                                            style={{
                                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                color: "#080d14",
                                                boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                            }}>
                                            <Save className="w-4 h-4" /> Save Profile
                                        </button>
                                    </SectionCard>
                                </div>
                            )}

                            {/* Appearance Tab */}
{activeTab === "appearance" && (
    <SectionCard title="Display Preferences">
        <p className="text-xs mb-5 theme-text-muted">
            Choose how EduMate looks across all pages.
        </p>
 
        <div className="grid grid-cols-2 gap-3 mb-6">
            {[
                {
                    label: "Dark Mode",
                    value: "dark",
                    description: "Easy on the eyes at night",
                    icon: "🌙",
                },
                {
                    label: "Light Mode",
                    value: "light",
                    description: "Clean and bright interface",
                    icon: "☀️",
                },
            ].map(({ label, value, description, icon }) => {
                const isActive = theme === value;

                return (
                    <button
                        key={value}
                        onClick={() => setTheme(value as "dark" | "light")}
                        className="rounded-2xl p-4 border text-left transition-all hover:scale-[1.02] theme-card theme-border"
                        style={{
                            background: isActive
                                ? "rgba(34,211,238,0.08)"
                                : "rgba(255,255,255,0.03)",
                        }}>
                        <div className="text-2xl mb-2">{icon}</div>
                        <p className="text-sm font-bold theme-text mb-1">{label}</p>
                        <p className="text-[10px] theme-text-muted">{description}</p>
                        {isActive && (
                            <div className="mt-2 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22d3ee" }} />
                                <span className="text-[10px] font-bold" style={{ color: "#22d3ee" }}>Active</span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
 
        <button
            onClick={() => showToast("Appearance preferences saved!", "success")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{
                background: "linear-gradient(135deg, #22d3ee, #059669)",
                color: "#080d14",
                boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
            }}>
            <Save className="w-4 h-4" /> Save Preferences
        </button>
    </SectionCard>
)}

                            {/* Notifications Tab */}
                            {activeTab === "notifications" && (
                                <SectionCard title="Notification Preferences">
                                    <Toggle
                                        enabled={studyReminders}
                                        onChange={setStudyReminders}
                                        label="Study Reminders"
                                        sub="Get reminded to study at your scheduled times"
                                    />
                                    <Toggle
                                        enabled={quizAlerts}
                                        onChange={setQuizAlerts}
                                        label="Quiz Alerts"
                                        sub="Notify when AI quiz is ready to take"
                                    />
                                    <Toggle
                                        enabled={deadlineAlerts}
                                        onChange={setDeadlineAlerts}
                                        label="Deadline Alerts"
                                        sub="Get alerts before upcoming task deadlines"
                                    />
                                    <Toggle
                                        enabled={weeklyReport}
                                        onChange={setWeeklyReport}
                                        label="Weekly Progress Report"
                                        sub="Receive a summary of your study activity each week"
                                    />
                                    <div className="mt-5">
                                        <button
                                            onClick={() => showToast("Notification preferences saved!", "success")}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                                            style={{
                                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                color: "#080d14",
                                                boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                            }}>
                                            <Save className="w-4 h-4" /> Save Preferences
                                        </button>
                                    </div>
                                </SectionCard>
                            )}

                            {/* Account Tab */}
                            {activeTab === "account" && (
                                <div>
                                    <SectionCard title="Change Password">
                                        <div className="relative mb-4">
                                            <InputField
                                                label="Current Password"
                                                value={currentPassword}
                                                onChange={setCurrentPassword}
                                                type={showPasswords ? "text" : "password"}
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <InputField
                                            label="New Password"
                                            value={newPassword}
                                            onChange={setNewPassword}
                                            type={showPasswords ? "text" : "password"}
                                            placeholder="Enter new password"
                                        />
                                        <InputField
                                            label="Confirm New Password"
                                            value={confirmPassword}
                                            onChange={setConfirmPassword}
                                            type={showPasswords ? "text" : "password"}
                                            placeholder="Confirm new password"
                                        />
                                        <div className="flex items-center gap-4 mt-2">
                                            <button
                                                onClick={() => setShowPasswords(!showPasswords)}
                                                className="flex items-center gap-2 text-xs font-bold transition-all"
                                                style={{ color: "#475569" }}>
                                                {showPasswords
                                                    ? <><EyeOff className="w-3.5 h-3.5" /> Hide passwords</>
                                                    : <><Eye className="w-3.5 h-3.5" /> Show passwords</>
                                                }
                                            </button>
                                        </div>
                                        <button
                                            onClick={changePassword}
                                            className="mt-5 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                                            style={{
                                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                color: "#080d14",
                                                boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                            }}>
                                            <Save className="w-4 h-4" /> Update Password
                                        </button>
                                    </SectionCard>

                                    {/* Danger Zone */}
                                    <div className="rounded-2xl border p-6"
                                        style={{
                                            background: "rgba(248,113,113,0.03)",
                                            borderColor: "rgba(248,113,113,0.15)"
                                        }}>
                                        <h3 className="text-sm font-black uppercase tracking-widest mb-1"
                                            style={{ color: "#f87171" }}>
                                            Danger Zone
                                        </h3>
                                        <p className="text-xs mb-5" style={{ color: "#64748b" }}>
                                            Deleting your account is permanent and cannot be undone. All your materials, notes, and tasks will be erased.
                                        </p>

                                        {!showDeleteConfirm ? (
                                            <button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all border hover:scale-105"
                                                style={{
                                                    background: "rgba(248,113,113,0.08)",
                                                    borderColor: "rgba(248,113,113,0.3)",
                                                    color: "#f87171"
                                                }}>
                                                <Trash2 className="w-4 h-4" /> Delete Account
                                            </button>
                                        ) : (
                                            <div className="rounded-xl p-4 border"
                                                style={{
                                                    background: "rgba(248,113,113,0.06)",
                                                    borderColor: "rgba(248,113,113,0.2)"
                                                }}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <AlertTriangle className="w-4 h-4" style={{ color: "#f87171" }} />
                                                    <p className="text-sm font-bold" style={{ color: "#f87171" }}>
                                                        Are you absolutely sure?
                                                    </p>
                                                </div>
                                                <p className="text-xs mb-4" style={{ color: "#64748b" }}>
                                                    This will permanently delete your account and all associated data.
                                                </p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={deleteAccount}
                                                        className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                                                        style={{
                                                            background: "#f87171",
                                                            color: "#fff"
                                                        }}>
                                                        Yes, delete everything
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                        className="px-5 py-2 rounded-xl text-sm font-bold transition-all border"
                                                        style={{
                                                            borderColor: "rgba(255,255,255,0.1)",
                                                            color: "#94a3b8"
                                                        }}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border text-sm font-bold transition-all"
                    style={{
                        background: toast.type === "success" ? "rgba(5,150,105,0.15)" : "rgba(248,113,113,0.15)",
                        borderColor: toast.type === "success" ? "rgba(5,150,105,0.3)" : "rgba(248,113,113,0.3)",
                        color: toast.type === "success" ? "#059669" : "#f87171",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                    }}>
                    {toast.type === "success"
                        ? <CheckCircle className="w-4 h-4" />
                        : <AlertTriangle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
}