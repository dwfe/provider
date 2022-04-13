export interface ITemplateTest {
  provide?: any;
  useClass?: any;
  useFactory?: any;
  deps?: any;
  multi?: any;
  expected?: any;
}

export interface IValueTest {
  provide?: any;
  useValue?: any;
  deps?: any;
  multi?: any;
}
