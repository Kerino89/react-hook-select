import { useState } from "react";
import { renderHook, act } from "@testing-library/react";
import { useSelect, getLabels, SelectOption, type UseSelectProps, type UseSelectGroupOption } from "../src";

const eventClick = (groupOptions: UseSelectGroupOption[], index: number, groupIndex = 0) => {
  const option = groupOptions[groupIndex].options[index].getOptionProps();

  option.onClick?.({} as React.MouseEvent<HTMLElement, MouseEvent>);
};

describe("useSelect", () => {
  const options: SelectOption[] = [
    { label: "Vienna", value: 1 },
    { label: "Bucharest", value: 2 },
    { label: "Bukhara", value: 3 },
    { label: "Havana", value: 4 },
  ];

  const initialProps: UseSelectProps = { value: options[0], options };

  it("return initialProps", () => {
    const { result } = renderHook((props) => useSelect(props), { initialProps });

    expect(result.current.state.selected).toEqual([initialProps.value]);
  });

  it("return new value", () => {
    const onChange = vi.fn();
    const newValue = { value: 2, label: "2" };
    const { result, rerender } = renderHook((props) => useSelect({ ...props, onChange }), { initialProps });

    expect(onChange).not.toHaveBeenCalled();

    rerender({ value: newValue });

    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.state.selected).toEqual([newValue]);
  });

  it.each([{ multiple: false }, { multiple: true }])("checking onChange (multiple: $multiple)", ({ multiple }) => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useSelect({ ...initialProps, value: undefined, multiple, onChange }));

    expect(onChange).not.toHaveBeenCalled();

    act(() => eventClick(result.current.groupOptions, 0));
    act(() => eventClick(result.current.groupOptions, 1));
    act(() => eventClick(result.current.groupOptions, 0));

    expect(onChange).toBeCalledTimes(3);
    expect(onChange.mock.lastCall[0]).toEqual(multiple ? [initialProps.options?.[1]] : initialProps.options?.[0]);
    expect(result.current.state.selected).toEqual(multiple ? [initialProps.options?.[1]] : [initialProps.options?.[0]]);
  });

  it.each([{ multiple: false }, { multiple: true }])(
    "external control is working (multiple: $multiple)",
    ({ multiple }) => {
      const onChangeMock = vi.fn();
      const newValue = { value: 2, label: "2" };

      const { result } = renderHook(() => {
        const [value, onChange] = useState(initialProps.value);

        return useSelect({
          value,
          multiple,
          options: [newValue],
          onChange(value) {
            onChange(value);
            onChangeMock(value);
          },
        });
      });

      expect(onChangeMock).not.toHaveBeenCalled();

      act(() => eventClick(result.current.groupOptions, 0));

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock.mock.lastCall[0]).toEqual(multiple ? [initialProps.value, newValue] : newValue);
      expect(result.current.state.selected).toEqual(multiple ? [initialProps.value, newValue] : [newValue]);
    },
  );

  it("sets selected when setting value null", () => {
    const { result, rerender } = renderHook((props) => useSelect(props), { initialProps });

    rerender({ value: null });
    expect(result.current.state.selected).toEqual([]);
  });

  it("sets selected when setting value undefined", () => {
    const { result, rerender } = renderHook((props) => useSelect(props), { initialProps });

    rerender({ value: undefined });
    expect(result.current.state.selected).toEqual([]);
  });

  it("checking the setSearchValue method", () => {
    const { result } = renderHook((props) => useSelect(props), { initialProps });

    expect(getLabels(result.current.groupOptions[0].options)).toEqual(getLabels(options));

    act(() => result.current.setSearchValue("Bu"));

    expect(getLabels(result.current.groupOptions[0].options)).toEqual(["Bucharest", "Bukhara"]);
  });

  it("checking the setSelected method", () => {
    const { result } = renderHook((props) => useSelect(props), { initialProps });
    const selected = [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
    ];

    act(() => result.current.setSelected(selected));

    expect(result.current.state.selected).toEqual(selected);
  });

  it("checking the addSelected method", () => {
    const { result } = renderHook((props) => useSelect(props), { initialProps });
    const newSelected = { value: 2, label: "2" };

    act(() => result.current.addSelected(newSelected));

    expect(result.current.state.selected).toEqual([initialProps.value, newSelected]);
  });

  it("checking the removeSelected method", () => {
    const { result } = renderHook((props) => useSelect(props), { initialProps });
    const selected = [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
    ];

    act(() => {
      result.current.setSelected(selected);
      result.current.removeSelected(1);
    });

    expect(result.current.state.selected).toEqual([selected[1]]);

    act(() => result.current.removeSelected(selected[1]));

    expect(result.current.state.selected).toEqual([]);
  });

  it("checking the showOptions and hideOptions method", () => {
    const { result } = renderHook((props) => useSelect(props), { initialProps });

    act(() => result.current.showOptions());

    expect(result.current.state.isOpen).toBeTruthy();

    act(() => result.current.hideOptions());

    expect(result.current.state.isOpen).toBeFalsy();
  });
});
