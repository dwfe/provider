import {injectable, single} from '../../decorator'

@injectable()
export class A {
  constructor(public name: string) {
  }
}

@single
export class B {
  constructor(public a: A) {
  }
}

@injectable()
export class C {
  constructor() {
  }
}

@injectable()
export class D {
  constructor(public b: B,
              public c: C) {
  }
}
