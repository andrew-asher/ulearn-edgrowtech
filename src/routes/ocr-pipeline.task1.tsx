import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ocr-pipeline/task1")({
  head: () => ({
    meta: [
      { title: "Task 1 · Document Normalisation · U-Learn by EdGrow" },
      { name: "description", content: "Stage 1 of the EdGrow OCR pipeline: document input, page ordering and file normalisation." },
    ],
  }),
  component: Task1Page,
});

function Task1Page() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-24">

        <div className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
          OCR Pipeline · Stage 1
        </div>
        <h1 className="mt-2 font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl">
          Document Input &{" "}
          <span className="text-gradient">File Normalisation</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          The first stage of the EdGrow OCR pipeline. Accepts mixed input files —
          PDFs, scanned PDFs, JPGs and PNGs — and converts everything into a
          clean, ordered sequence of normalised page images ready for OCR
          processing.
        </p>

        <div className="mt-16">
          <h2 className="text-2xl font-bold font-display mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Upload Files", desc: "PDFs, scanned PDFs, JPG and PNG images in any order" },
              { step: "02", title: "Auto Detect", desc: "System detects digital vs scanned PDFs automatically" },
              { step: "03", title: "Preprocess", desc: "OpenCV cleans each page — grayscale, denoise, threshold" },
              { step: "04", title: "Normalise", desc: "All pages saved as ordered PNGs with metadata tracking" },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-border bg-card p-6">
                <div className="text-3xl font-bold text-primary font-display">{item.step}</div>
                <div className="mt-3 font-semibold text-foreground">{item.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold font-display mb-8">Libraries Used</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "PyMuPDF", role: "Digital PDF extraction", detail: "Extracts pages from text-based PDFs at 200 DPI" },
              { name: "pdf2image + Poppler", role: "Scanned PDF extraction", detail: "Converts scanned PDF pages to images via Poppler" },
              { name: "Pillow", role: "Image processing", detail: "Opens, converts and saves all image file types" },
              { name: "OpenCV", role: "Image preprocessing", detail: "Grayscale conversion, denoising and Otsu thresholding for OCR accuracy" },
            ].map((lib) => (
              <div key={lib.name} className="rounded-2xl border border-border bg-card p-6 flex gap-4 items-start">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">{lib.name}</div>
                  <div className="text-xs text-primary mt-0.5">{lib.role}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{lib.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold font-display mb-8">Output Structure</h2>
          <div className="rounded-2xl border border-border bg-card p-8 font-mono text-sm text-muted-foreground">
            <div className="text-foreground font-semibold mb-4">normalized_pages/</div>
            <div className="pl-4 space-y-1">
              <div>├── page_001.png</div>
              <div>├── page_002.png</div>
              <div>├── page_003.png</div>
              <div>└── ...</div>
            </div>
            <div className="mt-4 text-foreground font-semibold">metadata.json</div>
            <div className="mt-2 pl-4 space-y-1 text-xs">
              <div>{"{"}</div>
              <div className="pl-4">"page_order": 1,</div>
              <div className="pl-4">"original_filename": "lecture.pdf",</div>
              <div className="pl-4">"source_type": "digital_pdf",</div>
              <div className="pl-4">"file_type": "PDF",</div>
              <div className="pl-4">"source_page_number": 1,</div>
              <div className="pl-4">"output_path": "normalized_pages/page_001.png"</div>
              <div>{"}"}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}