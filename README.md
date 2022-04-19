# Installation

Install by npm:

```shell
npm install --save @do-while-for-each/provider
```

or install with yarn:

```shell
yarn add @do-while-for-each/provider
```

# Registration of entries

Before getting a value from a provider, you need to register entries in it.  
The requested value directly depends on the type of registered entry:

```
Entry result types:

 1. Value creator:
     class-instance = { provide, useClass?, deps?, multi? }
     factory-result = { provide, useFactory, deps?, multi? }

 2. Ready value:
    { provide, useValue, multi? }
```

## Manual registration

You can use the default provider:

```typescript
import {provider} from '@do-while-for-each/provider';

provider.register(
  {provide: Turkey},
  {provide: Duck, useValue: 123},
);
```

or create a new one:

```typescript
import {Provider} from '@do-while-for-each/provider';

const provider = Provider.of([
  {provide: Turkey, useClass: Turkey},
  {provide: Duck, useValue: new Duck()},
]);

// or

const provider = new Provider('custom-provider#1');
provider.register(
  {provide: Duck, useClass: Turkey},
  {provide: 'Birds', useValue: new Duck(), multi: true},
);
```

## Automatic registration

Automatic registration of entries in the provider is possible under the following conditions:

1. TypeScript is required;
2. You need to enable settings in tsconfig.json: [experimentalDecorators](https://www.typescriptlang.org/tsconfig#experimentalDecorators) and [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata);
3. In the index file of your project, you need to import:

```typescript
import "reflect-metadata";
```

You don't need to install the package `reflect-metadata`, it's already in dependencies.

4. Place the appropriate decorators in the appropriate places of the class.

### Decorators

1. `@injectable()` - placed above the class. When value requested from the provider, it will create a new instance every time. Accepts the setting: `@injectable({isOnlyOne: true})` - when value requested from the provider, it will return the same instance;
2. `@single` - this is a short analog of `@injectable({isOnlyOne: true})`;
3. `@inject(provide)` - can set or override the constructor parameter of the class.

```typescript
import {inject, injectable, single} from '@do-while-for-each/provider';

@injectable()
class A1 {
  constructor() {
  }
}

@single
class A2 {
  constructor(public id = 90,
              public a1: A1,
              @inject('Alex') public name = 'Naruto',
              public type: boolean) {
  }
}
```

# Getting values from the provider

If you are sure that the provider should return one existing value, then:

```typescript
const duck = provider.get<Duck>(Duck);
```

Otherwise, it is better to use:

```typescript
const birds = provider.getAll('Birds') as Array<any>;
```

# Normal use examples

## Class instance provided

```
{provide: Duck}
{provide: Duck, useClass: Duck}
{provide: Duck, useClass: Duck, deps: ['quack!']}
{provide: Turkey, useClass: Duck, deps: ['ololo!']}
```

## Factory result provided

```
{provide: "lang", useFactory: (user: User) => user?.lang || 'en', deps: [User]}
```

## Value provided

```
{provide: Duck, useValue: 123}
{provide: Turkey, useClass: Turkey, deps: ['ololo!'], useValue: 123}
```

## Multiple provided

```
{provide: "Bird", useClass: Duck, multi: true}
{provide: "Bird", useClass: Turkey, multi: true}
{provide: "Bird", useValue: 'Eagle', multi: true}
```

## Single value

You should use the entry `{ provide, useValue, multi? }` to manually register a single value, e.g.:

```typescript
provider.register({provide: Duck, useValue: new Duck()});
```

Or use a `@single` decorator, e.g.:

```typescript
@single  // or @injectable({isOnlyOne: true})
class Duck {
  constructor(public sound = 'quack!') {
  }
}
```

In both cases, you will always get the same value from the provider:

```typescript
const obj = provider.get<Duck>(Duck);
const obj2 = provider.get<Duck>(Duck);
expect(obj === obj2).toBe(true);
```

