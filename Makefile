build:
	docker build -t vizard .

run:
	docker run -it vizard

dev:
	docker run -p 9292 -v `pwd`:/usr/src/app -it vizard bash

update:
	open http://sourceforge.net/projects/plantuml/files/plantuml.jar/download
