import { ColorCode, ColorHSL, ColorRGB, EyeSkinPart, IColor, Skin, SkinPart } from "teeworlds-utilities";
import { ParsedOptions } from "../utils/commandOptions";
import { RGBTuple } from "discord.js";
import { FileError } from "../errors";

enum Color {
  RGB = 'rgb',
  HSL = 'hsl',
  TeeworldsCode = 'code'
}

const RGB_RE = new RegExp('(\\d+,\\d+,\\d+)');
const HSL_RE = RGB_RE;

function getChannels(color: string, re: RegExp): RGBTuple {
  if (re.test(color) === false) {
    throw new SyntaxError('Wrong color format');
  }

  const channels = color
    .split(',')
    .slice(0, 3)
    .map(byte => parseInt(byte));

  return channels as RGBTuple;
}

const rgbFromString = (color: string): ColorRGB => {
  return new ColorRGB(...getChannels(color, RGB_RE) as RGBTuple);
}

const hslFromString = (color: string): ColorHSL => {
  return new ColorHSL(...getChannels(color, HSL_RE) as RGBTuple);
}

const codeFromString = (color: string): ColorCode => {
  return new ColorCode(parseInt(color));
}

function colorFromString(
  color: string,
  colorKind: Color
): IColor {
  let func: Function;

  switch (colorKind) {
    case Color.RGB:
      func = rgbFromString;
      break;
    case Color.HSL:
      func = hslFromString;
      break;
    case Color.TeeworldsCode:
      func = codeFromString;
      break;
    default:
      break;
  }

  try {
    return func(color);
  } catch (error) {
    throw new SyntaxError(error.message);
  }
}

// There are some unsafe cast but,
// in the bot context, it cannot an unauthorized value.
export default async function configSkin(
  options: ParsedOptions,
  color: boolean
): Promise<Skin> {
  const skin = new Skin();

  try {
    await skin.load(options.image.url);
  } catch (error) {
    throw new FileError(error);
  }

  skin
    .setOrientation(options.orientation || 0)
    .setEyeAssetPart(
      options.eyes as EyeSkinPart||
      SkinPart.DEFAULT_EYE
    );

  if (color === false) {
    return skin;
  }

  const colorKind = options.colormode as Color;

  try {
    skin.colorTee(
      colorFromString(
        options.colorbody,
        colorKind
      ),
      colorFromString(
        options.colorfeet,
        colorKind
      ),
    );
  } catch (error) {
    throw new SyntaxError(error.message);
  }

  return skin;
}
