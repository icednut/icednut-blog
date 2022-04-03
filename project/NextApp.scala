import org.portablescala.sbtplatformdeps.PlatformDepsPlugin.autoImport._
import org.scalajs.linker.interface.{ModuleKind, ModuleSplitStyle}
import org.scalajs.sbtplugin.ScalaJSPlugin
import org.scalajs.sbtplugin.ScalaJSPlugin.autoImport._
import sbt.Keys._
import sbt._

import scala.sys.process._

object NextApp extends AutoPlugin {
  override def requires = ScalaJSPlugin

  override def trigger = noTrigger

  override def projectSettings = Seq(
    scalacOptions += "-language:implicitConversions",
    Compile / fullLinkJS / scalaJSLinkerOutputDirectory := target.value / "js",
    Compile / fastLinkJS / scalaJSLinkerOutputDirectory := target.value / "js",
    scalaJSLinkerConfig ~= {
      // Enable ECMAScript module output.
      _.withModuleKind(ModuleKind.CommonJSModule)
        // Use .mjs extension.
        .withModuleSplitStyle(ModuleSplitStyle.FewestModules)
        .withSourceMap(false)
    },
    (Compile / fastLinkJS / scalaJSLinkerConfig) ~= {
      _.withModuleSplitStyle(ModuleSplitStyle.SmallestModules)
    },
    libraryDependencies ++= Seq(
      "com.github.japgolly.scalajs-react" %%% "core" % "2.0.1",
      "org.http4s" %%% "http4s-dom" % "0.2.1",
      "org.http4s" %%% "http4s-client" % "0.23.11",
      "org.http4s" %%% "http4s-circe" % "0.23.11",
      "io.circe" %%% "circe-generic" % "0.15.0-M1",
      "org.typelevel" %%% "cats-core" % "2.7.0",
      "org.typelevel" %%% "cats-effect" % "3.3.1",
      "org.scalatest" %%% "scalatest" % "3.2.11" % Test,
      "org.typelevel" %%% "cats-effect-testing-scalatest" % "1.4.0" % Test
    )
  )

  object autoImport {
    val npm = SettingKey[String]("npm", "The path to the npm executable")
    val scalaJsReactVersion =
      SettingKey[String](
        "scalaJsReactVersion",
        "The version of scalaJsReact to use"
      )
    val scalaJsReactUseGeneric = SettingKey[Boolean](
      "scalaJsReactUseGeneric",
      "Whether to use the 'core-generic' module scalajs-react, that provides effect agnositicism"
    )
    val nextServerProcess = AttributeKey[Option[Process]](
      "nextServerProcess",
      "A handle to the currently-running next dev server"
    )
    val startNextServer =
      TaskKey[StateTransform]("startNextServer", "npm run dev")
    val stopNextServer =
      TaskKey[StateTransform]("stopNextServer", "Stop running dev server")
    val nextServerIsRunning =
      TaskKey[Boolean]("nextServerIsRunning")
    val nextBuild =
      TaskKey[Int]("nextBuild", "npm run build")
    val npmInstall =
      TaskKey[Int]("npmInstall", "npm install")
  }
}
