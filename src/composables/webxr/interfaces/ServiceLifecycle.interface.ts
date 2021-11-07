export interface ServiceLifecycle {
  init(...args: unknown[]): Promise<void>;
  destroy(...args: unknown[]): Promise<void>;
}
