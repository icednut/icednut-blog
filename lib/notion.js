import { Client, LogLevel } from "@notionhq/client";
import { Sema } from 'async-sema';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG
});

export const getTagCloud = (database) => {
  const tagContainer = {};

  if (!database) {
    return tagContainer;
  }

  const tags = database.flatMap((post) => post.properties.Tags.multi_select).map((tag) => tag.name);

  for (var tag of tags) {
    const tagCount = tagContainer[tag];
    var newTagCount;

    if (!tagCount) {
      newTagCount = 0;
    } else {
      newTagCount = tagCount;
    }

    tagContainer[tag] = newTagCount + 1;
  }

  return tagContainer;
};

export const getPostingDate = (page) => {
  if (!page.properties || !page.properties.Date || page.properties.Date.type != 'date' || !page.properties.Date.date || !page.properties.Date.date.start) {
    return 'unknown';
  }

  return new Date(page.properties.Date.date.start).toLocaleString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
};

const PREVIEW_LIMIT_COUNT = 5;
const getPostPreview = async (pageId) => {
  const blocks = await getBlocks(pageId);
  const filteredBlocks = blocks.filter((block) => block.type == "paragraph" || block.type == "heading_1" || block.type == "heading_2" || block.type == "heading_3");
  const previewLimit = filteredBlocks.length == 0 ? 0 : (
    filteredBlocks.length < 5 ? filteredBlocks.length : PREVIEW_LIMIT_COUNT
  );

  var previews = [];

  for (var i = 0; i < previewLimit; i++) {
    const blockType = filteredBlocks[i].type;
    const blockText = filteredBlocks[i][blockType].text[0];

    if (blockText && blockText['plain_text']) {
      previews.push(blockText['plain_text']);
    }
  }
  return previews;
};

export const getDatabase = async (databaseId) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  const database = response.results;
  const sema = new Sema(3, { capacity: database.length });

  await Promise.all(
    database
      .sort((post1, post2) => {
        const date1 = new Date(getPostingDate(post1));
        const date2 = new Date(getPostingDate(post2));

        if (date1 > date2) {
          return -1;
        } else if (date1 < date2) {
          return 1;
        } else {
          return 0;
        }
      })
      .map(async (post) => {
        await sema.acquire();
        post.previews = await getPostPreview(post.id);
        sema.release();
      })
  );

  return database.filter((post) => post.properties.Published.checkbox);
};

export const getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId) => {
  const blocks = [];
  let cursor;

  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
};
