DUNE=dune

all: repo2json.exe

repo2json.exe: repo2json.ml
	$(DUNE) build --profile release $@

.PHONY: run
run: repo2json.exe
	$(DUNE) exec --profile release ./$< packages.json snapshots.json

.PHONY: clean
clean:
	$(DUNE) clean
