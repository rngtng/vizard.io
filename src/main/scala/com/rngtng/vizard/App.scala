package com.rngtng.vizard

import java.io.File
import com.twitter.finatra._
import com.twitter.finatra.ContentType._
import org.fusesource.scalate._
import com.asual.lesscss._
import net.sourceforge.plantuml._

object App extends FinatraServer {

  class VizardApp extends Controller {

    get("/") { request =>
      val engine = new TemplateEngine
      // engine.mode = "development"

      val templatePath = config.docRoot() + "/index.jade"
      val output = engine.layout(templatePath)
      render.html(output).toFuture
    }

    get("/css/style.css") { request =>
      val engine = new LessEngine

      val templatePath = config.docRoot() + "/style.css.less"
      val output = engine.compile(new File(templatePath))
      render.body(output).contentType("text/css").toFuture
    }

    get("/render.png") { request =>
      val engine = new PlantumlRenderer

      val output = engine.render(request.content, "png")
      render.plain(output).toFuture
    }
  }

  val app = new VizardApp

  register(app)
}
