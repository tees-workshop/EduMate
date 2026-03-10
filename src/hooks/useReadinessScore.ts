"use client";

import { useEffect, useState } from "react";

export function useReadinessScore() {
    const [score, setScore] = useState<number | null>(null);
    const [label, setLabel] = useState<string | null>(null);

    useEffect(() => {
        try {
            const baseline = sessionStorage.getItem("baseline_result");
            const quiz = sessionStorage.getItem("quiz_result");

            // baseline_result has the actual prediction: { label, confidence, ready }
            // quiz_result only has raw inputs — the prediction comes from results page
            // So we read from baseline_result for now
            if (baseline) {
                const result = JSON.parse(baseline);
                console.log("Baseline result:", result);

                if (typeof result.confidence === "number") {
                    // confidence = probability of the predicted class
                    // if ready = true, confidence is readiness score
                    // if ready = false, readiness = 1 - confidence
                    const readyProb = result.ready
                        ? Math.round(result.confidence * 100)
                        : Math.round((1 - result.confidence) * 100);
                    setScore(readyProb);
                }

                if (typeof result.ready === "boolean") {
                    setLabel(result.ready ? "Ready" : "Not Ready");
                }
            }
        } catch (e) {
            console.error("useReadinessScore error:", e);
        }
    }, []);

    return { score, label };
}