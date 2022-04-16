import {describe} from '@jest/globals'
import {injectable} from '../../decorator'
import {IProviderMetadata, PROVIDER_METADATA_KEY} from '../../provider'

//region Support

@injectable()
class A {
  constructor() {
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

function metadata(target: any){
  return {
    design_paramtypes: Reflect.getMetadata('design:paramtypes', target), // https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata
    provider_metadata: Reflect.getMetadata(PROVIDER_METADATA_KEY, target),
  }
}

function checkMetadata(metadata: IProviderMetadata, testProvider: IProviderMetadata, test){
  expect(metadata).toHaveProperty('providerId', testProvider.providerId);
  expect(metadata).toHaveProperty('isOnlyOne', testProvider.isOnlyOne);
}

//endregion Support


describe('Decorator.injectable', () => {

  test('check', () => {
    const metaA = metadata(A);
  });

});
