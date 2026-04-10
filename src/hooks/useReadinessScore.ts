"use client";

import { useEffect, useState } from "react";

export function useReadinessScore() {
    const [score, setScore] = useState<number | null>(null);
    const [label, setLabel] = useState<string | null>(null);

    useEffect(() => {
        try {
            const quizRaw = sessionStorage.getItem("quiz_result");
            const baselineRaw = sessionStorage.getItem("baseline_result");

            if (quizRaw) {
                // Quiz taken — use scorePercent as the readiness score
                const quiz = JSON.parse(quizRaw);
                const percent = typeof quiz.scorePercent === "number"
                    ? Math.round(quiz.scorePercent)
                    : null;

                if (percent !== null) {
                    setScore(percent);
                    if (percent >= 70) setLabel("Ready");
                    else if (percent >= 50) setLabel("Needs Work");
                    else setLabel("Not Ready");
                    return;
                }
            }

            if (baselineRaw) {
                // No quiz yet — fall back to habit model
                const baseline = JSON.parse(baselineRaw);
                if (typeof baseline.confidence === "number") {
                    const percent = baseline.ready
                        ? Math.round(baseline.confidence * 100)
                        : Math.round((1 - baseline.confidence) * 100);
                    setScore(percent);
                    if (percent >= 70) setLabel("Ready");
                    else if (percent >= 50) setLabel("Needs Work");
                    else setLabel("Not Ready");
                }
            }
        } catch (e) {
            console.error("useReadinessScore error:", e);
        }
    }, []);

    return { score, label };
}
