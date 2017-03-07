/**
 * Created by nicholas on 17-3-7.
 */
'use strict';
const events = require('events');
const util = require('util');
const arguejs = require('arguejs');
const _ = require('lodash');

function clearTimer() {
    clearTimeout(this.$timer);
    this.$timer = null;
}

function timer() {
    if (!this.$timer) {
        let timeout = () => {
            this.$timer = setTimeout(() => {
                if (this.$batch.length > 0) {
                    commit.call(this);
                    timeout();
                } else {
                    clearTimer.call(this);
                }
            }, this.$maxInterval);
        };
        timeout();
    }
}

function commit() {
    let batch = _.cloneDeep(this.$batch);
    this.$batch = [];
    let cb = (err) => {
        if (err) {
            this.emit('error', err);
            batch.forEach((val) => {
                this.batch(val);
            });
        }
    };
    this.emit('execute', batch, cb);
    clearTimer.call(this);
}

function BatchExecutor(maxCount, maxInterval) {
    events.EventEmitter.apply(this);
    let args = arguejs({
        maxCount: [Number, 200],
        maxInterval: [Number, 5000]
    }, arguments);
    this.$maxCount = args.maxCount;
    this.$maxInterval = args.maxInterval;
    this.$batch = [];
}

util.inherits(BatchExecutor, events.EventEmitter);

BatchExecutor.prototype.batch = function (obj) {
    if (!(obj instanceof Array)) {
        obj = [obj];
    }
    obj.forEach((val) => {
        this.$batch.push(val);
    });
    if (this.$batch.length >= this.$maxCount) {
        commit.call(this);
    }
    timer.call(this);
};

module.exports = BatchExecutor;