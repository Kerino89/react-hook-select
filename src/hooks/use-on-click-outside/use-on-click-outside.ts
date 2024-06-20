import { useEffect, useRef } from "react";
import { hasIgnoreElement } from "./use-on-click-outside.utils";

import type { RefObject } from "react";
import type { Handler, AnyEvent, Options, EventType } from "./use-on-click-outside.interface";

const defaultEventTypes: EventType[] = ["mousedown", "touchstart"];

export const useOnClickOutside = <R extends HTMLElement = HTMLElement>(
  ref: RefObject<R>,
  handler: Handler,
  { disabled, eventTypes = defaultEventTypes, ignoreRef }: Options = {},
): void => {
  const savedHandler = useRef<Handler>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (disabled || !handler) {
      return void 0;
    }

    const eventListener = (event: AnyEvent) => {
      const el = ref?.current;

      if (
        !el ||
        !savedHandler.current ||
        hasIgnoreElement(event.target as Node, ignoreRef?.current) ||
        el.contains(event.target as Node)
      ) {
        return void 0;
      }

      savedHandler.current(event);
    };

    eventTypes.forEach((type) => {
      document.addEventListener(type, eventListener);
    });

    return () => {
      eventTypes.forEach((type) => {
        document.removeEventListener(type, eventListener);
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, !handler, disabled, JSON.stringify(eventTypes)]);
};
