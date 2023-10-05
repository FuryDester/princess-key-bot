import BaseListener from '@/listeners/base-listener';
import HelpCommandListener from '@/listeners/help-command-listener';
import RegCommandListener from '@/listeners/reg-command-listener';
import DelCommandListener from '@/listeners/del-command-listener';

export default [
  new HelpCommandListener(),
  new RegCommandListener(),
  new DelCommandListener(),
] as BaseListener[];