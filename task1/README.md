# Task 1 — Document Input, Page Ordering & File Normalisation

## Overview
First stage of the EdGrow OCR pipeline. Accepts mixed input files (PDFs, scanned PDFs, images) and normalises them into a clean ordered sequence of PNG pages ready for OCR.

## Libraries Used
- **PyMuPDF** — extracts pages from digital PDFs
- **pdf2image + Poppler** — extracts pages from scanned PDFs
- **Pillow** — opens and saves image files
- **OpenCV** — preprocesses images (grayscale, denoise, threshold) for better OCR accuracy

## Setup

### Install Python dependencies