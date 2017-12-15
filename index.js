import fs from 'fs';
import path from 'path';
import { parsePatch, applyPatch } from 'diff';
import loaderUtils from 'loader-utils';

export default function loader(content) {
   const options = loaderUtils.getOptions(this) || {};

   if (!options.patch) {
      throw new Error('Option `patch` required');
   }

   const patchPath = path.resolve(this.context, options.patch);
   this.addDependency(patchPath);

   const patchData = fs.readFileSync(patchPath, 'utf8');
   const patch = parsePatch(patchData);

   if (Array.isArray(patch) && patch.length > 0 && patch[0].hunks.length > 0) {
      const result = applyPatch(content, patch);
      if (!result) {
         throw new Error('Patch could not apply cleanly');
      }

      return `export default ${result}`;
   } else {
      throw new Error('Invalid patch file format');
   }
}
