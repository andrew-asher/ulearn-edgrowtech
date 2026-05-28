import os
import json
import cv2
import numpy as np
from pathlib import Path
from PIL import Image
import fitz  # PyMuPDF
from pdf2image import convert_from_path

# ── configuration ──────────────────────────────────────────────
INPUT_FOLDER = "input_files"
OUTPUT_FOLDER = "normalized_pages"
METADATA_FILE = "metadata.json"
POPPLER_PATH = r"C:\poppler-26.02.0\Library\bin"
DPI = 200


# ── image preprocessing using OpenCV ──────────────────────────
def preprocess_image(pil_image):
    """
    Uses OpenCV to preprocess image for better OCR accuracy.
    Steps: convert to grayscale, denoise, apply thresholding.
    Returns a cleaned PIL Image.
    """
    # convert PIL to OpenCV format (numpy array)
    img_array = np.array(pil_image.convert("RGB"))
    img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

    # convert to grayscale
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

    # denoise
    denoised = cv2.fastNlMeansDenoising(gray, h=10)

    # apply Otsu thresholding for clean black/white text
    _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # convert back to PIL Image (RGB so it saves cleanly as PNG)
    result = Image.fromarray(thresh).convert("RGB")
    return result


# ── process image file using Pillow ───────────────────────────
def process_image_file(filepath):
    """Opens an image file using Pillow, preprocesses with OpenCV."""
    img = Image.open(filepath)
    img = img.convert("RGB")
    img = preprocess_image(img)
    return img


# ── process PDF using PyMuPDF ──────────────────────────────────
def process_pdf_pymupdf(filepath):
    """
    Extracts pages from a digital PDF using PyMuPDF.
    Returns list of (PIL Image, page_number).
    """
    images = []
    pdf_document = fitz.open(filepath)
    for page_number in range(len(pdf_document)):
        page = pdf_document[page_number]
        mat = fitz.Matrix(DPI / 72, DPI / 72)
        pix = page.get_pixmap(matrix=mat)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        img = preprocess_image(img)
        images.append((img, page_number + 1))
    pdf_document.close()
    return images


# ── process scanned PDF using pdf2image + Poppler ─────────────
def process_pdf_pdf2image(filepath):
    """
    Extracts pages from a scanned PDF using pdf2image + Poppler.
    Returns list of (PIL Image, page_number).
    """
    images = []
    pages = convert_from_path(
        filepath,
        dpi=DPI,
        poppler_path=POPPLER_PATH
    )
    for page_number, page in enumerate(pages):
        img = preprocess_image(page)
        images.append((img, page_number + 1))
    return images


# ── detect if PDF is scanned or digital ───────────────────────
def is_scanned_pdf(filepath):
    """
    Checks if a PDF is scanned (image-based) or digital (text-based).
    Uses PyMuPDF to check for extractable text.
    """
    pdf_document = fitz.open(filepath)
    total_text = ""
    for page in pdf_document:
        total_text += page.get_text()
    pdf_document.close()
    # if less than 50 characters across whole doc, treat as scanned
    return len(total_text.strip()) < 50


# ── collect all pages ─────────────────────────────────────────
def collect_all_pages(input_folder):
    """
    Reads all files from input folder sorted alphabetically.
    Automatically detects scanned vs digital PDFs.
    Returns list of page dicts.
    """
    supported_images = {".jpg", ".jpeg", ".png"}
    supported_pdf = {".pdf"}
    all_pages = []

    files = sorted(Path(input_folder).iterdir())

    for filepath in files:
        ext = filepath.suffix.lower()

        if ext in supported_images:
            print(f"  [IMAGE] {filepath.name}")
            img = process_image_file(filepath)
            all_pages.append({
                "image": img,
                "original_filename": filepath.name,
                "source_type": "image",
                "source_page_number": None,
                "file_type": ext.replace(".", "").upper()
            })

        elif ext in supported_pdf:
            scanned = is_scanned_pdf(filepath)
            method = "pdf2image+Poppler (scanned)" if scanned else "PyMuPDF (digital)"
            print(f"  [PDF] {filepath.name} → detected as {'scanned' if scanned else 'digital'} → using {method}")

            if scanned:
                pdf_pages = process_pdf_pdf2image(filepath)
            else:
                pdf_pages = process_pdf_pymupdf(filepath)

            for img, pdf_page_num in pdf_pages:
                all_pages.append({
                    "image": img,
                    "original_filename": filepath.name,
                    "source_type": "scanned_pdf" if scanned else "digital_pdf",
                    "source_page_number": pdf_page_num,
                    "file_type": "PDF"
                })

        else:
            print(f"  [SKIP] Unsupported file: {filepath.name}")

    return all_pages


# ── save pages and metadata ───────────────────────────────────
def save_pages_and_metadata(all_pages, output_folder, metadata_file):
    """Saves each page as page_00N.png and writes metadata.json."""
    os.makedirs(output_folder, exist_ok=True)
    metadata = {"pages": []}

    for index, page_info in enumerate(all_pages):
        page_order = index + 1
        filename = f"page_{page_order:03d}.png"
        output_path = os.path.join(output_folder, filename)

        page_info["image"].save(output_path, "PNG")

        metadata["pages"].append({
            "page_order": page_order,
            "original_filename": page_info["original_filename"],
            "source_type": page_info["source_type"],
            "file_type": page_info["file_type"],
            "source_page_number": page_info["source_page_number"],
            "output_path": output_path
        })

        print(f"  Saved: {filename} <- {page_info['original_filename']}")

    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=4)

    print(f"\nMetadata saved to {metadata_file}")


# ── main ──────────────────────────────────────────────────────
def main():
    print("=== Task 1: Document Input, Page Ordering & File Normalisation ===\n")

    if not os.path.exists(INPUT_FOLDER):
        print(f"ERROR: Input folder '{INPUT_FOLDER}' not found.")
        return

    print(f"Reading files from: {INPUT_FOLDER}\n")
    all_pages = collect_all_pages(INPUT_FOLDER)

    if not all_pages:
        print("No supported files found in input_files folder.")
        return

    print(f"\nTotal pages collected: {len(all_pages)}")
    print(f"Saving to: {OUTPUT_FOLDER}\n")

    save_pages_and_metadata(all_pages, OUTPUT_FOLDER, METADATA_FILE)

    print(f"\n=== Done. {len(all_pages)} pages normalized. ===")


if __name__ == "__main__":
    main()