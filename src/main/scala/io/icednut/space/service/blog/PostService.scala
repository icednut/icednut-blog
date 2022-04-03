package io.icednut.space.service.blog

import cats.effect.IO
import cats.effect.unsafe.implicits.*
import io.icednut.space.service.notion.{NotionClient, NotionDatabase}

import scala.scalajs.js
import scala.scalajs.js.Dictionary
import scala.scalajs.js.JSConverters.JSRichMap
import scala.scalajs.js.annotation.JSExportTopLevel

protected object PostService:

  private val notionClient = NotionClient.apply[IO]
  private val notionToken = js.Dynamic.global.process.env.NOTION_TOKEN.asInstanceOf[js.UndefOr[String]].getOrElse("UNKNOWN")
  private val notionDatabaseId = js.Dynamic.global.process.env.NOTION_DATABASE_ID.asInstanceOf[js.UndefOr[String]].getOrElse("UNKNOWN")

  @JSExportTopLevel(name = "getPostList", moduleID = "Posts")
  protected def getPostList(): js.Object with js.Dynamic = {
    val databaseIO = notionClient.getDatabase(notionToken, notionDatabaseId)
    val database = databaseIO.unsafeToFuture()
      .value
      .flatMap(_.toOption)
      .getOrElse(NotionDatabase(`object` = "list", hasMore = false, `type` = "page"))

    js.Dynamic.literal(
      props = js.Dynamic.literal(database = Map("object" -> database.`object`).toJSDictionary)
    )
  }
