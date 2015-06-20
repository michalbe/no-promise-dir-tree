# no-promise-dir-tree
Creates a JavaScript object representing the directory structure of a given path. Without `Promise`s.
Fork of [uniqname/dir-tree](git@github.com:uniqname/dir-tree.git).

# API

```
dirTree = require('dir-tree', cb);
```

Given a directory structure of the following

```
/demo/
  dir1/
    file1.txt
   dir2/
   dir3/
    file2.js
    file3.js
```

## Promises
dirTree returns a promise that resolves with the directory tree object.

```
dirTree('/demo', function (err, tree) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(tree);
});
```

The output of the above would be...

```
{
  'dir1': {
    'file1.txt': true,
    'dir2': {}
  },
  'dir3': {
    'file2.js': true
  },
  'file3.js': true
}
```
