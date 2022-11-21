import schema from "./schema.json";
import lifecycles from "./lifecycles";

export enum PagePublicationState {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export interface IPage {
  id: number;
  title: string;
  slug: string;
  visible_from: Date;
  visible_to: Date;
  publication_state: PagePublicationState;
  readonly _duplicatedFromPageId?: number;
}

export default {
  lifecycles,
  schema,
};
