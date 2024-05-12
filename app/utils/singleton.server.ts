// Borrowed/modified from https://github.com/jenseng/abuse-the-platform/blob/2993a7e846c95ace693ce61626fa072174c8d9c7/app/utils/singleton.ts

/**
 * Retrieves an existing singleton instance or creates a singleton instance of a value if not present.
 * @param singletonName - The name of the singleton.
 * @param singletonValueInitializer - A function that returns the value of the singleton.
 * @returns The singleton instance.
 */
export function getOrCreateSingleton<Value>(
  singletonName: string,
  singletonValueInitializer: () => Value,
): Value {
  // Access the global object and assign it to a variable called `globalObject`.
  const globalObject = global as any;
  // If the `__singletons` property does not exist on the `globalObject` object, create an empty object and assign it to `__singletons`.
  globalObject.__singletons ??= {};
  // If the `singletonName` property does not exist on the `__singletons` object, assign the result of calling the `singletonValueInitializer` function to `__singletons[singletonName]`.
  globalObject.__singletons[singletonName] ??= singletonValueInitializer();
  // Return the value stored in `__singletons[singletonName]`.
  return globalObject.__singletons[singletonName];
}
