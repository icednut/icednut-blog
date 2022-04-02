package io.icednut.space.pages

import io.icednut.space.components.NextLink
import io.icednut.space.components.NextLink.{Props, RawComponent}
import japgolly.scalajs.react.*
import japgolly.scalajs.react.vdom.VdomNode
import japgolly.scalajs.react.vdom.html_<^.*

import scala.scalajs.js
import scala.scalajs.js.annotation.{JSExportTopLevel, JSImport}

object HomePage:

  @JSImport("@resources/css/Home.module.css", JSImport.Namespace)
  @js.native
  val styles: js.Dictionary[String] = js.native

  @JSExportTopLevel("Home", "Home")
  val HomeJS = ScalaComponent
    .builder[Unit]
    .render_(
      <.div(
        NextLink.Impl(href = "/life")(Seq(<.div("Home"))),
        ^.className := "bg-slate-200 p-4"
      )
    )
    .build
    .toJsComponent
    .raw
