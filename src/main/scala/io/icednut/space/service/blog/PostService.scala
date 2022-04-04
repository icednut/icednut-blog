package io.icednut.space.service.blog

import cats.effect.IO
import cats.effect.unsafe.implicits.*
import io.icednut.space.service.notion.{NotionClient, NotionDatabase}

import scala.scalajs.js
import scala.scalajs.js.Dictionary
import scala.scalajs.js.JSConverters.JSRichMap
import scala.scalajs.js.annotation.JSExportTopLevel
import scala.concurrent.duration.DurationInt
import scala.concurrent.Await
import concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

protected object PostService:

  private val notionClient = NotionClient.apply[IO]
  private val notionToken = js.Dynamic.global.process.env.NOTION_TOKEN.asInstanceOf[js.UndefOr[String]].getOrElse("secret_W2tzyhXlyrfeOw37nDIdB5MXBY7myIOd4x38w9Oh7lV")
  private val notionDatabaseId = js.Dynamic.global.process.env.NOTION_DATABASE_ID.asInstanceOf[js.UndefOr[String]].getOrElse("8ca7c96749414d278cb2e2b8e10a9229")

  @JSExportTopLevel(name = "getPostList", moduleID = "Posts")
  protected def getPostList(): js.Object with js.Dynamic = {
    val databaseIO = notionClient.getDatabase(notionToken, notionDatabaseId)
    val future: Future[NotionDatabase] = databaseIO.unsafeToFuture()
      .recover { ex =>
        // logger.error(ex.getMessage, ex)
        NotionDatabase(`object` = "aaa", hasMore = false, `type` = "bbb")
      }
    val database: NotionDatabase = Await.result(future, 2.seconds)

    println(database)

    js.Dynamic.literal(
      props = js.Dynamic.literal(database = Map("object" -> database.`object`).toJSDictionary)
    )
  }
