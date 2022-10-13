export type Func = (...args: any[]) => any;
export type SubscriptableFunction = Func & {
  subscribe: (callback: Func) => () => void;
};

export const key = Symbol("key");
