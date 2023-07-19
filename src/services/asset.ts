import {
  Emoticon,
  Gameskin,
  IAsset,
  Particule,
  Skin
} from "teeworlds-utilities";
import { getAssetPartsMetadata } from "teeworlds-utilities/build/main/asset/part";
import { AssetError } from "../errors";

export const resolveAsset = (asset: string): IAsset => {
  let ret: IAsset;

  switch (asset) {
    case 'skin':
      ret = new Skin();
      break;

    case 'gameskin':
      ret = new Gameskin();
      break;

    case 'emoticon':
      ret = new Emoticon();
      break;

    case 'particule':
      ret = new Particule();
      break;

    default:
      throw new AssetError("Unauthorized asset kind");
  }

  return ret;
}

export const formatAssetParts = (e: any): string => {
  return Object
    .values(e)
    .join(' ');
}

export const resolvePartExpression = (expr: string, asset: IAsset): any[] => {
  const assetParts = getAssetPartsMetadata(asset.metadata.kind);

  const parts = expr.split(',');
  const uniqueParts = [...new Set(parts)];

  return uniqueParts
    .filter(
      uniquePart => Object.hasOwn(assetParts, uniquePart) === true
    )
}