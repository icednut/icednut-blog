package io.icednut.space.service.notion

import cats.effect.IO

class NotionClientTest extends org.scalatest.funsuite.AnyFunSuite {

  test("Notion API를 이용하여 database를 얻어올 수 있어야 한다") {
    val notionClient = NotionClient[IO]

    notionClient.getDatabase("TEST_DATABASE_ID")
  }
}
