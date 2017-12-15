import compiler from './compiler.js';

test('Apply patch success', async () => {
   const stats = await compiler('patch-loader?patch=./hello.patch!./hello.js');
   const output = stats.modules[0].source;
   expect(output).toBe("export default console.log('Hello, Patched World!');");
});

test('Apply patch failure', async () => {
   const stats = await compiler('patch-loader?patch=./hello.fail.patch!./hello.js');
   const output = stats.modules[0].source;
   expect(output).toMatch(/^throw new Error\("Module build failed: Error: Patch could not apply cleanly/);
});

test('Patch file not found', async () => {
   const stats = await compiler('patch-loader?patch=./missing.patch!./hello.js');
   const output = stats.modules[0].source;
   expect(output).toMatch(/^throw new Error\("Module build failed: Error: ENOENT/);
});

test('Invalid patch file', async () => {
   const stats = await compiler('patch-loader?patch=./invalid.patch!./hello.js');
   const output = stats.modules[0].source;
   expect(output).toMatch(/^throw new Error\("Module build failed: Error: Invalid patch file format/);
});
