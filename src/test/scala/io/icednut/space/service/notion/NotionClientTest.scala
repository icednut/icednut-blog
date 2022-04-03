package io.icednut.space.service.notion

import cats.effect.IO
import cats.effect.testing.scalatest.AsyncIOSpec

class NotionClientTest extends AsyncIOSpec with org.scalatest.funsuite.AsyncFunSuiteLike {

  test("Notion API를 이용하여 database를 얻어올 수 있어야 한다") {
    val notionClient = NotionClient[IO]
    val resultIO = notionClient.getDatabase(notionToken = "TEST_NOTION_TOKEN", databaseId = "TEST_DATABASE_ID")

    resultIO.map(result => {
      assert(result == NotionDatabase(`object` = "list", hasMore = false, `type` = "page"))
    })
  }
}
