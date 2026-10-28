import * as migration_20261028_131227_initial from './20261028_131227_initial';
import * as migration_20261028_132653_expert_chats_and_price_switch from './20261028_132653_expert_chats_and_price_switch';
import * as migration_20261028_174041_norwegian_localization from './20261028_174041_norwegian_localization';
import * as migration_20261028_174834_enquiry_language from './20261028_174834_enquiry_language';

export const migrations = [
  {
    up: migration_20261028_131227_initial.up,
    down: migration_20261028_131227_initial.down,
    name: '20261028_131227_initial',
  },
  {
    up: migration_20261028_132653_expert_chats_and_price_switch.up,
    down: migration_20261028_132653_expert_chats_and_price_switch.down,
    name: '20261028_132653_expert_chats_and_price_switch',
  },
  {
    up: migration_20261028_174041_norwegian_localization.up,
    down: migration_20261028_174041_norwegian_localization.down,
    name: '20261028_174041_norwegian_localization',
  },
  {
    up: migration_20261028_174834_enquiry_language.up,
    down: migration_20261028_174834_enquiry_language.down,
    name: '20261028_174834_enquiry_language'
  },
];
