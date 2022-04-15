import {L10nService} from './l10n.service';

export class User {
  lang: string;

  constructor(public l10nService?: L10nService,
              public name = 'Alex') {
    this.lang = l10nService?.lang || 'ru';
  }
}
