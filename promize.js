/*
  Promize

  type Executor = (resolve: (val) => void, reject: (val) => void) => void;

  type PromizeInterface {
    constructor: (executor: Executor) => void;
    resolve: (val: any) => void;
    reject: (val: any) => void;
    then: ((...args: any[]) => val: any) => Promize;
    catch: ((...args: any[]) => val: any) => Promize | void;
    settle?: () => void;
  }

  class Promize implements PromizeInterface;

  Promize is just our really mediocre implementation of promises. It differs in some ways to make things easier for you all.

  1. No special utilities, e.g. .race and/or .all
  2. .catch propogates promises downwards still, dont worry about fully implementing catches actual behavior.

  Im leaving the skeleton of the implementation here so that you can all see what it should SOMEWHAT look like. That being said, feel free to dump the skeleton and write something entirely on your own!

  I made a pretty thorough testing suite, I would use that as your guidelines for the expectations.

  Running the tests without implementing some of these things will cause the tests to go very slowly.
*/
var Promize = /** @class */ (function () {
    function Promize(executor) {
        this.executor = executor;
        this.then = this.then.bind(this);
        this.resolve = this.resolve.bind(this);
        this.settle = this.settle.bind(this);
        this.succHandlers = [];
        this.errHandlers = [];
        this.settled = false;
        this.value = null;
        //execute executor right off the bat
        executor(this.resolve, this.reject);
    }
    Promize.prototype.settle = function () {
        var handlers = this.settled
            ? this.succHandlers
            : this.errHandlers;
        var _loop_1 = function () {
            var _a = handlers.shift(), promise = _a.promise, cb = _a.cb;
            var result = cb(this_1.value);
            //if cb returns a promise...
            if (result instanceof Promize) {
                //wait for promise to resolve
                result.then(function (val) {
                    promise.resolve(val);
                });
            }
            else {
                promise.resolve(result);
            }
        };
        var this_1 = this;
        while (handlers.length) {
            _loop_1();
        }
    };
    Promize.prototype.resolve = function (val) {
        this.value = val;
        this.settled = true;
        this.settle();
    };
    Promize.prototype.then = function (cb) {
        var promise = new Promize(function () { });
        var handler = {
            promise: promise,
            cb: cb
        };
        this.succHandlers.push(handler);
        return handler.promise;
    };
    Promize.prototype.reject = function (val) { };
    return Promize;
}());
// class Promize {
//   constructor(executor) {
//     if (!executor) throw new Error("Whooops! No executor passed.");
//     this.resolve = this.resolve.bind(this);
//     this.reject = this.reject.bind(this);
//     this.then = this.then.bind(this);
//     this.settled = false;
//     this.value = null;
//     this.nextPromise = null;
//     this.callBacks = [];
//     executor(this.resolve, this.reject);
//   }
//   settle() {
//     while (this.callBacks.length) {
//       const cb = this.callBacks.shift();
//       const returnVal = cb(this.value);
//     }
//   }
//   resolve(val) {
//     this.settled = true;
//     this.value = val;
//     this.settle(val);
//   }
//   reject(val) {}
//   then(cb) {
//     this.callBacks.push(cb);
//     //definitely needs to return a promise
//     return this;
//   }
// }
module.exports = Promize;
