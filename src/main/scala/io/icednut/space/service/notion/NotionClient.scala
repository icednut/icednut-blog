package io.icednut.space.service.notion

import cats.effect.*
import cats.syntax.all.*
import io.circe.generic.auto.*
import org.http4s.*
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.client.Client
import org.http4s.dom.FetchClientBuilder
import org.http4s.headers.Authorization
import org.http4s.implicits.*
import org.typelevel.ci.CIString

import scala.concurrent.duration.DurationInt

class NotionClient[F[_] : Async]:
  private val client = FetchClientBuilder[F]
    .withRequestTimeout(1.seconds)
    .create

  def getDatabase(notionToken: String, databaseId: String): F[NotionDatabase] = {
    val request: Request[F] = Request.apply(
      method = Method.POST,
      uri = Uri.unsafeFromString(s"https://api.notion.com/v1/databases/${databaseId}/query"),
      headers = Headers(
        Authorization(Credentials.Token(AuthScheme.Bearer, notionToken)),
        Header.Raw(CIString("Notion-Version"), "2022-02-22")
      )
    )
    println(request.toString)
    client.expect[NotionDatabase](req = request)
  }

object NotionClient:
  def apply[F[_] : Async] = new NotionClient
