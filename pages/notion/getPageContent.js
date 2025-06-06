import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  const { pageId } = req.query;

  if (!pageId) {
    return res.status(400).json({ error: "Missing pageId" });
  }

  try {
    const blocks = await notion.blocks.children.list({ block_id: pageId });

    const content = blocks.results.map(block => {
      if (block[block.type]?.rich_text) {
        return block[block.type].rich_text.map(rt => rt.plain_text).join("");
      }
      return "";
    }).join("\n");

    res.status(200).json({ content });
  } catch (error) {
    console.error(error.body || error.message);
    res.status(500).json({ error: "Failed to fetch Notion page" });
  }
}
