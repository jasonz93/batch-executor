# batch-executor
[![npm](https://img.shields.io/npm/v/batch-executor.svg)](https://npm.taobao.org/package/batch-executor)
[![Build Status](https://travis-ci.org/jasonz93/batch-executor.svg?branch=master)](https://travis-ci.org/jasonz93/batch-executor)
[![Coverage Status](https://coveralls.io/repos/github/jasonz93/batch-executor/badge.svg?branch=master)](https://coveralls.io/github/jasonz93/batch-executor?branch=master)

A simple batch executor wrapped by event emitter.
It emit an `execute` event when it received object more than max count, or reached max interval time.

## Quick start
```javascript
const BatchExecutor = require('batch-executor');

var executor = new BatchExecutor();
executor.on('error', (err) => {
    console.error(err);
});
executor.on('execute', (batch, callback) => {
    // batch is an array contains your batch objects created by cloneDeep,
    // Just do whatever you want with it.
    // If an error occurs, just call callback(err);
    // Or you can ignore it
});

executor.batch({
    foo: 'bar'
});
```

## Usage
### Callbacks
```
onError(err)
```
```
onExecute(batch, [onError])
```

### Methods
```javascript
new BatchExecutor([maxCount = 200], [maxInterval = 5000]);
```

```javascript
executor.on('error', onError);
```

```javascript
executor.on('execute', onExecute);
```

```javascript
executor.batch(obj);
```