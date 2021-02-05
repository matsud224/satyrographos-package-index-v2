DUNE=dune

all: repo2json.exe

repo2json.exe: repo2json.ml
	$(DUNE) build $@

.PHONY: run
run: repo2json.exe
	$(DUNE) exec ./$< packages.json snapshots.json
