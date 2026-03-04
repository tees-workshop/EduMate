import * as ort from 'onnxruntime-web';

export interface HabitInputs {
    hoursStudied: number;
    previousScores: number;
    sleepHours: number;
    practicePapers: number;
}

export async function predictBaseline(inputs: HabitInputs): Promise<{
    label: number;
    confidence: number;
    ready: boolean;
}> {
    const session = await ort.InferenceSession.create('/readiness_model_1.onnx');

    const tensor = new ort.Tensor('float32',
        Float32Array.from([
            inputs.hoursStudied,
            inputs.previousScores,
            inputs.sleepHours,
            inputs.practicePapers,
        ]),
        [1, 4]
    );

    const results = await session.run({ float_input: tensor });
    const label = Number(results.label.data[0]);
    const probTensor = results.probabilities.data as Float32Array;
    const confidence = label === 1 ? probTensor[1] : probTensor[0];

    return { label, confidence, ready: label === 1 };
}

export interface QuizInputs {
    scorePercent: number;
    questionsCorrect: number;
    questionsWrong: number;
    avgTimePerQuestion: number;
    hintsUsed: number;
    consistencyScore: number;
    confidenceAvg: number;
}

export async function predictQuizReadiness(inputs: QuizInputs): Promise<{
    label: number;
    confidence: number;
    ready: boolean;
}> {
    const session = await ort.InferenceSession.create('/readiness_model_2.onnx');

    const tensor = new ort.Tensor('float32',
        Float32Array.from([
            inputs.scorePercent,
            inputs.questionsCorrect,
            inputs.questionsWrong,
            inputs.avgTimePerQuestion,
            inputs.hintsUsed,
            inputs.consistencyScore,
            inputs.confidenceAvg,
        ]),
        [1, 7]
    );

    const results = await session.run({ float_input: tensor });
    const label = Number(results.label.data[0]);
    const probTensor = results.probabilities.data as Float32Array;
    const confidence = label === 1 ? probTensor[1] : probTensor[0];

    return { label, confidence, ready: label === 1 };
}