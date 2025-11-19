await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	target: "bun",
	format: "esm",
	sourcemap: "external",
	minify: true,
	drop: ["console.log"],
	// bytecode: true,
	// compile: true,
});

export {};
