import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  const { pageId } = req.query;

  if (!pageId) {
    return res.status(400).json({ error: "Missing pageId" });
  }

  try {
    const blocks = await notion.blocks.children.list({ block_id: pageId });

    const content = blocks.results
      .map(block => {
        const rich = block[block.type]?.rich_text;
        return rich?.map(t => t.plain_text).join("") || "";
      })
      .filter(Boolean)
      .join("\n");

    res.status(200).json({ content });
  } catch (err) {
    console.error("Error fetching Notion page:", err);
    res.status(500).json({ error: "Failed to fetch Notion page" });
  }
}
