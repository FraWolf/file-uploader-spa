export interface File {
  fileId: string;
  name: string;
  original_name: string;
  fileType: "file" | "directory";
  nested?: string[]; // only populated if the type is "directory"
  inFolder: boolean;
  folderId: string | null;
  size: number;
  mime: string;
  extension: string;
  ownerId: string;
}
