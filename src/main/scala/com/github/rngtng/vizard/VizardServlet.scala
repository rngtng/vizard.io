package com.github.rngtng.vizard

import org.scalatra._
import scalate.ScalateSupport

class VizardServlet extends VizardStack {

  get("/") {
    <html>
      <body>
        <h1>Hello, world!</h1>
        Say <a href="hello-scalate">hello to Scalate</a>.
      </body>
    </html>
  }
  
}
