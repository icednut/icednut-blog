ThisBuild / scalaVersion := "3.1.1"

lazy val root = project
  .in(file("."))
  .enablePlugins(NextApp)
  .disablePlugins(RevolverPlugin)
  .settings(
    name := "renewal-icednut",
  )
