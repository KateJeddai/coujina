const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(!isValid){
            return cb(error, false);
        }              
        if(isValid) {
            error = null;
        }
        if(MIME_TYPE_MAP[file.mimetype]){
            cb(error, "backend/images");
        } 
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split('.').join('-');
        let ext;
        if(MIME_TYPE_MAP[file.mimetype]){
            ext = MIME_TYPE_MAP[file.mimetype];
        } 
        cb(null, fileName + '-' + Date.now() + '.' + ext);
    }
}); 


module.exports = multer({storage}).single('imagePath');
