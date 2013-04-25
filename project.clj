(defproject msc-generator-service "1.0.0-SNAPSHOT"
  :description "Cool new project to do things and stuff"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [org.clojure/clojure-contrib "1.2.0"]
                 [compojure "1.1.3"]
                 [cheshire "5.0.1"]

                 [ring "1.1.6"]
                 [ring/ring-jetty-adapter "1.1.0"]
                 [ring/ring-devel "1.1.0"]

                 [org.clojure/tools.logging "0.2.3"]
                 [log4j/log4j "1.2.16" :exclusions [javax.mail/mail
                                                    javax.jms/jms
                                                    com.sun.jdmk/jmxtools
                                                    com.sun.jmx/jmxri]]
                 [org.slf4j/slf4j-log4j12 "1.6.6"]

                 ;memcached        [clojurewerkz/spyglass "1.1.0-beta1"]
                 ;circuit breaker  [circuit-breaker "0.1.6-SNAPSHOT"]
                 ;http             [http.async.client "0.5.2"]

                 [org.clojars.soundcloud/exceptional-clj "0.7.7"]
                 [com.soundcloud/statsyj "1.0.0"]]

  :min-lein-version "2.0.0"

  :plugins [[lein-ring "0.8.3"][lein-exec "0.2.1"]]

  :main msc-generator-service.start

  :profiles {:dev
             {:dependencies [[midje "1.4.0"]
                             [bultitude "0.1.7"]]
              :plugins      [[lein-midje "2.0.4"]
                             [lein-kibit "0.0.8"]]}}

  :ring {:handler msc-generator-service.web/app}

  :repositories [["SoundCloud Internal - Snapshots"       "http://maven.int.s-cloud.net/content/repositories/snapshots/"]
                 ["SoundCloud Internal - Releases"        "http://maven.int.s-cloud.net/content/repositories/releases/"]
                 ["SoundCloud Internal - Proxy Snapshots" "http://maven.int.s-cloud.net/content/groups/proxy_snapshots/"]
                 ["SoundCloud Internal - Proxy Releases"  "http://maven.int.s-cloud.net/content/groups/proxy_releases/"]])
