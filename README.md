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


