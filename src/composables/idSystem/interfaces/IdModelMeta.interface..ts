export interface IdModelMeta {
  id: string;
  name: string | null;
  type: string | null;
  description: string | null;
  castsShadow: boolean;
  vertical: boolean;
  extendedMetaPath: string;
  thumbnailPath: string;
  webGlModelPath: string;
}
