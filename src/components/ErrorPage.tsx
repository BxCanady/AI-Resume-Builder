import React from "react";

const ErrorPage = () => {
    return (
        <div className="error-page">
            <h1>Oops! Something went wrong.</h1>
            <p>We couldn't find any data to display.</p>
            {/* You can customize the error message further if needed */}
        </div>
    );
};

export default ErrorPage;