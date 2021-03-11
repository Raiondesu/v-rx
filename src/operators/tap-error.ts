import { createErrorOperator } from './error-utils';

export const tapError = createErrorOperator((e, $, cb) => (cb(e, $), e));
