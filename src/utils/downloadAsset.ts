import axios from "axios";

export default async function downloadAsset(
  url: string
): Promise<Uint8Array | null> {
  try {
    const req = await axios.get(url);

    if (req.status !== 200) {
      return null;
    }

    return req.data;
  } catch (error) {
    return null;
  }
}
