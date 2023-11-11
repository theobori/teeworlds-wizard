import { ApplicationCommandOptionType } from 'discord.js';
import { EmoticonPart } from 'teeworlds-utilities';
import capitalize from './capitalize';

export const eyeArgument: any = {
  name: 'eyes',
  type: ApplicationCommandOptionType.String,
  required: false,
  description: 'The skin eyes state',
  choices: [
    {
      name: 'default',
      value: 'default_eye'
    },
    {
      name: 'pain',
      value: 'pain_eye'
    }, 
    {
      name: 'angry',
      value: 'angry_eye'
    },
    {
      name: 'blink',
      value: 'blink_eye'
    },
    {
      name: 'happy',
      value: 'happy_eye'
    },
    {
      name: 'cross',
      value: 'cross_eye'
    },
    {
      name: 'scary',
      value: 'scary_eye'
    }
  ]
};

export const weaponArgument: any = {
  name: 'weapon',
  type: ApplicationCommandOptionType.String,
  required: false,
  description: 'The tee weapon',
  choices: [
    {
      name: 'Hammer',
      value: 'hammer'
    }, 
    {
      name: 'Gun',
      value: 'gun'
    },
    {
      name: 'Shotgun',
      value: 'shotgun'
    },
    {
      name: 'Grenade',
      value: 'grenade'
    },
    {
      name: 'Laser',
      value: 'laser'
    }
  ]
};

export const colorModesArgument = {
  name: 'colormode',
  type: ApplicationCommandOptionType.String,
  description: 'The skin color mode',
  required: true,
  choices: [
    {
      name: 'RGB',
      value: 'rgb',
      
    }, 
    {
      name: 'HSL',
      value: 'hsl'
    },
    {
      name: 'Teeworlds code',
      value: 'code',
    }
  ]
};

export const assetKindArgument: any = {
  name: 'assetkind',
  type: ApplicationCommandOptionType.String,
  description: 'The asset kind',
  required: true,
  choices: [
    {
      name: 'Skin',
      value: 'skin',
    },
    {
      name: 'Gameskin',
      value: 'gameskin'
    },
    {
      name: 'Emoticon',
      value: 'emoticon',
    },
    {
      name: 'Particule',
      value: 'particule',
    },
  ]
};

function argumentFromEnum<T extends { [key: number]: string }>(e: T): any {
  let ret = []

  for (let [k, v] of Object.entries(e)) {
    ret.push(
      {
        'name': capitalize(k.toLowerCase()),
        'value': v
      }
    )
  }

  return ret
}

export const EmoticonPartArgument: any = {
  name: 'emoticonpart',
  type: ApplicationCommandOptionType.String,
  description: 'The emoticon part',
  required: false,
  choices: argumentFromEnum(EmoticonPart)
};
