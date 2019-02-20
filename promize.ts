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

interface Handler {
  cb: Function;
  promise: Promize;
}

class Promize {
  succHandlers: Handler[];
  errHandlers: Handler[];
  settled: boolean;
  value: any;
  constructor(public executor: (resolve: Function, reject: Function) => void) {
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

  settle() {
    const handlers: Handler[] = this.settled
      ? this.succHandlers
      : this.errHandlers;
    while (handlers.length) {
      const { promise, cb }: Handler = handlers.shift();
      const result: any = cb(this.value);

      //if cb returns a promise...
      if (result instanceof Promize) {
        //wait for promise to resolve
        result.then(val => {
          promise.resolve(val);
        });
      } else {
        promise.resolve(result);
      }
    }
  }

  resolve(val: any) {
    this.value = val;
    this.settled = true;

    this.settle();
  }

  then(cb: Function) {
    const promise = new Promize(() => {});
    const handler = {
      promise,
      cb
    };
    this.succHandlers.push(handler);
    return handler.promise;
  }

  reject(val: any) {}
}

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
