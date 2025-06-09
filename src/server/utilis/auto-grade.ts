// utils/grader.ts
import vm from 'vm';

interface TestCase {
    input: string;
    expected: string;
}

export const autoGradeCode = (
    code: string,
    tests: TestCase[]
): { passed: number; failed: number; results: string[]; score: number } => {
    const results: string[] = [];
    let passed = 0;

    for (const test of tests) {
        try {
            const sandbox: any = { result: null };
            const context = vm.createContext(sandbox);

            const wrappedCode = `
        function run(input) {
          const [a, b] = input.split(',').map(Number);
          return (${code})(a, b);
        }
        result = run("${test.input}");
      `;

            vm.runInContext(wrappedCode, context, { timeout: 1000 });

            const output = String(sandbox.result);

            if (output === test.expected) {
                passed++;
                results.push(`✅ Test Passed: input=${test.input}, output=${output}`);
            } else {
                results.push(`❌ Test Failed: input=${test.input}, expected=${test.expected}, got=${output}`);
            }
        } catch (err) {
            results.push(`💥 Runtime Error on input=${test.input}: ${err}`);
        }
    }

    const score = Math.round((passed / tests.length) * 100);
    return { passed, failed: tests.length - passed, results, score };
};
