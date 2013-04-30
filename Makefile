LEIN_ROOT := true
LEIN := ./lein
INSTANCES := 1
PROCESS_TYPE := "web"

all: clean compile unit integration package

build: clean compile package

compile:
	${LEIN} compile

clean:
	${LEIN} clean

package: compile
	${LEIN} uberjar

repl:
	${LEIN} repl

deploy:
	git push bazooka master
	./make/deploy.sh ${INSTANCES} ${PROCESS_TYPE}

unit:
	${LEIN} midje uml-generator.unit.*

integration:
	${LEIN} midje uml-generator.integration.*

web: compile package
	java -jar target/uml-generator-1.0.0-SNAPSHOT-standalone.jar
