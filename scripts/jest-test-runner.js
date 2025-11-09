const { spawn } = require('child_process');
const path = require('path');

const normalizePathArgument = (value) => value.replace(/\\/g, '/');

const transformArgs = (args) => {
    const transformed = [];
    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i];
        if (arg === '--testPathPattern' && i + 1 < args.length) {
            transformed.push('--runTestsByPath');
            transformed.push(normalizePathArgument(args[i + 1]));
            i += 1;
        } else if (arg?.startsWith('--testPathPattern=')) {
            transformed.push('--runTestsByPath');
            transformed.push(
                normalizePathArgument(arg.split('=').slice(1).join('='))
            );
        } else {
            transformed.push(arg);
        }
    }

    return transformed;
};

const jestArgs = transformArgs(process.argv.slice(2));

const isWindows = process.platform === 'win32';
const command = isWindows ? 'npx.cmd' : 'npx';
const child = spawn(
    command,
    [
        'cross-env',
        'NODE_OPTIONS=--no-deprecation',
        'react-scripts',
        'test',
        ...jestArgs,
    ],
    {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..'),
        shell: isWindows,
    }
);

child.on('close', (code) => {
    process.exit(code ?? 0);
});
