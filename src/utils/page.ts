export default class Page<T> {
  private contents: T[][] = [[]];
  index: number = 0;
  maxLines: number;

  constructor(maxLines: number = 10) {
    this.maxLines = maxLines;
  }

  setContents(contents: T[][]): this {
    this.contents = contents;    
    
    return this;
  }

  setMaxLines(maxLines: number): this {
    this.maxLines = maxLines;
    
    return this;
  }

  hasPrevious(): boolean {
    return this.index - 1 >= 0;
  }

  hasNext(): boolean {
    return this.index + 1 <= this.contents.length - 1;
  }

  previous(): this {
    if (this.hasPrevious() === false) {
      return this;
    }

    this.index -= 1;
    
    return this;
  }

  next(): this {
    if (this.hasNext() === false) {
      return this;
    }

    this.index += 1;
    
    return this;
  }

  get pageNumber(): number {
    return this.index + 1;
  }

  private getAsArray(content: T[] | T): T[] {
    if (Array.isArray(content) === false) {
      return [content as T];
    }

    return content as T[];
  }

  private addContentNewPage(content: T[] | T) {
    content = this.getAsArray(content);

    for (let i = 0; i < content.length; i += this.maxLines) {
      const data = content.slice(i, i + this.maxLines);

      this.contents.push(data);
    }
  }

  addContent(content: T[] | T): this {
    content = this.getAsArray(content);

    // Compute free space
    const lastcontent = this.contents[this.contents.length - 1];
    const freeSpace = this.maxLines - lastcontent.length;

    // Fill the free space
    for (let i = 0; i < freeSpace && content.length > 0; i++) {
      lastcontent.push(content.shift());
    }

    // Now it adds on new pages
    this.addContentNewPage(content);
    
    return this;
  }

  getContent(index: number): T[] {
    const maxIndex = this.contents.length - 1;

    if (index > maxIndex) {
      return this.contents[maxIndex];
    }

    return this.contents[index];
  }

  getCurrentContent(): T[] {
    return this.getContent(this.index);
  }

  get pageMax(): number {
    return this.contents.length;
  }
}
