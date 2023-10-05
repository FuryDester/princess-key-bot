import MessageNewEventListener from '@/listeners/message-new-event-listener';
import BaseListener from '@/listeners/base-listener';

export default [
  new MessageNewEventListener(),
] as BaseListener[];
