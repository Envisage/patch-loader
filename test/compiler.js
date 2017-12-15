import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture) => {
   const compiler = webpack({
      context: __dirname,
      entry: `./${fixture}`,
      output: {
         path: path.resolve(__dirname),
         filename: 'bundle.js',
      }
   });

   compiler.outputFileSystem = new memoryfs();

   return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
         resolve(stats.toJson());
      });
   });
}
