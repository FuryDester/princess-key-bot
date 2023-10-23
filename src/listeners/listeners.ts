import BaseListener from '@/listeners/base-listener';
import HelpCommandListener from '@/listeners/help-command-listener';
import RegCommandListener from '@/listeners/reg-command-listener';
import DelCommandListener from '@/listeners/del-command-listener';
import UcShortCommandListener from '@/listeners/uc-short-command-listener';
import UcCodeCommandListener from '@/listeners/uc-code-command-listener';
import CodeCommandListener from '@/listeners/code-command-listener';
import RepostCodeTextListener from '@/listeners/repost-code-text-listener';
import NewChatMemberListener from '@/listeners/new-chat-member-listener';

export default [
  new HelpCommandListener(),
  new RegCommandListener(),
  new DelCommandListener(),
  new UcShortCommandListener(),
  new UcCodeCommandListener(),
  new CodeCommandListener(),
  new RepostCodeTextListener(),
  new NewChatMemberListener(),
] as BaseListener[];