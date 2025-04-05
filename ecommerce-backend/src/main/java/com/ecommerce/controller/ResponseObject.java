package com.ecommerce.controller;

import org.springframework.http.HttpStatus;

public class ResponseObject {
    private String message;
    private HttpStatus status;
    private Object data;

    public ResponseObject(String message, HttpStatus status, Object data) {
        this.message = message;
        this.status = status;
        this.data = data;
    }

    public static ResponseObjectBuilder builder() {
        return new ResponseObjectBuilder();
    }

    public String getMessage() { return message; }
    public HttpStatus getStatus() { return status; }
    public Object getData() { return data; }

    public static class ResponseObjectBuilder {
        private String message;
        private HttpStatus status;
        private Object data;

        public ResponseObjectBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ResponseObjectBuilder status(HttpStatus status) {
            this.status = status;
            return this;
        }

        public ResponseObjectBuilder data(Object data) {
            this.data = data;
            return this;
        }

        public ResponseObject build() {
            return new ResponseObject(message, status, data);
        }
    }
}