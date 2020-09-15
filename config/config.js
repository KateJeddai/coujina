const env = process.env.NODE_ENV || "development";

if(env === "development") {
    const config = require('./config.json'); 
    process.env.MONGODB_URI = config.MONGODB_URI;
    process.env.JWT_SECRET = config.JWT_SECRET;
    process.env.APP_ADMIN = config.APP_ADMIN;
    process.env.ADMIN_PASS = config.ADMIN_PASS;
    process.env.MONGO_DB = config.MONGO_DB;
    process.env.MONGO_USER = config.MONGO_USER;
    process.env.GOOGLE_ID = config.GOOGLE_ID;
    process.env.GOOGLE_SECRET = config.GOOGLE_SECRET;
    process.env.REFRESH_TOKEN = config.REFRESH_TOKEN;
}

// client id // 567948183689-odk6lpnk14p5139n1i1gh4p842l7vi45.apps.googleusercontent.com

// client secret // T7NVyUVt8VEK97hYTeSNgLg5

