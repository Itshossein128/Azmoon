import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const router = express.Router();

// A temporary directory for user code files
const codeDir = path.join(__dirname, '../../code');
if (!fs.existsSync(codeDir)) {
    fs.mkdirSync(codeDir, { recursive: true });
}

const runCodeInSandbox = (filePath: string, language: string, testInput: string): Promise<{ output: string; error?: string }> => {
    return new Promise((resolve) => {
        const command = language === 'javascript' ? 'node' : 'python';
        const child = spawn(command, [filePath]);
        let output = '';
        let error = '';
        const timeout = 5000; // 5 seconds

        const timer = setTimeout(() => {
            child.kill();
            error = 'Execution timed out.';
            resolve({ output, error });
        }, timeout);

        child.stdin.write(testInput);
        child.stdin.end();

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            error += data.toString();
        });

        child.on('close', () => {
            clearTimeout(timer);
            resolve({ output: output.trim(), error: error.trim() });
        });
    });
};

router.post('/execute', async (req, res) => {
    const { language, code, testCases } = req.body;

    if (!language || !code || !testCases || !Array.isArray(testCases)) {
        return res.status(400).json({ error: 'Language, code, and a valid array of test cases are required.' });
    }

    const fileExtension = language === 'javascript' ? '.js' : '.py';
    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join(codeDir, fileName);

    try {
        fs.writeFileSync(filePath, code);

        const results = [];
        for (const tc of testCases) {
            const { output, error } = await runCodeInSandbox(filePath, language, tc.input);
            if (error) {
                results.push({ ...tc, status: 'error', actualOutput: error });
            } else if (output === tc.expectedOutput.trim()) {
                results.push({ ...tc, status: 'success', actualOutput: output });
            } else {
                results.push({ ...tc, status: 'failure', actualOutput: output });
            }
        }
        res.json({ results });

    } catch (err) {
        res.status(500).json({ error: 'Failed to execute code.' });
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Clean up the file
        }
    }
});

export default router;
