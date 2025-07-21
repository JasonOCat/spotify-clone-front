export type StatusNotification = 'OK' | 'ERROR' | 'INIT';

export class State<T, V> {
  isProcessing: boolean = false;
  value?: T;
  error?: V;
  status: StatusNotification;

  constructor(isProcessing: boolean, status: StatusNotification, value?: T, error?: V) {
    this.isProcessing = isProcessing;
    this.status = status;
    this.value = value;
    this.error = error;
  }

  static onInit<T, V>(): State<T, V> {
    return new State(false, 'INIT', undefined as T, undefined as V);
  }

  static setProcessing<T,V>(previousState: State<T, V>, isProcessing: boolean): State<T, V> {
    return new State(isProcessing, previousState.status, previousState.value, previousState.error);
  }

  static onSuccess<T, V>(previousState: State<T, V>, newValue: T): State<T, V> {
    return new State(previousState.isProcessing, 'OK', newValue, undefined as V);
  }

  static onInitAndSuccess<T, V>(newValue: T): State<T, V> {
    return new State(false, 'OK', newValue, undefined as V);
  }

  static onError<T, V>(previousState: State<T, V>, error: V): State<T, V> {
    return new State(previousState.isProcessing, 'ERROR', undefined as T, error);
  }

  static onInitAndError<T, V>(error: V): State<T, V> {
    return new State(false, 'ERROR', undefined as T, error);
  }
}

