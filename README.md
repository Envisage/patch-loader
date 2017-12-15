# Patch Loader

Apply unified diff patches to a module. Why?

Reasons to use `patch-loader`:
* minor changes needed to dependency, changes unlikely to be accepted in PR
* bug fix applied to dependency temporarily while waiting for PR to be accepted

Reasons **not** to use `patch-loader`:
* patch file becomes too complex, create a fork
* too lazy to integrate changes upstream, be a good OSS citizen

## Install

`npm install patch-loader --save-dev`

## Usage

The intended usage is with the [inline](https://webpack.js.org/concepts/loaders/#inline)
syntax since it makes the most sense including the patch file in context of the
file it is patching. However I don't see any reason why that should be required.
There could be valid use cases for using the [module.rules](https://webpack.js.org/concepts/loaders/#configuration)
configuration.

Create your patch file:

```
[project/node_modules/foobar]$ cp source.js source.orig.js
[project/node_modules/foobar]$ # hack/test your changes to source.js
[project/node_modules/foobar]$ diff -u source.orig.js source.js >../../foobar.patch
[project/node_modules/foobar]$ mv source.orig.js source.js
```

Apply your patch on import/require:

```javascript
import 'patch-loader?patch=./foobar.patch!foobar';
// or
const foobar = require('patch-loader?patch=../../foobar.patch!foobar');
```

> **Note**: Patch file path is relative to the resource being patched.
> When requiring a module that defines its `main` entry in `package.json` as
> a file in a subdirectory of the modules directory, the relative path for
> your patch file should be relative to the directory containing the file,
> **not** relative to the modules directory.
