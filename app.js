const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Change destination to 'uploads/'

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('excelFile'), (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    const keys = json[0];
    const data = json.slice(1).map(row => {
        let obj = {};
        row.forEach((cell, i) => {
            obj[keys[i]] = cell;
        });
        return obj;
    });

    const jsonData = JSON.stringify(data, null, 2);

    res.setHeader('Content-Disposition', 'attachment; filename="data.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});