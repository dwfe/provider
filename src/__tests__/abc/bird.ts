export interface IBird {
  sound(): string;
}

export class Duck implements IBird {
  constructor(public message = 'quack!') {
  }

  sound() {
    return this.message;
  }
}

export class Turkey implements IBird {
  constructor(public message = 'ololo!') {
  }

  sound() {
    return this.message;
  }
}

export class BirdAviary {
  birds: IBird[];

  constructor(...birds: IBird[]) {
    this.birds = birds;
  }
}
