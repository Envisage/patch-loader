const fs = require('fs');
const path = require('path');
const JsDiff = require('diff');
const loaderUtils = require('loader-utils');

module.exports = function loader(content) {
   const options = loaderUtils.getOptions(this) || {};

   if (!options.patch) {
      throw new Error('Option `patch` required');
   }

   const patchPath = path.resolve(this.context, options.patch);
   this.addDependency(patchPath);

   const patchData = fs.readFileSync(patchPath, 'utf8');
   const patch = JsDiff.parsePatch(patchData);

   if (Array.isArray(patch) && patch.length > 0 && patch[0].hunks.length > 0) {
      const result = JsDiff.applyPatch(content, patch);
      if (!result) {
         throw new Error('Patch could not apply cleanly');
      }

      return `module.exports = ${result}`;
   } else {
      throw new Error('Invalid patch file format');
   }
}
