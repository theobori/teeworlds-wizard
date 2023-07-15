import { ApplicationCommandOptionType } from "discord.js";

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
