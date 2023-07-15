import {
  AttachmentBuilder,
CacheType,
CommandInteraction,
CommandInteractionOption,
EmbedBuilder,
} from 'discord.js';

import { v4 as uuidv4 } from 'uuid';

import { Gameskin, Skin, SkinWeapon, createSkinOverview } from 'teeworlds-utilities';

import { WeaponGameSkinPart } from 'teeworlds-utilities/build/main/asset/part';
import { ParsedOptions } from '../utils/commandOptions';
import configSkin from './configSkin';

export const defaultGameskin = 'data/0_6.png';

export interface ISkinInteraction {
  path: string;

  load: () => Promise<boolean>;
  process: () => Promise<void>;
  send: () => Promise<void>;
}

abstract class AbstractSkinInteraction implements ISkinInteraction {
  protected interaction: CommandInteraction<CacheType>;
  protected options: ParsedOptions;
  protected subCommand: CommandInteractionOption<CacheType>;

  protected skin: Skin;
  
  isCrop: boolean;
  path: string;
  
  constructor() {
    this.path = uuidv4() + '.png';

    this.skin = new Skin();
  }
  
  setInteraction(value: CommandInteraction<CacheType>): this {
    this.interaction = value;
    
    return this;
  }
  
  setSubCommand(value: CommandInteractionOption<CacheType>): this {
    this.subCommand = value;
    
    return this;
  }
  
  setOptions(value: ParsedOptions): this {
    this.options = value;
    
    return this;
  }

  async load(): Promise<boolean> {
    // Set the skin
    try {
      this.skin = await configSkin(
        this.options,
        this.subCommand.name === 'color'
      );
    } catch (error) {
        return false;
      }
    
    // Set the skin url
    this.skin.setName(this.options.image.url);

    return true;
  }

  async process() {}
  async send() {}
}

export class SkinInteraction extends AbstractSkinInteraction {
  private skinWeapon: SkinWeapon;
  
  protected gameskin: Gameskin;
  protected hasWeapon: boolean;

  constructor() {
    super()

    this.gameskin = new Gameskin();
    this.skinWeapon = new SkinWeapon();
    this.hasWeapon = false;
  }

  private async configGameskin(): Promise<boolean> {
    // Check for weapon
    if (this.options.weapon) {
      this.skinWeapon.setWeapon(
        this.options.weapon as WeaponGameSkinPart
      );
    
      this.hasWeapon = true;
    }

    // Check for custom gameskin
    const path = this.options.gameskin
      ? this.options.gameskin.url
      : defaultGameskin;
  
    try {
      await this.gameskin.load(path);
    } catch (error) {
      return false
    }

    this.gameskin.setName(path);

    return true;
  }

  async load(): Promise<boolean> {
    // Set the skin and its url
    if (await super.load() === false) {
      return false;
    }
    
    // Set the gameskin
    if (await this.configGameskin() === false) {
      return false;
    }
  
    if (this.hasWeapon === true) {
      this.skinWeapon
        .setSkin(this.skin)
        .setGameskin(this.gameskin);
    }
    
    this.isCrop = this.options.crop || false;
    
    return true;
  }

  async process() {
    if (this.hasWeapon === true) {
      this.skinWeapon
        .process()
        .saveAs(this.path, this.isCrop);
    } else {
      this.skin
        .render()
        .saveRenderAs(this.path, this.isCrop);
    }
  }

  async send() {
    const attachment = new AttachmentBuilder(this.path);
    const url = this.options.image.url;

    const embed = new EmbedBuilder()
      .setURL(url)
      .setImage('attachment://' + this.path)
      .setColor(0x2b2d31);
    
    const skinUrl = this.skin.metadata.name;
    const gamekinUrl = this.gameskin.metadata.name;

    embed.addFields(
      {
        name: 'Skin',
        value: `[link](${skinUrl})`,
        inline: true
      }
    );
    
    if (
      this.hasWeapon === true &&
      this.gameskin.metadata.name !== defaultGameskin
    ) {
      embed.addFields([
        {
          name: 'Gameskin',
          value: `[link](${gamekinUrl})`,
          inline: true
        }
      ])
    }
  
    await this.interaction.followUp(
      {
        embeds: [ embed ],
        files: [ attachment ]
      }
    );
  }
}

export class BoardInteraction extends SkinInteraction {
  constructor() {
    super();
  }

  async load(): Promise<boolean> {
    if (await super.load() === false) {
      return false;
    }

    this.hasWeapon = true;
    
    return true
  }

  async process() {
    createSkinOverview(
      this.skin,
      this.gameskin,
      this.options.amount || 5
    )
    .saveAs(
      this.path,
      this.isCrop
    );
  }
}