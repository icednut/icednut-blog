package io.icednut.space.pages

import io.github.nafg.simplefacade.Implicits.{elementTypeWriter, vdomNodeWriter}
import io.github.nafg.simplefacade.{FacadeModule, PropTypes}
import japgolly.scalajs.react.*
import japgolly.scalajs.react.vdom.VdomNode
import japgolly.scalajs.react.vdom.html_<^.*

import scala.scalajs.js
import scala.scalajs.js.annotation.{JSExportTopLevel, JSImport}


//object NextjsLink extends FacadeModule.NodeChildren.Simple {
//
//  @js.native
//  @JSImport("next/link", JSImport.Default, "Link")
//  object raw extends js.Object
//
//  override def mkProps = new Props
//
//  class Props extends PropTypes.WithChildren[VdomNode] {
//    val href = of[String]
//    val content = of[VdomNode]
//
//    override def children: PropTypes.Prop[VdomNode] = content
//  }
//}

object HomePage {

  @js.native
  @JSImport("@src/io/icednut/space/pages/Home.module.css", JSImport.Namespace)
  val styles: js.Dictionary[String] = js.native

  @JSExportTopLevel("Home", "Home")
  val HomeJS = ScalaComponent
    .builder[Unit]
    .render_(
      <.div(
        "Hello, world",
        ^.className := "bg-slate-200 p-4"
      )
    )
    .build
    .toJsComponent
    .raw
}
