import { ISimpleEvent } from "ste-simple-events";
import * as THREE from "three";

/** Internal representation of saved scene */
export interface SessionObject {
  /** IdModel id, e.g. SheenChair */
  id: string;
  /** Matrix representing pose of model (prop matrix of Object3D) */
  matrix: THREE.Matrix4Tuple;
}

// TODO: Create SessionService implementing this
export interface SessionPersistance {
  /**
   * Computed progress event of all async fetching initiated in getGroup method.
   * TODO(small refactor): Extract this prop to separate e.g. LoadProgress interface and implement here and in IdModel replacing `modelLoadProgress`. Readonly property can be implemented using getter `get xyz()`.
   */
  readonly loadProgress: ISimpleEvent<ProgressEvent>;

  /**
   * Saves scene as SessionObject[] in the localStorage.
   * NOTE: THREE.Scene extends THREE.Object3D and is simmilar to THREE.Group.
   * NOTE: It saves only direct children of passed group which have reference to IdModel.id via userData prop. Other children must be ignored.
   */
  saveGroup(group: THREE.Group & THREE.Object3D): Promise<void>;

  /**
   * Loads saved session from localStorage and fetches valid models.
   * Then it creates THREE.Group witch fetched models as its children.
   * The children have its matrices set from localStorage
   */
  getGroup(): Promise<THREE.Group>;
}
