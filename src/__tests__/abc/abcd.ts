import {injectable} from '../../decorator'

@injectable()
export class A {
  constructor(private name: string) {
  }
}

@injectable()
class B {
  constructor(public a: A) {
  }
}

@injectable()
class C {
  constructor() {
  }
}

@injectable()
class D {
  constructor(public b: B,
              public c: C) {
  }
}
