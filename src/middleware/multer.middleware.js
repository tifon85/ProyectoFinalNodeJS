import multer from "multer";
import { __dirname } from "../utils/utils.js";


const storage = multer.diskStorage({
    //destination hace referencia a la carpeta donde se van a almacenar los archivos 
  destination: function (req, file, cb) {
    if (file.fieldname === "profiles") {
      return cb(null, `${__dirname}/docs/profiles`);
    } else if (file.fieldname === "products") {
      return cb(null, `${__dirname}/docs/products`);
    } else {
      return cb(null, `${__dirname}/docs/documents`);
    }
  },
  //filename hace referencia al nombre final que contendrá el archivo
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, `${Date.now()}-${file.originalname}`);//mantiene el nombre original y se le agrega adelante la fecha en que se procesó
  },
});

const upload = multer({ storage: storage });

export default upload;