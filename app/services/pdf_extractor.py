"""
PDF Text Extraction Service.
Uses PyMuPDF to extract raw text content from uploaded PDF files.
Adheres to the Single Responsibility Principle and Interface Segregation Principle.
"""

from abc import ABC, abstractmethod
import logging
import pymupdf

logger = logging.getLogger(__name__)


class PDFExtractionError(Exception):
    """Raised when PDF text extraction fails."""
    pass


class BasePDFExtractor(ABC):
    """Abstract interface for PDF document text extraction."""

    @abstractmethod
    def extract_text(self, file_bytes: bytes, filename: str = "") -> str:
        """Extract all readable text from a PDF byte buffer."""
        pass


class PyMuPDFExtractor(BasePDFExtractor):
    """Concrete PDF text extraction engine using PyMuPDF."""

    def extract_text(self, file_bytes: bytes, filename: str = "") -> str:
        """Extract text from PDF bytes using PyMuPDF.

        Args:
            file_bytes: Raw binary bytes of the uploaded PDF file.
            filename: Name of the file for logging context.

        Returns:
            Extracted text content as a concatenated string.

        Raises:
            PDFExtractionError: If the document is malformed or unreadable.
        """
        if not file_bytes:
            raise PDFExtractionError(f"PDF file '{filename}' is empty (0 bytes).")

        try:
            doc = pymupdf.open(stream=file_bytes, filetype="pdf")
        except Exception as exc:
            logger.error("Failed to parse PDF '%s': %s", filename, exc)
            raise PDFExtractionError(f"Invalid or corrupted PDF file '{filename}': {str(exc)}") from exc

        pages_text = []
        try:
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_text = page.get_text()
                if page_text:
                    pages_text.append(page_text.strip())
        finally:
            doc.close()

        full_text = "\n\n".join(pages_text).strip()
        if not full_text:
            logger.warning("No readable text found in PDF '%s'.", filename)

        return full_text
