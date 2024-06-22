import { renderHook } from "@testing-library/react";
import { usePrevious } from "@hooks/use-previous";

describe("Hooks: usePrevious", () => {
  const hook = () => {
    return renderHook(({ state }) => usePrevious(state), { initialProps: { state: 0 } });
  };

  it("return undefined on initial", () => {
    const { result } = hook();

    expect(result.current).toBeUndefined();
  });

  it("return previous state after each update", () => {
    const { result, rerender } = hook();

    rerender({ state: 1 });
    expect(result.current).toBe(0);

    rerender({ state: 2 });
    expect(result.current).toBe(1);

    rerender({ state: 3 });
    expect(result.current).toBe(2);
  });
});
