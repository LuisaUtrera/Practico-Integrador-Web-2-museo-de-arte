const express = require('express');
// const fetch = require('node-fetch');
const translate = require('node-google-translate-skidz');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8100;

app.use(express.static('public'));
app.use(express.json());
 app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
 });


app.post('/traducir', async (req, res) => {
    let datos = req.body;

    console.log(datos);
    try {
        const traducciones = await Promise.all(datos.map(async (item) => {

            const [tituloTraducido, culturaTraducida, dinastiaTraducida, fechaTraducida] = await Promise.all([
                translate({ text: item.titulo, source: 'en', target: 'es' }),
                translate({ text: item.cultura, source: 'en', target: 'es' }),
                translate({ text: item.dinastia, source: 'en', target: 'es' }),
                translate({ text: item.fecha, source: 'en', target: 'es' })
            ]);

            return {
                titulo: tituloTraducido.translation,
                cultura: culturaTraducida.translation,
                dinastia: dinastiaTraducida.translation,
                fecha: fechaTraducida.translation
            };
        }));
        console.log(traducciones);
        res.json(traducciones);
    } catch (err) {
        console.error('Error al traducir los datos:', err);
        res.status(500).send('Error al traducir los datos');
    }
});

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.listen(port, () => {
    console.log(`Servidor iniciado en puerto ${port}`);
});

// app.get('/api/departments', async (req, res) => {
//     try {
//         const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching departments' });
//     }
// });

// app.get('/api/search', async (req, res) => {
//     try {
//         const { department, keyword, location } = req.query;
//         let url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?';
//         if (department) url += `departmentId=${department}&`;
//         if (keyword) url += `q=${encodeURIComponent(keyword)}&`;
//         if (location) url += `q=${encodeURIComponent(location)}&`;
        
//         const response = await fetch(url);
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: 'Error performing search' });
//     }
// });

// //app.get('/api/object/:id', async (req, res) => {
//     try {
//         const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${req.params.id}`);
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching object details' });
//     }
// });