import {injectable} from '../../decorator'

@injectable()
export class A {
  constructor(private name: string) {
  }
}

@injectable()
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
