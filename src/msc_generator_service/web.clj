(ns msc-generator-service.web
  (:require
    [cheshire.core     :as json]
    [compojure.core    :refer [defroutes GET PUT POST DELETE ANY]]
    [compojure.handler :as handler]
    [compojure.route   :as route])
  (:gen-class))

(def default-headers {"Content-Type" "application/json"
                      "Access-Control-Allow-Origin" "*"})

(def no-cache-headers {"Cache-Control" "max-age=0, private, must-revalidate"})

(defn- json-body [data]
  (json/encode data))

(defn- json-response-from [data status headers]
  {:body (json-body data)
   :status status
   :headers headers})

(defn json
  ([data] (json-response-from data 200 default-headers))
  ([data status] (json-response-from data status default-headers))
  ([data status headers] (json-response-from data status (merge default-headers headers))))

(def handler-page-not-found
  (json {"errors" [{"message" "Sorry, that page does not exist"}]} 404))

(defn handler-health [] "NO")

(defn make-app-routes []
  (defroutes main-routes
    (GET  "/-/health" [] (handler-health))
    (ANY  "*" [] handler-page-not-found)))

(def app (handler/site (make-app-routes)))
