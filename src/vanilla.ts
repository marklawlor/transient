import { Func, key, SubscriptableFunction } from "./types";

const listenerMap = new WeakMap<Function, Map<string, Set<Function>>>();

export function makeTransient(userFunction: Function, id = "") {
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
      child() {
        return makeTransient(
          fn,
          // We don't need a high precision uid
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
