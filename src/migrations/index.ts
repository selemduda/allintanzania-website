import * as migration_20261028_131227_initial from './20261028_131227_initial';
import * as migration_20261028_132653_expert_chats_and_price_switch from './20261028_132653_expert_chats_and_price_switch';

export const migrations = [
  {
    up: migration_20261028_131227_initial.up,
    down: migration_20261028_131227_initial.down,
    name: '20261028_131227_initial',
  },
  {
    up: migration_20261028_132653_expert_chats_and_price_switch.up,
    down: migration_20261028_132653_expert_chats_and_price_switch.down,
    name: '20261028_132653_expert_chats_and_price_switch'
  },
];
