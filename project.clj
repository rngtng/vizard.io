(defproject uml-generator "1.0.0-SNAPSHOT"
  :description "Renerate crazy graphs fast!"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [org.clojure/clojure-contrib "1.2.0"]
                 [compojure "1.1.3"]

                 [ring/ring-core "1.1.1"]
                 [ring-server "0.2.5"]
                 [compojure "1.1.1"]
                 [ring-json-response "0.2.0"]
                 [net.sourceforge.plantuml/plantuml "7947"]
                 [markdown-clj "0.9.8"]
                 [clj-time "0.4.4"]
                 [tentacles "0.2.4"]
                 [enlive "1.0.1"]
                 [environ "0.2.1"]
                 [ring-mock "0.1.3"]]

  :min-lein-version "2.0.0"

  :main uml-generator.start

  :profiles {:dev
             {:dependencies [[midje "1.4.0"]
                             [bultitude "0.1.7"]]
              :plugins      [[lein-midje "2.0.4"]
                             [lein-kibit "0.0.8"]]}}

  ; :ring {:handler uml-generator.web/app}

  ; :repositories [["SoundCloud Internal - Snapshots"       "http://maven.int.s-cloud.net/content/repositories/snapshots/"]
  ;                ["SoundCloud Internal - Releases"        "http://maven.int.s-cloud.net/content/repositories/releases/"]
  ;                ["SoundCloud Internal - Proxy Snapshots" "http://maven.int.s-cloud.net/content/groups/proxy_snapshots/"]
  ;                ["SoundCloud Internal - Proxy Releases"  "http://maven.int.s-cloud.net/content/groups/proxy_releases/"]]
  )
