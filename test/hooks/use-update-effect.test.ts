import { renderHook } from "@testing-library/react";
import { useUpdateEffect } from "@hooks/use-update-effect";

describe("Hooks: useUpdateEffect", () => {
  it("run effect on update", () => {
    const fn = vi.fn();
    const { rerender } = renderHook(() => useUpdateEffect(fn));

    expect(fn).not.toHaveBeenCalled();

    rerender();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("run function on unmount", () => {
    const unmountFn = vi.fn();
    const fn = vi.fn().mockReturnValue(unmountFn);
    const { rerender, unmount } = renderHook(() => useUpdateEffect(fn));

    rerender();
    unmount();

    expect(unmountFn).toHaveBeenCalledTimes(1);
  });
});
