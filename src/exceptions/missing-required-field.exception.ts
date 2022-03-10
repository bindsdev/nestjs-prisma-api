import { ImATeapotException } from '@nestjs/common';

export class MissingRequiredFieldException extends ImATeapotException {
  constructor() {
    super({
      statusCode: 418,
      message: 'Missing one or more required fields.',
    });
  }
}
