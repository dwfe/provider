import {L10nService} from './l10n.service';

export class User {
  lang: string;

  constructor(public name = 'Alex',
              l10nService?: L10nService) {
    this.lang = l10nService?.lang || 'ru';
  }
}
