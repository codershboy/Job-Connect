package com.jobconnect.jobconnect.exception;

import java.util.Date;
import java.util.Map;

public class ErrorDetails {

    private Date timestamp;
    private int status;
    private String message;
    private String details;
    private Map<String, String> validationErrors;

    public ErrorDetails(Date timestamp, int status, String message, String details) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.details = details;
    }

    public ErrorDetails(Date timestamp, int status, String message, String details, Map<String, String> validationErrors) {
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.details = details;
        this.validationErrors = validationErrors;
    }

    // Getters and Setters
    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }
}
