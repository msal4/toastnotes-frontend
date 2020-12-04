import { Base } from "./base";

export interface Note extends Base {
  title: string;
}

export interface NoteContent extends Note {
  content: string;
}
