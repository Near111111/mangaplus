import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query } = req.query;

  try {
    const response = await fetch(
      `https://gomanga-api.vercel.app/api/search/${query}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");

    res.status(200).json(data);
  } catch (error) {
    console.error("Error searching manga:", error);
    res.status(500).json({ error: "Failed to search manga" });
  }
}
