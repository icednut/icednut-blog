package io.icednut.space.components

import japgolly.scalajs.react.component.Js.{Component, RawMounted, UnmountedWithRawType}
import japgolly.scalajs.react.vdom.VdomElement
import japgolly.scalajs.react.{Children, CtorType, JsComponent}

import scala.scalajs.js
import scala.scalajs.js.annotation.JSImport

object NextLink {

  @JSImport("next/link", JSImport.Default)
  @js.native
  object RawComponent extends js.Any

  @js.native
  trait Props extends js.Object {
    var href: String = js.native
  }

  case class Impl(href: String) {
    def apply(children: Seq[VdomElement]) = {
      val props = (new js.Object).asInstanceOf[Props]
      props.href = this.href
      val f = JsComponent[js.Object, Children.Varargs, Null](RawComponent)

      f(props)(children: _*)
    }
  }
}
