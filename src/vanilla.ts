import { Func, SubscriptableFunction } from "./types";

export const key = Symbol("key");

const listenerMap = new WeakMap<Function, Map<string, Set<Function>>>();

export interface Transient extends SubscriptableFunction {
  child: (id?: string) => Transient;
}

export function makeTransient(userFunction: Func, id = ""): Transient {
  const fn = Object.assign(
    (...args: unknown[]) => {
      const listeners = listenerMap.get(userFunction);
      if (listeners) {
        const tree = fn[key].split("_");
        while (tree.length) {
          const topic = tree.join("_");
          const topicListeners = listeners.get(topic);
          if (topicListeners) {
            for (const listener of topicListeners) {
              listener();
            }
          }

          tree.pop();
        }
      }

      return userFunction(...args);
    },
    {
      [key]: id,
      child(id?: string) {
        return makeTransient(
          fn,
          // We don't need a high precision uid
          id ??
            `${fn[key]}_${Date.now().toString(36)}${Math.random()
              .toString(36)
              .replace("0.", "")}`
        );
      },
      subscribe(callback: Function) {
        let userFunctionListeners = listenerMap.get(userFunction);

        if (!userFunctionListeners) {
          userFunctionListeners = new Map<string, Set<Function>>();
          listenerMap.set(userFunction, userFunctionListeners);
        }

        let topicListenerSet = userFunctionListeners.get(fn[key]);
        if (!topicListenerSet) {
          topicListenerSet = new Set<Function>();
          userFunctionListeners.set(fn[key], topicListenerSet);
        }

        topicListenerSet.add(callback);

        return () => {
          if (!topicListenerSet) return;
          topicListenerSet.delete(callback);

          if (topicListenerSet.size === 0) {
            listenerMap.delete(userFunction);
          }
        };
      },
    }
  );

  return fn;
}

export function triggerCallback(fn: SubscriptableFunction, callback: Func) {
  return fn.subscribe(callback);
}
