import BaseModel from '@/models/base-model';
import AccountDto from '@/data-transfer-objects/models/account-dto';

class Accounts extends BaseModel {
  protected getTableName(): string {
    return 'accounts';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }

  protected getDto(): AccountDto {
    return new AccountDto();
  }
}

export default Accounts;
