import {
  AttachmentBuilder,
CacheType,
CommandInteraction,
CommandInteractionOption,
EmbedBuilder,
} from 'discord.js';

import { v4 as uuidv4 } from 'uuid';

import { Emoticon, Gameskin, Skin, SkinFull, createSkinOverview } from 'teeworlds-utilities';

import { ParsedOptions } from '../utils/commandOptions';
import configSkin from './configSkin';
import { WeaponGameSkinPart } from 'teeworlds-utilities/build/main/asset/part';

export const defaultGameskin = 'data/0_6.png';
export const defaultEmoticon = 'data/emoticon.png';

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
  private skinWeapon: SkinFull;
  
  protected gameskin: Gameskin;
  protected hasWeapon: boolean;

  protected emoticon: Emoticon;
  protected hasEmoticon: boolean;

  constructor() {
    super()

    this.gameskin = new Gameskin();
    this.emoticon = new Emoticon();
    this.skinWeapon = new SkinFull();

    this.hasWeapon = false;
    this.hasEmoticon = false;
  }

  private async configGameskin(): Promise<boolean> {
    if (this.options.weapon) {
      this.skinWeapon.setWeapon(
        this.options.weapon as WeaponGameSkinPart
      );
    
      this.hasWeapon = true;
    }

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

  private async configEmoticon(): Promise<boolean> {
    if (this.options.emoticonpart) {
      this.skinWeapon.setEmoticonPart(
        this.options.emoticonpart
      );

      this.hasEmoticon = true;
    }

    const path = this.options.emoticon
      ? this.options.emoticon.url
      : defaultEmoticon;
  
    try {
      await this.emoticon.load(path);
    } catch (error) {
      return false
    }

    this.emoticon.setName(path);

    return true;
  }

  private async loadGameskin(): Promise<boolean> {
    if (await this.configGameskin() === false) {
      return false;
    }
  
    if (this.hasWeapon === true) {
      this.skinWeapon.setGameskin(this.gameskin);
    }

    return true;
  }

  private async loadEmoticon(): Promise<boolean>{
    if (await this.configEmoticon() === false) {
      return false;
    }
  
    if (this.hasEmoticon === true) {
      this.skinWeapon.setEmoticon(this.emoticon);
      this.skinWeapon.setGameskin(this.gameskin);
    }

    return true;
  }

  async load(): Promise<boolean> {
    // Set the skin and its url
    if (await super.load() === false) {
      return false;
    }

    this.skinWeapon.setSkin(this.skin);
    
    if (await this.loadGameskin() === false) {
      return false;
    }

    if (await this.loadEmoticon() === false) {
      return false;
    }

    this.isCrop = this.options.crop || false;
    
    return true;
  }

  async process() {
    if (this.hasWeapon === true || this.hasEmoticon === true) {
      this.skinWeapon
        .process()
        .saveAs(this.path, this.isCrop);
      
        return;
    }

    this.skin
      .render()
      .saveRenderAs(this.path, this.isCrop);
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
    const emoticonUrl = this.emoticon.metadata.name;

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

    if (
      this.hasEmoticon === true &&
      this.emoticon.metadata.name !== defaultEmoticon
    ) {
      embed.addFields([
        {
          name: 'Emoticon',
          value: `[link](${emoticonUrl})`,
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
