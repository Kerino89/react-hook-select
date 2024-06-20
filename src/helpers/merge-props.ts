import type { HTMLAttributes } from "react";

export type MergeSpread<T extends readonly unknown[]> = T extends [infer L, ...infer R] ? L & MergeSpread<R> : unknown;

export const mergeProps = <T extends readonly HTMLAttributes<HTMLElement>[]>(...props: T): MergeSpread<T> => {
  if (props.length === 1) {
    return props[0] as MergeSpread<T>;
  }

  return props.reduce((result, { className, style, ...restProps }) => {
    result = { ...result, ...restProps };

    if (style) {
      result.style = { ...result?.style, ...style };
    }

    if (className) {
      result.className = result.className ? `${result.className} ${className}` : className;
    }

    return result;
  }, {}) as MergeSpread<T>;
};
