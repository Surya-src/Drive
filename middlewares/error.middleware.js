const errorHandler = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "An error occurred";
    const description = err.description || null;

    console.error("Error:", {
        status,
        message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });

    // Don't render error page for API endpoints (JSON responses)
    if (req.path.includes("/api") || req.path.includes("/upload") || req.path.includes("/download")) {
        return res.status(status).json({ error: message });
    }

    // Render error view for page requests
    res.status(status).render("error", {
        status,
        message,
        description
    });
};

module.exports = errorHandler;
