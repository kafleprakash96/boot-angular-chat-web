package com.prkcode.chatwebbackend.utils;

import org.springframework.stereotype.Component;
import org.imgscalr.Scalr;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Set;

@Component
public class ImageUtils {
    private static final Set<String> SUPPORTED_FORMATS = Set.of("jpeg", "jpg", "png");
    private static final int MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final int MIN_IMAGE_DIMENSION = 50;

    public byte[] compressImage(byte[] imageData, int targetWidth, String format) throws IOException {
        // Validate input parameters
        validateInputs(imageData, targetWidth, format);

        try {
            // Try to read the image with additional error handling
            BufferedImage img = readImage(imageData);

            // Validate image dimensions
            validateImageDimensions(img);

            // Calculate height to maintain aspect ratio
            int targetHeight = calculateTargetHeight(img, targetWidth);

            // Resize image with additional error handling
            BufferedImage resizedImage = resizeImage(img, targetWidth, targetHeight);

            // Convert to byte array with the specified format
            return convertToByteArray(resizedImage, format);
        } catch (Exception e) {
            throw new IOException("Failed to process image: " + e.getMessage(), e);
        }
    }

    private void validateInputs(byte[] imageData, int targetWidth, String format) {
        if (imageData == null || imageData.length == 0) {
            throw new IllegalArgumentException("Image data is empty or invalid");
        }
        if (imageData.length > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Image size exceeds maximum allowed size of " + MAX_IMAGE_SIZE + " bytes");
        }
        if (targetWidth < MIN_IMAGE_DIMENSION) {
            throw new IllegalArgumentException("Target width must be at least " + MIN_IMAGE_DIMENSION + " pixels");
        }
        if (!SUPPORTED_FORMATS.contains(format.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported image format: " + format + ". Supported formats are: " + SUPPORTED_FORMATS);
        }
    }

    private BufferedImage readImage(byte[] imageData) throws IOException {
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(imageData)) {
            BufferedImage img = ImageIO.read(inputStream);
            if (img == null) {
                throw new IOException("Failed to read image data. The image format might be unsupported or the data might be corrupted.");
            }
            return img;
        }
    }

    private void validateImageDimensions(BufferedImage img) {
        if (img.getWidth() < MIN_IMAGE_DIMENSION || img.getHeight() < MIN_IMAGE_DIMENSION) {
            throw new IllegalArgumentException(
                    "Image dimensions too small. Minimum dimensions are " + MIN_IMAGE_DIMENSION + "x" + MIN_IMAGE_DIMENSION + " pixels");
        }
    }

    private int calculateTargetHeight(BufferedImage img, int targetWidth) {
        double ratio = (double) targetWidth / img.getWidth();
        return (int) (img.getHeight() * ratio);
    }

    private BufferedImage resizeImage(BufferedImage img, int targetWidth, int targetHeight) {
        BufferedImage resizedImage = Scalr.resize(img, Scalr.Method.ULTRA_QUALITY,
                Scalr.Mode.FIT_TO_WIDTH, targetWidth, targetHeight);
        if (resizedImage == null) {
            throw new IllegalStateException("Image resizing failed");
        }
        return resizedImage;
    }

    private byte[] convertToByteArray(BufferedImage image, String format) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            if (!ImageIO.write(image, format, outputStream)) {
                throw new IOException("Failed to write image in format: " + format);
            }
            return outputStream.toByteArray();
        }
    }

    public boolean isValidImageFormat(String contentType) {
        if (contentType == null) {
            return false;
        }
        String format = contentType.toLowerCase().replace("image/", "");
        return SUPPORTED_FORMATS.contains(format);
    }
}
