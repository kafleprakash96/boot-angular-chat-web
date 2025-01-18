package com.prkcode.chatwebbackend.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class FileStorageUtils {


    private final String uploadDir;

    public FileStorageUtils(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadDir = uploadDir;
        createUploadDirectory();
    }

    private void createUploadDirectory() {
        try {
            Files.createDirectories(Path.of(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String saveFile(byte[] fileData, String fileName, String contentType) throws IOException {
        Path filePath = Path.of(uploadDir, fileName);
        Files.write(filePath, fileData);

        // Return the URL path that will be stored in the database
        return "/uploads/" + fileName;
    }

    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl != null && !fileUrl.isEmpty()) {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            Path filePath = Path.of(uploadDir, fileName);
            Files.deleteIfExists(filePath);
        }
    }
}
