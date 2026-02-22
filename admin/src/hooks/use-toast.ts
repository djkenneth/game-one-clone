import * as React from 'react';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 4000;

type ToastVariant = 'default' | 'destructive';

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
};

type State = {
  toasts: ToastProps[];
};

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | { type: 'ADD_TOAST'; toast: ToastProps }
  | { type: 'REMOVE_TOAST'; toastId: string };

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case 'REMOVE_TOAST':
      return { toasts: state.toasts.filter((t) => t.id !== action.toastId) };
  }
}

export function toast(props: Omit<ToastProps, 'id'>) {
  const id = genId();
  dispatch({ type: 'ADD_TOAST', toast: { ...props, id } });
  setTimeout(() => dispatch({ type: 'REMOVE_TOAST', toastId: id }), TOAST_REMOVE_DELAY);
  return id;
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { toasts: state.toasts, toast };
}
