package com.prkcode.chatwebbackend.utils;

import org.springframework.stereotype.Component;

import org.imgscalr.Scalr;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class ImageUtils {

    public byte[] compressImage(byte[] imageData, int targetWidth, String format) throws IOException {
        if (imageData == null || imageData.length == 0) {
            throw new IllegalArgumentException("Image data is empty or invalid.");
        }

        BufferedImage img = ImageIO.read(new ByteArrayInputStream(imageData));
        if (img == null) {
            throw new IllegalArgumentException("Failed to read image. Image data may be corrupted.");
        }

        // Calculate height to maintain aspect ratio
        double ratio = (double) targetWidth / img.getWidth();
        int targetHeight = (int) (img.getHeight() * ratio);

        // Resize image
        BufferedImage resizedImage = Scalr.resize(img, Scalr.Method.ULTRA_QUALITY,
                Scalr.Mode.FIT_TO_WIDTH, targetWidth, targetHeight);
        if (resizedImage == null) {
            throw new IllegalStateException("Image resizing failed.");
        }

        // Write to output stream using the correct format
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        boolean writeSuccess = ImageIO.write(resizedImage, format, outputStream);
        if (!writeSuccess) {
            throw new IOException("ImageIO.write failed to write the image in format: " + format);
        }

        return outputStream.toByteArray();
    }


    public boolean isValidImageFormat(String contentType) {
        return contentType != null && (
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/jpg")
        );
    }
}
