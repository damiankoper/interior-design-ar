export interface IdObject {
  getName(): string;
  getDescription(): string;

  load(): void;
  purge(): void;
  getModel(): THREE.Group;
}
