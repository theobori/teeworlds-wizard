export default function capitalize(src: string): string {
    return src.at(0).toUpperCase() + src.slice(1);
}
