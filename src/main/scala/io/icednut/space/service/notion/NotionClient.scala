package io.icednut.space.service.notion

import cats.effect.*
import io.circe.generic.auto.*
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.client.Client
import org.http4s.dom.FetchClientBuilder

import scala.concurrent.duration.DurationInt

class NotionClient[F[_] : Async]:
  private val client = FetchClientBuilder[F]
    .withRequestTimeout(1.seconds)
    .create

  def getDatabase(databaseId: String): F[NotionDatabase] = {
    client.expect[NotionDatabase](s"https://api.notion.com/v1/databases/${databaseId}/query")
  }

object NotionClient:
  def apply[F[_] : Async] = new NotionClient
