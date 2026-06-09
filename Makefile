.PHONY: test bench cuda example help

# ── Help ─────────────────────────────────────────────────────────────────────

help:
	@echo "Usage: make <target>"
	@echo ""
	@echo "Tests"
	@echo "  test                  Run all tests"
	@echo "  test-<name>           Run tests for a specific function (e.g. test-sscal)"
	@echo ""
	@echo "Benchmarks (WebGPU)"
	@echo "  bench                 Run all WebGPU benchmarks"
	@echo "  bench-<name>          Run a specific WebGPU benchmark (e.g. bench-sscal)"
	@echo ""
	@echo "Benchmarks (CUDA)"
	@echo "  cuda                  Build and run all CUDA benchmarks"
	@echo "  cuda-<name>           Build and run a specific CUDA benchmark (e.g. cuda-sscal)"
	@echo ""
	@echo "Examples"
	@echo "  example               Run all Node examples"
	@echo "  example-<name>        Run a specific Node example (e.g. example-sscal)"
	@echo "  example-<name>-web    Open a specific example in the browser (e.g. example-sscal-web)"

# ── Tests ────────────────────────────────────────────────────────────────────

test:
	node --test --test-reporter=spec tests/**/test.*.js

test-%:
	node --test tests/$*/test.$*.js

# ── Benchmarks (WebGPU) ───────────────────────────────────────────────────────

bench:
	@for f in benchmarks/*/benchmark.*.js; do node $$f; done

bench-%:
	node benchmarks/$*/benchmark.$*.js

# ── Benchmarks (CUDA) ────────────────────────────────────────────────────────

cuda:
	@for d in benchmarks/*/cuda; do $(MAKE) -C $$d && ./$$d/benchmark; done

cuda-%:
	$(MAKE) -C benchmarks/$*/cuda
	./benchmarks/$*/cuda/benchmark

# ── Examples ─────────────────────────────────────────────────────────────────

example:
	@for d in examples/*/; do node $${d}$$(basename $$d).js; done

example-%:
	node examples/$*/$*.js

example-%-web:
	npx vite --open /examples/$*/$*.html