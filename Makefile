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
	${LEIN} midje msc-generator-service.unit.*

integration:
	${LEIN} midje msc-generator-service.integration.*

web:
	${LEIN} ring server
