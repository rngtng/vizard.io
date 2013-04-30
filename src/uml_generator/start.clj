(ns uml-generator.start
  (:require
    [uml-generator.web        :as web]
    [ring.adapter.jetty :as jetty]
    [clojure.contrib.string :as string])
  (:gen-class))

;; export to bazooka-clj
(defn param [key]
  (let [value (System/getenv key)]
    (if (nil? value)
      (throw (IllegalArgumentException. (str "Environment variable " key " not defined")))
      (string/trim value))))

(def port (Integer/parseInt (param "PORT")))

;;;;;;;;;;;;;;;;;;;;;;;;;

(defn -main [& _]
  (jetty/run-jetty (-> #'web/app) {:port port :join? false}))
