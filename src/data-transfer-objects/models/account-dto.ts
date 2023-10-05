import Lokiable from '@/data-transfer-objects/lokiable';

class AccountDto extends Lokiable {
  id: number;

  chat_id: number;

  disabled: boolean;

  activated_promos: string[];

  error_promos: string[];
}

export default AccountDto;
