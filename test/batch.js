/**
 * Created by nicholas on 17-3-7.
 */
const BatchExecutor = require('../');
const {expect} = require('chai');

describe('Test batch executor', () => {
    let mock = [];
    for (let i = 0; i < 50; i ++) {
        mock[i] = Math.random();
    }

    it('Test execute when maxCount reached', (done) => {
        let executor = new BatchExecutor(40);
        executor.on('execute', (batch, callback) => {
            expect(batch.length).to.be.equal(40);
            done();
        });
        mock.forEach((val) => {
            executor.batch(val);
        })
    });

    it('Test execute when maxInterval reached', function (done) {
        let startAt = new Date();
        let executor = new BatchExecutor(100, 500);
        executor.on('execute', (batch, callback) => {
            expect(batch).to.have.length.of(50);
            expect(new Date() - startAt).to.be.at.least(500);
            done();
        });
        executor.batch(mock);
    });

    it('Test execute when maxInterval after maxCount', (done) => {
        let startAt = new Date();
        let pointOne;
        let executor = new BatchExecutor(40, 500);
        executor.on('execute', (batch) => {
            if (!pointOne) {
                expect(batch).to.have.length.of(40);
                pointOne = new Date();
            } else {
                expect(batch).to.have.length.of(10);
                expect(new Date() - pointOne).to.be.at.least(500);
                expect(new Date() - startAt).to.be.at.least(700);
                done();
            }
        });
        executor.batch(mock.slice(0, 10));
        setTimeout(() => {
            executor.batch(mock.slice(0, 30));
            executor.batch(mock.slice(0, 10));
        }, 200);
    });

    it('Test retry', (done) => {
        let retried = false;
        let executor = new BatchExecutor(50);
        executor.on('execute', (batch, callback) => {
            if (!retried) {
                retried = true;
                callback(new Error());
            } else {
                expect(batch).to.have.length.of(50);
                done();
            }
        });
        executor.on('error', (err) => {
            expect(err).to.be.instanceof(Error);
        });
        executor.batch(mock);
    })
});