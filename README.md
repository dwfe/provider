# Registration of entries

Before getting a value from a provider, you need to register entries in it.  
The resulting value directly depends on the type of registered entry:

```
Entry result types:

 1. Value creator:
     class-instance = { provide, useClass?, deps?, multi? }
     factory-result = { provide, useFactory?, deps?, multi? }

 2. Ready value:
    { provide, useValue, multi? }
```

## Manual registration

You can use the default provider:

```typescript
import {provider} from '@do-while-for-each/provider';

provider.register(
  {provide: Turkey, useClass: Turkey},
  {provide: Duck, useValue: new Duck()},
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

const provider = new Provider('my-provider#1');
provider.register(
  {provide: Turkey, useClass: Turkey},
  {provide: Duck, useValue: new Duck()},
);
```

## Automatic registration

Automatic registration is divided into 2 stages.

### Place decorators

The first step is to place the appropriate decorators in the appropriate places of the class:

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

Possible decorators:

1. `@injectable()` - placed above the class. When requested from the provider, it will create a new instance every time. Accepts the setting: `@injectable({isOnlyOne: true})` - when requested from the provider, it will return the same instance;
2. `@single` - this is a short analog of `@injectable({isOnlyOne: true})`;
3. `@inject(provide)` - is set at the constructor parameter of the class. Can set or override the parameter value.

### Request a value from the provider

It is at the moment of requesting a value that automatic registration of records is performed. It is done once on the first request.  
Registration is made in the provider from which the request is made.

# Getting values from the provider

## Normal use examples

### Class instance provided

```
{provide: Duck}
{provide: Duck, useClass: Duck}
{provide: Duck, useClass: Duck, deps: ['quack!']}
{provide: Turkey, useClass: Duck, deps: ['ololo!']}
```

### Factory result provided

```
{provide: "lang", useFactory: (user: User) => user?.lang || 'en', deps: [User]}
```

### Value provided

```
{provide: Duck, useValue: 123}
{provide: Turkey, useClass: Turkey, deps: ['ololo!'], useValue: 123}
```

### Multiple provided

```
{provide: "Bird", useClass: Duck, multi: true}
{provide: "Bird", useClass: Turkey, multi: true}
{provide: "Bird", useValue: 'Eagle', multi: true}
```

## Single value/instance

Registration:

```
const provider = new Provider();
provider.reg(
  {provide: User, useValue: 123, multi: true},
  {provide: User, deps: ['Tom'], useValue: 77, multi: true},
  {provide: User, deps: ['Tom', L10nService], useValue: 42, multi: true},
  {provide: User, deps: ['Tom', L10nService], useValue: 98, multi: true},
);
```

Now the registry contains the following entry:

```
User -> [
          {provide: User, useValue: 123, multi: true},
          {provide: User, deps: ['ru'], useValue: 77, multi: true},
          {provide: User, deps: [L10nService], useValue: 42, multi: true},
        ]
```

Getting a single value/instance:

```
provider.get(User) -> 123
provider.get(User) -> 123
```


