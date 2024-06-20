/* eslint-disable @typescript-eslint/no-explicit-any */

export const isUndefined = (arg: unknown): arg is undefined => arg === undefined;

export const isNull = (arg: unknown): arg is null => arg === null;

export const isNil = (arg: unknown): arg is null | undefined => isUndefined(arg) || isNull(arg);

export const isObject = (arg: unknown): arg is object => {
  return arg !== null && typeof arg === "object" && !Array.isArray(arg);
};

export const isFunction = (arg: unknown): arg is (...rest: any[]) => any => {
  return typeof arg === "function";
};

export const isEmpty = (arg: unknown): boolean => {
  return arg === null || !(Object.keys(arg as object) || arg).length;
};
