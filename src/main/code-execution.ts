import { spawn, ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { v4 as uuidv4 } from 'uuid';
import { MongoMemoryServer } from 'mongodb-memory-server';
import sqlite3 from 'sqlite3';
import mysql from 'mysql2/promise';
import ivm from 'isolated-vm';

// Type definitions
interface FileInput {
  path: string;
  content: string;
}

interface TestCase {
  input: any;
  expected: any;
}

interface DatabaseTestData {
  schema?: string;
  rows?: string[];
}

interface MongoTestData {
  [key: string]: any;
}

interface DatabaseConfig {
  type: 'mongodb' | 'sqlite' | 'mysql';
  testData?: DatabaseTestData | MongoTestData[];
}

interface ExecuteCodeParams {
  files: FileInput[];
  language: 'javascript' | 'python';
  testCases: TestCase[];
  packages?: string[];
  database?: DatabaseConfig;
}

interface TestResult {
  passed: boolean;
  output: string | null;
  expected: any;
  input: any;
  error: string | null;
}

type SupportedLanguage = 'javascript' | 'python';
type SupportedDatabase = 'mongodb' | 'sqlite' | 'mysql';

// Create a base temporary directory for code execution
const tempDir: string = path.join(os.tmpdir(), 'dev-byte-test');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

/**
 * Execute JavaScript code in isolated-vm
 */
async function executeInIsolatedVM(
  code: string, 
  execDir: string, 
  packages: string[]
): Promise<any> {
  // Create a new isolate
  const isolate = new ivm.Isolate({ memoryLimit: 32 });

  try {
    // Create a context within the isolate
    const context = await isolate.createContext();
    const jail = context.global;

    // Set up console logging
    await jail.set('_console', {
      log: (...args: any[]) => console.log(...args),
      error: (...args: any[]) => console.error(...args),
    });

    // Create a basic console object in the isolate
    await context.eval(`
      const console = {
        log: (...args) => _console.log(...args),
        error: (...args) => _console.error(...args)
      };
    `);

    // Set up basic Node.js-like require functionality for allowed packages
    if (packages.length > 0) {
      const moduleCache: { [key: string]: any } = {};
      
      for (const pkg of packages) {
        try {
          const modulePath = path.join(execDir, 'node_modules', pkg);
          if (fs.existsSync(modulePath)) {
            // Read and evaluate the module
            const moduleContent = await fs.promises.readFile(
              path.join(modulePath, 'package.json'), 
              'utf8'
            );
            const packageInfo = JSON.parse(moduleContent);
            const mainFile = packageInfo.main || 'index.js';
            const moduleCode = await fs.promises.readFile(
              path.join(modulePath, mainFile), 
              'utf8'
            );
            
            // Create a simple module system
            const moduleScript = await isolate.compileScript(`
              (function() {
                const module = { exports: {} };
                const exports = module.exports;
                ${moduleCode}
                return module.exports;
              })()
            `);
            
            moduleCache[pkg] = await moduleScript.run(context);
          }
        } catch (moduleError) {
          console.warn(`Could not load module ${pkg}:`, moduleError);
        }
      }

      // Set up require function
      await jail.set('_moduleCache', moduleCache);
      await context.eval(`
        function require(name) {
          if (_moduleCache[name]) {
            return _moduleCache[name];
          }
          throw new Error('Module not found: ' + name);
        }
      `);
    }

    // Set up process.exit
    await jail.set('_processExit', (code: number) => {
      throw new Error(`Process exited with code ${code}`);
    });
    
    await context.eval(`
      const process = {
        exit: (code) => _processExit(code)
      };
    `);

    // Compile and run the user code
    const script = await isolate.compileScript(code);
    const result = await script.run(context, { timeout: 5000 });

    return result;
  } finally {
    // Clean up the isolate
    isolate.dispose();
  }
}

/**
 * Execute code in a sandbox environment with multiple files, packages, and database
 */
async function executeCode({
  files,
  language,
  testCases,
  packages,
  database
}: ExecuteCodeParams): Promise<TestResult[]> {
  const fileId: string = uuidv4();
  const execDir: string = path.join(tempDir, fileId);
  await fs.promises.mkdir(execDir, { recursive: true });

  let dbInstance: MongoMemoryServer | null = null;
  let dbConnection: sqlite3.Database | null = null;
  let connectionString: string = '';

  try {
    // Validate inputs
    if (!files || !files.length) throw new Error('No files provided');
    if (!language) throw new Error('Language not specified');
    if (!testCases) throw new Error('No test cases provided');

    // Write files to execution directory
    for (const file of files) {
      if (!file.path || !file.content) throw new Error('Invalid file format');
      const filePath: string = path.join(execDir, file.path);
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, file.content);
    }

    // Copy preinstalled packages for JavaScript
    if (language === 'javascript' && packages && packages.length > 0) {
      const nodeModulesDir: string = path.join(__dirname, '../../preinstalled_modules');
      const targetModulesDir: string = path.join(execDir, 'node_modules');
      await fs.promises.mkdir(targetModulesDir, { recursive: true });

      // Validate packages against preinstalled directory
      const availablePackages: string[] = await fs.promises.readdir(nodeModulesDir);
      for (const pkg of packages) {
        if (!availablePackages.includes(pkg)) {
          console.log(`Unauthorized package requested: ${pkg}`);
          throw new Error(`Package ${pkg} not allowed`);
        }
        const srcPath: string = path.join(nodeModulesDir, pkg);
        const destPath: string = path.join(targetModulesDir, pkg);
        await fs.promises.cp(srcPath, destPath, { recursive: true });
      }
    }

    // Initialize database
    if (database) {
      if (database.type === 'mongodb') {
        dbInstance = await MongoMemoryServer.create();
        connectionString = dbInstance.getUri();
        if (database.testData) {
          const { MongoClient } = require('mongodb');
          const client = new MongoClient(connectionString);
          await client.connect();
          const db = client.db('test');
          await db.collection('data').insertMany(database.testData as MongoTestData[]);
          await client.close();
        }
      } else if (database.type === 'sqlite') {
        dbConnection = new sqlite3.Database(':memory:');
        connectionString = 'sqlite://:memory:';
        if (database.testData) {
          const testData = database.testData as DatabaseTestData;
          dbConnection.serialize(() => {
            if (testData.schema) {
              dbConnection!.run(testData.schema);
            }
            if (testData.rows) {
              testData.rows.forEach((row: string) => {
                dbConnection!.run(row);
              });
            }
          });
        }
      } else if (database.type === 'mysql') {
        // Use SQLite as a lightweight MySQL alternative
        dbConnection = new sqlite3.Database(':memory:');
        connectionString = 'mysql://localhost/test';
        if (database.testData) {
          const testData = database.testData as DatabaseTestData;
          dbConnection.serialize(() => {
            if (testData.schema) {
              dbConnection!.run(testData.schema);
            }
            if (testData.rows) {
              testData.rows.forEach((row: string) => {
                dbConnection!.run(row);
              });
            }
          });
        }
      } else {
        throw new Error(`Unsupported database type: ${database.type}`);
      }
    }

    // Execute test cases
    const results: TestResult[] = [];
    const mainFile: string = files.find((f) => 
      f.path === 'index.js' || 
      f.path === 'main.py' || 
      f.path.endsWith('.py')
    )?.path || files[0].path;

    for (const testCase of testCases) {
      try {
        if (language === 'javascript') {
          // Use isolated-vm for sandboxed execution
          const mainFileContent = files.find((f) => f.path === mainFile)?.content;
          if (!mainFileContent) {
            throw new Error(`Main file ${mainFile} not found`);
          }

          const testCode: string = injectTestCase(
            mainFileContent,
            testCase,
            language,
            connectionString
          );

          try {
            const result = await executeInIsolatedVM(testCode, execDir, packages || []);
            results.push({
              passed: testCaseEvaluator(result, testCase.expected),
              output: String(result),
              expected: testCase.expected,
              input: testCase.input,
              error: null,
            });
          } catch (err: any) {
            results.push({
              passed: false,
              output: null,
              expected: testCase.expected,
              input: testCase.input,
              error: err.message,
            });
          }
        } else if (language === 'python') {
          // Use spawn for Python
          const mainFileContent = files.find((f) => f.path === mainFile)?.content;
          if (!mainFileContent) {
            throw new Error(`Main file ${mainFile} not found`);
          }

          const testCode: string = injectTestCase(
            mainFileContent,
            testCase,
            language,
            connectionString
          );
          await fs.promises.writeFile(path.join(execDir, mainFile), testCode);

          const result: string = await runWithTimeout('python', [mainFile], 5000, execDir);
          results.push({
            passed: testCaseEvaluator(result, testCase.expected),
            output: result,
            expected: testCase.expected,
            input: testCase.input,
            error: null,
          });
        } else {
          throw new Error(`Unsupported language: ${language}`);
        }
      } catch (error: any) {
        results.push({
          passed: false,
          output: null,
          expected: testCase.expected,
          input: testCase.input,
          error: error.message,
        });
      }
    }

    return results;
  } catch (error: any) {
    throw new Error(`Execution failed: ${error.message}`);
  } finally {
    // Clean up database
    if (dbInstance) await dbInstance.stop();
    if (dbConnection) dbConnection.close();
    // Clean up execution directory
    try {
      await fs.promises.rm(execDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error('Error cleaning up temp directory:', cleanupError);
    }
  }
}

/**
 * Injects test case and database connection into the code
 */
function injectTestCase(
  code: string, 
  testCase: TestCase, 
  language: SupportedLanguage, 
  connectionString: string
): string {
  if (language === 'javascript') {
    return `
${code}

// Test case runner
(function() {
  try {
    const result = solution(${JSON.stringify(testCase.input)}, ${JSON.stringify(connectionString)});
    return result;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
})();`;
  } else if (language === 'python') {
    return `
${code}

# Test case runner
try:
    import json
    result = solution(${JSON.stringify(testCase.input)}, ${JSON.stringify(connectionString)})
    print(json.dumps(result))
except Exception as e:
    print(str(e))
    exit(1)`;
  }
  throw new Error(`Unsupported language: ${language}`);
}

/**
 * Run a command with timeout
 */
function runWithTimeout(
  command: string, 
  args: string[], 
  timeout: number, 
  cwd: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const process: ChildProcess = spawn(command, args, { cwd });
    let output: string = '';
    let errorOutput: string = '';

    const timer = setTimeout(() => {
      process.kill();
      reject(new Error('Execution timed out'));
    }, timeout);

    process.stdout?.on('data', (data: Buffer) => {
      output += data.toString();
    });

    process.stderr?.on('data', (data: Buffer) => {
      errorOutput += data.toString();
    });

    process.on('close', (code: number | null) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(errorOutput || 'Execution failed'));
      }
    });
  });
}

/**
 * Evaluate if the test case passed
 */
function testCaseEvaluator(actual: any, expected: any): boolean {
  try {
    const parsedActual = JSON.parse(actual);
    return JSON.stringify(parsedActual) === JSON.stringify(expected);
  } catch (error) {
    return actual.trim() === expected.toString().trim();
  }
}

export { executeCode };
export type { 
  ExecuteCodeParams, 
  TestResult, 
  FileInput, 
  TestCase, 
  DatabaseConfig,
  SupportedLanguage,
  SupportedDatabase
};