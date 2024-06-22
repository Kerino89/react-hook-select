import { renderHook, act } from "@testing-library/react";
import { useSelect, UseSelectProps } from "../src";

describe("useSelect", () => {
  const initialProps: UseSelectProps = { value: { value: 1, label: "1" } };

  const hook = () => {
    return renderHook((props) => useSelect(props), { initialProps });
  };

  it("return initialProps", () => {
    const { result } = hook();

    expect(result.current.state.selected).toEqual([initialProps.value]);
  });

  it("return new value", () => {
    const newValue = { value: 2, label: "2" };
    const { result, rerender } = hook();

    rerender({ value: newValue });
    expect(result.current.state.selected).toEqual([newValue]);
  });

  it("sets selected when setting value null", () => {
    const { result, rerender } = hook();

    rerender({ value: null });
    expect(result.current.state.selected).toEqual([]);
  });

  it("sets selected when setting value undefined", () => {
    const { result, rerender } = hook();

    rerender({ value: undefined });
    expect(result.current.state.selected).toEqual([]);
  });

  it("checking the setSelected method", () => {
    const { result } = hook();
    const selected = [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
    ];

    act(() => {
      result.current.setSelected(selected);
    });

    expect(result.current.state.selected).toEqual(selected);
  });

  it("checking the addSelected method", () => {
    const { result } = hook();
    const selected = [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
    ];

    act(() => {
      result.current.addSelected(selected[1]);
    });

    expect(result.current.state.selected).toEqual(selected);
  });

  it("checking the removeSelected method", () => {
    const { result } = hook();
    const selected = [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
    ];

    act(() => {
      result.current.setSelected(selected);
      result.current.removeSelected(1);
    });

    expect(result.current.state.selected).toEqual([selected[1]]);

    act(() => {
      result.current.removeSelected(selected[1]);
    });

    expect(result.current.state.selected).toEqual([]);
  });

  it("checking the showOptions and hideOptions method", () => {
    const { result } = hook();

    act(() => {
      result.current.showOptions();
    });

    expect(result.current.state.isOpen).toBeTruthy();

    act(() => {
      result.current.hideOptions();
    });

    expect(result.current.state.isOpen).toBeFalsy();
  });
});
