const action = Symbol("action");

type UserFunction = (...args: any[]) => any
type ActionFunction = UserFunction & { [action]: true };

export interface UseTriggerOptions {
  timeout?: number;
}

function isAction(fn: UserFunction | ActionFunction): fn is ActionFunction {
  return action in fn
}

export function useTrigger<T extends UserFunction | ActionFunction>(
  userFunction: T,
  options: UseTriggerOptions = {}
) {
  if (isAction(userFunction)) {
    
  } else {
    return useTriggerUser(userFunction, options)
  }
}

function useTriggerUser(
  userFunction: UserFunction
  { timeout = 0 }: UseTriggerOptions = {}
) {
  return (...args: unknown[]


}
