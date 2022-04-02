package io.icednut.space.service.blog

import cats.effect.IO
import io.icednut.space.service.notion.NotionClient

import scala.scalajs.js
import scala.scalajs.js.annotation.JSExportTopLevel

protected object PostService:

  private val notionClient = NotionClient.apply[IO]

  @JSExportTopLevel(name = "getPostList", moduleID = "Posts")
  protected def getPostList(): js.Object with js.Dynamic = {
    notionClient.getDatabase("TEST_DATABASE_ID")
    ??? // TODO: 여기서 IO를 실행해야 되지 않을까?
  }
