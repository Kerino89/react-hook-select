import { useEffect, useMemo, useCallback, useReducer, useRef } from "react";
import { useOnClickOutside } from "@hooks/use-on-click-outside";
import { useUpdateEffect } from "@hooks/use-update-effect";
import { usePrevious } from "@hooks/use-previous";
import { isEqual } from "@helpers/is-equal";
import { isEmpty, isUndefined, isFunction, isNil } from "@helpers/type-guards";
import { UseSelectActionsTypes, INITIAL_STATE } from "./use-select.const";
import { getGroupOptions, filterOptions, filterGroupOptions, makePropGetter } from "./use-select.utils";
import { selectReducer } from "./use-select.reducer";

import type { RefObject, ChangeEvent } from "react";
import type {
  UseSelect,
  InputProps,
  SelectProps,
  SelectValue,
  OptionsProps,
  GroupProps,
  GroupPropGetter,
  OptionProps,
  OptionPropGetter,
  OptionsPropGetter,
  ControlPropGetter,
  ControlProps,
  SelectOption,
  InputPropGetter,
  SelectPropGetter,
  UseSelectProps,
  SelectGroupOption,
  UseSelectGroupOption,
} from "./use-select.interface";

export const useSelect = ({
  value,
  options,
  multiple = false,
  isSearchable = false,
  onceClickOption = false,
  disabled = false,
  onChange,
}: UseSelectProps): UseSelect => {
  const [state, dispatch] = useReducer(selectReducer, {
    ...INITIAL_STATE,
    selected: isNil(value) ? [] : Array.isArray(value) ? value : [value],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLElement>(null);
  const optionsRef = useRef<HTMLElement>(null);

  const prevValue = usePrevious(value);
  const prevState = usePrevious(state);

  const isGroup = useMemo<boolean>(() => {
    if (!options?.length) return false;

    return "options" in options[0];
  }, [options]);

  const inputFocus = useCallback(() => {
    if (isSearchable && state.isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchable, state.isOpen]);

  const setSelected = useCallback((payload: SelectOption[]) => {
    dispatch({ type: UseSelectActionsTypes.SET_SELECTED, payload });
  }, []);

  const addSelected = useCallback((payload: SelectOption) => {
    dispatch({ type: UseSelectActionsTypes.ADD_SELECTED, payload });
  }, []);

  const removeSelected = useCallback((payload: SelectOption | SelectValue) => {
    dispatch({
      type: UseSelectActionsTypes.REMOVE_SELECTED,
      payload: (payload as SelectOption)?.value || (payload as SelectValue),
    });
  }, []);

  const showOptions = useCallback(() => {
    if (disabled) return void 0;

    dispatch({ type: UseSelectActionsTypes.OPEN_MENU });
  }, [disabled]);

  const hideOptions = useCallback(() => {
    dispatch({ type: UseSelectActionsTypes.CLOSE_MENU });
  }, []);

  const setSearchValue = useCallback((value: string) => {
    dispatch({ type: UseSelectActionsTypes.SET_SEARCH_VALUE, value });
  }, []);

  const handlerInputChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(target.value);
    },
    [setSearchValue],
  );

  const handleChangeOrSetSelected = useCallback(
    (selected: SelectOption[]) => {
      if (isFunction(onChange) && !isUndefined(value)) {
        onChange(multiple ? selected : selected[0]);
      } else {
        setSelected(selected);
      }
    },
    [value, multiple, onChange, setSelected],
  );

  const toggleOptions = useCallback(() => {
    if (state.isOpen) {
      hideOptions();
    } else {
      showOptions();
    }
  }, [state.isOpen, showOptions, hideOptions]);

  const filteredOptions = useMemo(() => {
    if (isEmpty(state.searchValue)) return void 0;

    if (isGroup) {
      return filterGroupOptions(options as SelectGroupOption[], state.searchValue);
    } else {
      return filterOptions(options as SelectOption[], state.searchValue);
    }
  }, [options, isGroup, state.searchValue]);

  const groupOptions = useMemo((): UseSelectGroupOption[] => {
    if (!options?.length) return [];

    return getGroupOptions(filteredOptions || options).map((group, i) => ({
      ...group,
      getGroupProps<E extends HTMLElement>(props?: GroupPropGetter<E>) {
        return makePropGetter<GroupProps<E>, GroupPropGetter<E>>(
          {
            key: `select-group-${i}`,
          },
          props,
        );
      },
      options: group.options.map((option, i) => {
        const isActive = state.selected.some(({ value }) => value === option.value);

        return {
          ...option,
          isActive,
          isDisabled: option.isDisabled ?? false,
          getOptionProps<E extends HTMLElement>(props?: OptionPropGetter<E>) {
            return makePropGetter<OptionProps<E>, OptionPropGetter<E>>(
              {
                key: `select-option-${i}`,
                onClick() {
                  if (option.isDisabled) return void 0;

                  const payload = { label: option.label, value: option.value };

                  if (multiple) {
                    if (!isActive) {
                      handleChangeOrSetSelected([...state.selected, payload]);
                    } else {
                      handleChangeOrSetSelected(state.selected.filter(({ value }) => value !== payload.value));
                    }

                    if (onceClickOption) hideOptions();
                  } else {
                    handleChangeOrSetSelected([payload]);
                    hideOptions();
                  }
                },
              },
              props,
            );
          },
        };
      }),
    }));
  }, [options, state.selected, filteredOptions, onceClickOption, multiple, hideOptions, handleChangeOrSetSelected]);

  const getInputProps = useCallback(
    (props?: InputPropGetter) => {
      return makePropGetter<InputProps, InputPropGetter>(
        {
          ref: inputRef,
          value: state.searchValue,
          onChange: handlerInputChange,
        },
        props,
      );
    },
    [handlerInputChange, state.searchValue],
  );

  const getSelectProps = useCallback(<E extends HTMLElement>(props?: SelectPropGetter<E>) => {
    return makePropGetter<SelectProps<E>, SelectPropGetter<E>>(
      {
        ref: selectRef as RefObject<E>,
      },
      props,
    );
  }, []);

  const getControlProps = useCallback(
    <E extends HTMLElement>(props?: ControlPropGetter<E>) => {
      return makePropGetter<ControlProps<E>, ControlPropGetter<E>>(
        {
          onClick: toggleOptions,
        },
        props,
      );
    },
    [toggleOptions],
  );

  const getOptionsProps = useCallback(
    <E extends HTMLElement>(props?: OptionsPropGetter<E>) => {
      return makePropGetter<OptionsProps<E>, OptionsPropGetter<E>>(
        {
          ref: optionsRef as RefObject<E>,
          onClick: inputFocus,
        },
        props,
      );
    },
    [inputFocus],
  );

  useEffect(inputFocus, [inputFocus]);

  useEffect(() => {
    if (disabled && state.isOpen) {
      hideOptions();
    }
  }, [disabled, state.isOpen, hideOptions]);

  useUpdateEffect(() => {
    if (isFunction(onChange) && isUndefined(value) && !isEqual(state.selected, prevState?.selected)) {
      onChange(multiple ? [...state.selected] : state.selected[0]);
    }
  }, [state.selected, prevState?.selected, value, onChange]);

  useEffect(() => {
    if (isNil(value) && !isNil(prevValue)) setSelected([]);
    if (isNil(value) || isEqual(value, prevValue)) return void 0;

    const newSelected = Array.isArray(value) ? value : [value];

    if (!isEqual(newSelected, state.selected)) {
      setSelected(newSelected);
    }
  }, [value, state.selected, prevValue, setSelected]);

  useOnClickOutside(selectRef, hideOptions, { disabled: !state.isOpen, ignoreRef: optionsRef });

  return {
    state,
    isGroup,
    selectRef,
    optionsRef,
    groupOptions,
    setSelected,
    addSelected,
    setSearchValue,
    removeSelected,
    showOptions,
    hideOptions,
    getInputProps,
    toggleOptions,
    getSelectProps,
    getControlProps,
    getOptionsProps,
  };
};
