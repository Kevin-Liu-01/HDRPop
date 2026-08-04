declare module "heic2any" {
  type Options = {
    blob: Blob;
    toType?: string;
    quality?: number;
    multiple?: boolean;
  };

  export default function heic2any(options: Options): Promise<Blob | Blob[]>;
}
