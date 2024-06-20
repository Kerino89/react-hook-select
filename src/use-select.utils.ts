import { mergeProps } from "./helpers/merge-props";
import { isFunction } from "@helpers/type-guards";

import type { HTMLAttributes } from "react";

import type {
  PropGetter,
  SelectLabel,
  SelectValue,
  SelectOption,
  MergePropGetter,
  SelectGroupOption,
} from "./use-select.interface";

export const makePropGetter = <
  P extends HTMLAttributes<HTMLElement>,
  U extends PropGetter<HTMLAttributes<HTMLElement>>,
>(
  props: P,
  userProps: U = {} as U,
): MergePropGetter<P, U> => {
  if (isFunction(userProps)) {
    return makePropGetter({}, userProps(props)) as MergePropGetter<P, U>;
  }

  if (Array.isArray(userProps)) {
    return mergeProps(props, ...userProps) as MergePropGetter<P, U>;
  }

  return mergeProps(props, userProps as Record<string, unknown>) as MergePropGetter<P, U>;
};

export const flatOptions = (options: (SelectOption | SelectGroupOption)[]): SelectOption[] => {
  if (!options?.length) return [];

  if ("options" in options[0]) {
    const newOptions: SelectOption[] = [];

    (options as SelectGroupOption[]).forEach(({ options }) => {
      newOptions.push(...options);
    });

    return newOptions;
  } else {
    return options as SelectOption[];
  }
};

export const getGroupOptions = (options: (SelectOption | SelectGroupOption)[]): SelectGroupOption[] => {
  if (options.length && "options" in options[0]) {
    return options as SelectGroupOption[];
  }

  return [{ options }] as SelectGroupOption[];
};

export const filterOptions = (options: SelectOption[], value: string): SelectOption[] => {
  return options.filter(({ label }) => {
    return String(label).toLowerCase().includes(value.toLowerCase());
  });
};

export const filterGroupOptions = (options: SelectGroupOption[], value: string): SelectGroupOption[] => {
  const newOptions: SelectGroupOption[] = [];

  (options as SelectGroupOption[]).forEach(({ label, options }) => {
    const newFilteredOptions = filterOptions(options, value);

    if (newFilteredOptions.length) {
      newOptions.push({ label, options: newFilteredOptions });
    }
  });

  return newOptions;
};

export const getValues = (option: SelectOption | SelectOption[]): SelectValue[] => {
  if (Array.isArray(option)) return option.map(({ value }) => value);

  return [option.value];
};

export const getLabels = (option: SelectOption | SelectOption[]): SelectLabel[] => {
  if (Array.isArray(option)) return option.map(({ label }) => label);

  return [option.label];
};
