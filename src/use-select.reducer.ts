import { UseSelectActionsTypes, INITIAL_STATE } from "./use-select.const";
import type { UseSelectState, UseSelectActionTypes } from "./use-select.interface";

export const selectReducer = (state: UseSelectState = INITIAL_STATE, action: UseSelectActionTypes): UseSelectState => {
  switch (action.type) {
    case UseSelectActionsTypes.OPEN_MENU:
      return {
        ...state,
        isOpen: true,
      };

    case UseSelectActionsTypes.CLOSE_MENU:
      return {
        ...state,
        searchValue: "",
        isOpen: false,
      };

    case UseSelectActionsTypes.SET_SELECTED:
      return {
        ...state,
        selected: [...action.payload],
      };

    case UseSelectActionsTypes.ADD_SELECTED:
      return {
        ...state,
        selected: [...state.selected, action.payload],
      };

    case UseSelectActionsTypes.REMOVE_SELECTED:
      return {
        ...state,
        selected: state.selected.filter(({ value }) => value !== action.payload),
      };

    case UseSelectActionsTypes.SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.value,
      };

    case UseSelectActionsTypes.CLEAR_SEARCH_VALUE:
      return {
        ...state,
        searchValue: "",
      };

    default:
      return state;
  }
};
