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
