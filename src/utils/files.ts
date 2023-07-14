import {
  statSync,
  readdirSync,
  writeFileSync,
  PathOrFileDescriptor,
  appendFileSync,
  unlinkSync,
  PathLike
} from 'fs';

import { join } from 'path';

export const dirs = {
  list: function(path: string): string[] {
    return readdirSync(path, { withFileTypes: true })
    	.filter(dirent => dirent.isDirectory())
    	.map(dirent => dirent.name);
  },
}

export const files = {
  list: function(path: string): string[] {
    return readdirSync(path);
  },

  listFileRecursive: function (dirPath: string, ret: string[] = []) {
    let stats;
    let files = this.list(dirPath).map(f => join(dirPath, f));

    for (let file of files) {
      stats = statSync(file);

      if (stats.isDirectory() === false) {
          ret.push(file);
      } else {
          this.listFileRecursive(file, ret);
      }
    }
    return (ret.map(name => name
      .replace(dirPath + '/', ''))
    );
  },

  write: function (path: PathOrFileDescriptor, data: string | Uint8Array) {
    writeFileSync(path, data);
  },

  delete: function(path: PathLike) {
    unlinkSync(path);
  },

  append(path: PathOrFileDescriptor, data: string) {
    appendFileSync(path, data);
  },

  getName(path: string): string {
    return path
      .split('/')
      .at(-1)
      .split(".")
      .at(0);
  }
}
